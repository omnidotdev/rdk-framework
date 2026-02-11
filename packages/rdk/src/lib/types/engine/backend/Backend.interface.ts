import type { BackendInitArgs } from "./BackendInitArgs.interface";

/**
 * Backend type constants.
 */
export const BACKEND_TYPES = {
  FIDUCIAL: "fiducial",
  GEOLOCATION: "geolocation",
  IMMERSIVE: "immersive",
  MAGIC: "magic",
} as const;

/**
 * Backend type discriminator.
 */
export type BackendType = (typeof BACKEND_TYPES)[keyof typeof BACKEND_TYPES];

/**
 * Backend interface that defines the contract for backend implementations (fiducial, geolocation, WebXR, etc.).
 * @template T type returned by `getInternal()``
 */
export interface Backend<T = unknown> {
  /**
   * Backend type discriminator for type-safe discovery.
   */
  readonly type: BackendType;
  /**
   * Initialize the backend with the provided arguments.
   * @param args initialization arguments containing scene, camera, and renderer
   * @returns promise that resolves when initialization is complete, or void for synchronous init
   */
  init(args: BackendInitArgs): Promise<void> | void;
  /**
   * Update the backend on each frame.
   * @param dt delta time since last frame in seconds
   */
  update?(dt?: number): void;
  /**
   * Clean up resources when the backend is no longer needed.
   */
  dispose?(): void;
  /**
   * Get internal SDK objects for advanced use cases.
   * @returns internal objects specific to the backend implementation
   */
  getInternal(): T;
}
