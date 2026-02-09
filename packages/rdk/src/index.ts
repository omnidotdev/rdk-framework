export * from "./engine";
export {
  getXRStore,
  subscribeToXRStore,
} from "./engine/useXRStore";
export * from "./fiducial";
export * from "./geolocation";
export * from "./immersive";
export { BACKEND_TYPES } from "./lib/types/engine";
export * from "./magic";

export type {
  Backend,
  BackendType,
} from "./lib/types/engine";
export type { ImmersiveMode } from "./lib/types/immersive";

// pull in `@react-three/fiber` types to make Three.js JSX elements available downstream; this resolves issues like `<ambientLight />` throwing type error: "Property 'ambientLight' does not exist on type 'JSX.IntrinsicElements'. (ts 2339)"
import "@react-three/fiber";
