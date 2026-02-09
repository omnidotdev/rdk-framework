import { BACKEND_TYPES } from "lib/types/engine";
import * as THREE from "three";

import type { Backend, BackendInitArgs } from "lib/types/engine";

/**
 * Internal state exposed by the magic window backend.
 */
export interface MagicInternal {
  videoElement: HTMLVideoElement | null;
  videoTexture: THREE.VideoTexture | null;
  stream: MediaStream | null;
  orientationEnabled: boolean;
  orientationPermissionGranted: boolean;
  worldAnchoringEnabled: boolean;
  currentOrientation: { alpha: number; beta: number; gamma: number };
  initialOrientation: { alpha: number; beta: number; gamma: number };
  hasInitialOrientation: boolean;
}

/**
 * Options for the magic window backend.
 */
export interface MagicSessionOptions {
  /** Whether to enable device orientation tracking. */
  enableOrientation?: boolean;
  /** Whether to enable world anchoring (orientation-based positioning). */
  enableWorldAnchoring?: boolean;
  /**
   * Smoothing factor for orientation interpolation (0-1).
   * Lower values produce smoother but more delayed movement.
   * @default 0.15
   */
  smoothingFactor?: number;
  /**
   * Dead zone threshold in degrees.
   * Orientation changes smaller than this value are ignored to prevent jitter.
   * @default 0.5
   */
  deadZone?: number;
  /** Custom webcam constraints. */
  webcamConstraints?: MediaStreamConstraints;
}

// Default smoothing parameters
const DEFAULT_SMOOTHING_FACTOR = 0.15;
const DEFAULT_DEAD_ZONE = 0.5;

/**
 * Create a magic window AR backend.
 * Provides device orientation tracking and camera passthrough without
 * requiring WebXR, using standard browser APIs (DeviceOrientation + getUserMedia).
 */
