import { useThree } from "@react-three/fiber";
import useXRStore from "engine/useXRStore";
import { useEffect, useRef } from "react";

import createMagicBackend from "./magicBackend";

import type { Backend } from "lib/types/engine";
import type { PropsWithChildren } from "react";
// NB: relative type import path resolves downstream type issues
import type { MagicSessionOptions } from "./magicBackend";

export interface MagicSessionProps extends PropsWithChildren {
  /** Magic window session options. */
  options?: MagicSessionOptions;
}

/**
 * Manage the magic window AR backend.
 * Registers with the XR session provider and provides device orientation
 * tracking with camera passthrough capabilities.
 */
const MagicSession = ({ options = {}, children }: MagicSessionProps) => {
  const { scene, camera, gl } = useThree();

  const { registerBackend, unregisterBackend } = useXRStore();

  const backendRef = useRef<Backend | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    // already initialized for this component instance
    if (backendRef.current) return;

    let cancelled = false;

    const initSession = async () => {
      try {
        // create magic window backend with device orientation and camera passthrough
        const backend = createMagicBackend(optionsRef.current);

        if (cancelled) return;

        await registerBackend(backend, { scene, camera, renderer: gl });

        backendRef.current = backend;
      } catch (err) {
        console.error("[MagicSession] Failed to initialize:", err);
      }
    };

    initSession();

    return () => {
      cancelled = true;

      if (backendRef.current) {
        unregisterBackend(backendRef.current);

        backendRef.current = null;
      }
    };
  }, [scene, camera, gl, registerBackend, unregisterBackend]);

  return children;
};

export default MagicSession;
