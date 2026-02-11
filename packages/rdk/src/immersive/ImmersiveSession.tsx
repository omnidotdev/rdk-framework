import { createXRStore, XR as ReactThreeXR } from "@react-three/xr";
import { BACKEND_TYPES } from "lib/types/engine";
import { useEffect, useMemo } from "react";

import { getXRStore } from "../engine/useXRStore";

import type { Backend } from "lib/types/engine";
import type { PropsWithChildren } from "react";

/**
 * Create a minimal immersive backend for tracking purposes.
 * WebXR is managed by @react-three/xr, so this is just a marker.
 */
const createImmersiveBackend = (): Backend => ({
  type: BACKEND_TYPES.IMMERSIVE,
  init: () => {},
  getInternal: () => null,
});

/**
 * Immersive session component for WebXR AR/VR experiences, powered by `@react-three/xr`.
 */
const ImmersiveSession = ({ children }: PropsWithChildren) => {
  const xrStore = useMemo(() => createXRStore(), []);

  useEffect(() => {
    const rdkStore = getXRStore();
    const backend = createImmersiveBackend();

    // register immersive backend for tracking
    rdkStore.backends.set(BACKEND_TYPES.IMMERSIVE, backend);

    // connect XR store to RDK store
    rdkStore.setImmersiveStore(xrStore);

    return () => {
      // clean up on unmount
      rdkStore.backends.delete(BACKEND_TYPES.IMMERSIVE);
      rdkStore.setImmersiveStore(null);
    };
  }, [xrStore]);

  return <ReactThreeXR store={xrStore}>{children}</ReactThreeXR>;
};

export default ImmersiveSession;