const createMagicBackend = (
  options?: MagicSessionOptions,
): Backend<MagicInternal> => {
  let videoElement: HTMLVideoElement | null = null;
  let videoTexture: THREE.VideoTexture | null = null;
  let stream: MediaStream | null = null;
  let resizeHandler: (() => void) | undefined;

  // Orientation state
  let orientationEnabled = options?.enableOrientation ?? true;
  let orientationPermissionGranted = false;
  let worldAnchoringEnabled = options?.enableWorldAnchoring ?? true;
  let orientationHandler: ((event: DeviceOrientationEvent) => void) | null =
    null;

  const smoothingFactor = options?.smoothingFactor ?? DEFAULT_SMOOTHING_FACTOR;
  const deadZone = options?.deadZone ?? DEFAULT_DEAD_ZONE;

  // Raw orientation values (unsmoothed)
  const rawOrientation = { alpha: 0, beta: 0, gamma: 0 };
  // Smoothed orientation values
  const currentOrientation = { alpha: 0, beta: 0, gamma: 0 };
  // Initial orientation captured at start (used for relative calculations)
  const initialOrientation = { alpha: 0, beta: 0, gamma: 0 };
  let hasInitialOrientation = false;

  // Three.js refs
  let cameraRef: THREE.Camera | null = null;
  let rendererRef: THREE.WebGLRenderer | null = null;
  let sceneRef: THREE.Scene | null = null;

  /**
   * Apply dead zone filtering to an orientation value.
   */
  const applyDeadZone = (current: number, target: number): number => {
    const delta = Math.abs(target - current);
    return delta < deadZone ? current : target;
  };

  /**
   * Lerp between two values.
   */
  const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

  /**
   * Request device orientation permission on iOS 13+.
   */
  const requestOrientationPermission = async (): Promise<boolean> => {
    // Check for iOS DeviceOrientationEvent permission API
    const DeviceOrientationEventConstructor =
      DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<"granted" | "denied">;
      };

    if (
      typeof DeviceOrientationEventConstructor.requestPermission === "function"
    ) {
      try {
        const response =
          await DeviceOrientationEventConstructor.requestPermission();

        if (response === "granted") {
          orientationPermissionGranted = true;
          return true;
        }

        console.warn("[MagicBackend] Device orientation permission denied");
        return false;
      } catch (err) {
        console.error(
          "[MagicBackend] Error requesting orientation permission:",
          err,
        );
        return false;
      }
    }

    // Non-iOS browsers don't require explicit permission
    orientationPermissionGranted = true;
    return true;
  };

  /**
   * Set up device orientation listener.
   */
  const setupOrientationListener = () => {
    orientationHandler = (event: DeviceOrientationEvent) => {
      rawOrientation.alpha = event.alpha ?? 0;
      rawOrientation.beta = event.beta ?? 0;
      rawOrientation.gamma = event.gamma ?? 0;

      // Capture initial orientation on first valid reading
      if (
        !hasInitialOrientation &&
        (rawOrientation.alpha !== 0 ||
          rawOrientation.beta !== 0 ||
          rawOrientation.gamma !== 0)
      ) {
        initialOrientation.alpha = rawOrientation.alpha;
        initialOrientation.beta = rawOrientation.beta;
        initialOrientation.gamma = rawOrientation.gamma;
        hasInitialOrientation = true;
      }
    };

    window.addEventListener("deviceorientation", orientationHandler, true);
  };

  /**
   * Create and attach the video element for camera passthrough.
   */
  const setupVideoPassthrough = async (
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
  ): Promise<void> => {
    const constraints: MediaStreamConstraints = options?.webcamConstraints ?? {
      video: { facingMode: "environment" },
    };

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      console.error("[MagicBackend] Failed to access camera:", err);
      throw err;
    }

    videoElement = document.createElement("video");
    videoElement.srcObject = stream;
    videoElement.setAttribute("playsinline", "");
    videoElement.setAttribute("autoplay", "");
    videoElement.muted = true;

    // Style the video element as a fullscreen background
    videoElement.style.position = "fixed";
    videoElement.style.top = "0";
    videoElement.style.left = "0";
    videoElement.style.width = "100vw";
    videoElement.style.height = "100vh";
    videoElement.style.objectFit = "cover";
    videoElement.style.zIndex = "-1";
    videoElement.style.pointerEvents = "none";

    document.body.appendChild(videoElement);

    await videoElement.play();

    // Create a video texture for the scene background
    videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.colorSpace = THREE.SRGBColorSpace;

    scene.background = videoTexture;

    // Make the renderer transparent so the video shows through
    renderer.setClearColor(0x000000, 0);
  };

  return {
    type: BACKEND_TYPES.MAGIC,

    async init({ scene, camera, renderer }: BackendInitArgs) {
      cameraRef = camera;
      rendererRef = renderer;
      sceneRef = scene;

      // Set up video passthrough
      await setupVideoPassthrough(scene, renderer);

      // Set up device orientation
      if (orientationEnabled) {
        const granted = await requestOrientationPermission();

        if (granted) {
          setupOrientationListener();
        }
      }

      // Handle resize
      const doResize = () => {
        if (!rendererRef || !cameraRef) return;

        const w = window.innerWidth;
        const h = window.innerHeight;

        rendererRef.setSize(w, h, false);

        // Update camera aspect ratio
        // TODO improve this, these attributes are part of Three.js perspective cameras; figure whether custom cameras should be allowed here
        (cameraRef as any).aspect = w / h;
        (cameraRef as any).updateProjectionMatrix?.();
      };

      doResize();

      window.addEventListener("resize", doResize);
      resizeHandler = doResize;
    },

    update() {
      if (!orientationEnabled || !orientationPermissionGranted) return;

      // Apply dead zone and smoothing to orientation values
      const targetAlpha = applyDeadZone(
        currentOrientation.alpha,
        rawOrientation.alpha,
      );
      const targetBeta = applyDeadZone(
        currentOrientation.beta,
        rawOrientation.beta,
      );
      const targetGamma = applyDeadZone(
        currentOrientation.gamma,
        rawOrientation.gamma,
      );

      currentOrientation.alpha = lerp(
        currentOrientation.alpha,
        targetAlpha,
        smoothingFactor,
      );
      currentOrientation.beta = lerp(
        currentOrientation.beta,
        targetBeta,
        smoothingFactor,
      );
      currentOrientation.gamma = lerp(
        currentOrientation.gamma,
        targetGamma,
        smoothingFactor,
      );

      // Apply orientation to camera if world anchoring is enabled
      if (worldAnchoringEnabled && cameraRef && hasInitialOrientation) {
        const degToRad = THREE.MathUtils.degToRad;

        // Compute relative orientation from initial
        const relAlpha = currentOrientation.alpha - initialOrientation.alpha;
        const relBeta = currentOrientation.beta - initialOrientation.beta;
        const relGamma = currentOrientation.gamma - initialOrientation.gamma;

        // Apply Euler rotation (ZXY order is standard for device orientation)
        const euler = new THREE.Euler(
          degToRad(relBeta),
          degToRad(relAlpha),
          degToRad(-relGamma),
          "ZXY",
        );

        cameraRef.quaternion.setFromEuler(euler);
      }

      // Update video texture if present
      if (videoTexture) {
        videoTexture.needsUpdate = true;
      }
    },

    dispose() {
      // Remove orientation listener
      if (orientationHandler) {
        window.removeEventListener("deviceorientation", orientationHandler);
        orientationHandler = null;
      }

      // Remove resize handler
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
        resizeHandler = undefined;
      }

      // Stop media stream tracks
      if (stream) {
        for (const track of stream.getTracks()) {
          track.stop();
        }
        stream = null;
      }

      // Clean up video element
      if (videoElement) {
        videoElement.pause();
        videoElement.srcObject = null;
        videoElement.parentNode?.removeChild(videoElement);
        videoElement = null;
      }

      // Dispose video texture
      if (videoTexture) {
        videoTexture.dispose();
        videoTexture = null;
      }

      // Clear scene background if we set it
      if (sceneRef) {
        sceneRef.background = null;
      }

      // Reset state
      cameraRef = null;
      rendererRef = null;
      sceneRef = null;
      orientationEnabled = false;
      orientationPermissionGranted = false;
      worldAnchoringEnabled = false;
      hasInitialOrientation = false;
      currentOrientation.alpha = 0;
      currentOrientation.beta = 0;
      currentOrientation.gamma = 0;
      rawOrientation.alpha = 0;
      rawOrientation.beta = 0;
      rawOrientation.gamma = 0;
      initialOrientation.alpha = 0;
      initialOrientation.beta = 0;
      initialOrientation.gamma = 0;
    },

    getInternal: (): MagicInternal => ({
      videoElement,
      videoTexture,
      stream,
      orientationEnabled,
      orientationPermissionGranted,
      worldAnchoringEnabled,
      currentOrientation: { ...currentOrientation },
      initialOrientation: { ...initialOrientation },
      hasInitialOrientation,
    }),
  };
};

export default createMagicBackend;
