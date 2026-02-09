import { useFrame } from "@react-three/fiber";
import useXRStore from "engine/useXRStore";
import { BACKEND_TYPES } from "lib/types/engine";
import { useRef } from "react";

import type { Backend } from "lib/types/engine";
import type { PropsWithChildren } from "react";
import type { Group } from "three";
import type { MagicInternal } from "./magicBackend";

export interface WorldAnchorProps extends PropsWithChildren {
  /** Position offset relative to the initial orientation. */
  position?: [number, number, number];
  /** Rotation offset in radians. */
  rotation?: [number, number, number];
  /** Scale factor. */
  scale?: number | [number, number, number];
  /**
   * Whether the anchor should face the camera every frame.
   * @default false
   */
  isBillboard?: boolean;
}

/**
 * World anchor that positions children relative to the device's initial orientation.
 * Uses the magic window backend's orientation data for world-space positioning.
 */
const WorldAnchor = ({
  position = [0, 0, -2],
  rotation = [0, 0, 0],
  scale = 1,
  isBillboard = false,
  children,
}: WorldAnchorProps) => {
  const groupRef = useRef<Group>(null);

  const backends = useXRStore((state) => state.backends) as Map<
    string,
    Backend
  >;

  useFrame(({ camera }) => {
    const group = groupRef.current;
    if (!group) return;

    const magicBackend = backends.get(BACKEND_TYPES.MAGIC) as
      | Backend<MagicInternal>
      | undefined;

    if (!magicBackend) return;

    const internal = magicBackend.getInternal();

    if (!internal.hasInitialOrientation) return;

    // Apply position offset
    group.position.set(position[0], position[1], position[2]);

    // Apply rotation offset
    group.rotation.set(rotation[0], rotation[1], rotation[2]);

    // Apply scale
    if (typeof scale === "number") {
      group.scale.setScalar(scale);
    } else {
      group.scale.set(scale[0], scale[1], scale[2]);
    }

    // Billboard: face the camera every frame
    if (isBillboard) {
      group.lookAt(camera.position);
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export default WorldAnchor;
