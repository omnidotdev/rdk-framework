# @omnidotdev/rdk

## 0.9.0

### Minor Changes

- [#67](https://github.com/omnidotdev/rdk-framework/pull/67) [`bb058b5`](https://github.com/omnidotdev/rdk-framework/commit/bb058b5afa0ba72e2b31a6e52678f915c7fa4d87) Thanks [@coopbri](https://github.com/coopbri)! - Add magic window module with camera passthrough and device orientation tracking

- [#65](https://github.com/omnidotdev/rdk-framework/pull/65) [`67807e7`](https://github.com/omnidotdev/rdk-framework/commit/67807e7b82a33fd4639ac0a2a8d6f2bcfce541e9) Thanks [@coopbri](https://github.com/coopbri)! - Add subpath exports for fiducial, geolocation, and immersive modules with multi-entry Vite build

## 0.8.0

### Minor Changes

- [#59](https://github.com/omnidotdev/rdk/pull/59) [`584773c`](https://github.com/omnidotdev/rdk/commit/584773c90dc280fd9534d5b4165950fcca446068) Thanks [@coopbri](https://github.com/coopbri) and [@nickw1](https://github.com/nickw1)! - Add `GeoLine` and `GeoPolygon` components for rendering paths and areas in AR space using lon/lat coordinates. These components complete the core GeoJSON geometry support:

  - `GeoLine`: Renders lines (example use cases are roads, paths, routes) using Three.js `Line2` for variable width support
  - `GeoPolygon`: Renders filled polygons (zones, areas, boundaries) with optional holes

  Both components accept GeoJSON-style coordinate arrays `[lon, lat, elevation?]` for direct compatibility with mapping APIs and the `locar-tiler` library.

## 0.7.0

### Minor Changes

- [#56](https://github.com/omnidotdev/rdk/pull/56) [`39954c3`](https://github.com/omnidotdev/rdk/commit/39954c39ad6e35a389ba06a16915d4ec186dead2) Thanks [@coopbri](https://github.com/coopbri)! - Add status flags to backend hooks for safe destructuring.

  `useGeolocationBackend()` and `useFiducialBackend()` now return an object with `isPending` and `isSuccess` boolean flags instead of returning `null` on first render. This enables safe destructuring without null checks:

  ```tsx
  // before (crashed on first render)
  const geo = useGeolocationBackend();
  const locar = geo?.locar;

  // after (safe destructuring)
  const { locar, isPending, isSuccess } = useGeolocationBackend();

  if (isSuccess && locar) {
    const worldCoords = locar.lonLatToWorldCoords(lon, lat);
  }
  ```

  New exported types: `GeolocationBackendState`, `FiducialBackendState`

## 0.6.0

### Minor Changes

- [#52](https://github.com/omnidotdev/rdk/pull/52) [`bdb98ff`](https://github.com/omnidotdev/rdk/commit/bdb98ff56b01d3adb0b30d66c35ce0cad4f2ba27) Thanks [@coopbri](https://github.com/coopbri)! - Refactor backend registry from array to Map for O(1) type-based lookup. Add `type` discriminator to Backend interface and new `useFiducialBackend`/`useGeolocationBackend` hooks for type-safe backend access. Move anchor registry into geolocation backend.

## 0.5.2

### Patch Changes

- [#41](https://github.com/omnidotdev/rdk/pull/41) [`e4db1be`](https://github.com/omnidotdev/rdk/commit/e4db1be2302a0c38a2a3be273d903daa61b89833) Thanks [@coopbri](https://github.com/coopbri)! - Improve geolocation module types

## 0.5.1

### Patch Changes

- [#37](https://github.com/omnidotdev/rdk/pull/37) [`5afc4b2`](https://github.com/omnidotdev/rdk/commit/5afc4b204fac397ba8aec24f6f42176a927b63fc) Thanks [@coopbri](https://github.com/coopbri)! - Stabilized `options` in `GeolocationSession` and `FiducialSession` to prevent an infinite render loop when it was not provided as props

- [#39](https://github.com/omnidotdev/rdk/pull/39) [`319f2d0`](https://github.com/omnidotdev/rdk/commit/319f2d094d70b2689a8c8dd18003238da92f82e6) Thanks [@nickw1](https://github.com/nickw1)! - Restored missing `locar.getLastKnownLocation()` invocation in `GeolocationAnchor`

## 0.5.0

### Minor Changes

- [#35](https://github.com/omnidotdev/rdk/pull/35) [`c66a582`](https://github.com/omnidotdev/rdk/commit/c66a582cec4f261b9947b12643ec525283ae0e9f) Thanks [@coopbri](https://github.com/coopbri)! - **BREAKING:** Changed geolocation module callback prop names: `onAttached` to `onAttach` and `onGpsUpdated` to `onGpsUpdate`. This normalizes the callbacks to present tense, following the React convention.

### Patch Changes

- [#33](https://github.com/omnidotdev/rdk/pull/33) [`826cdb5`](https://github.com/omnidotdev/rdk/commit/826cdb581c8833b4448310ea65031002f56abf2a) Thanks [@coopbri](https://github.com/coopbri)! - Reduced bundle size by properly externalizing dependencies

## 0.4.2

### Patch Changes

- [#31](https://github.com/omnidotdev/rdk/pull/31) [`a0ac723`](https://github.com/omnidotdev/rdk/commit/a0ac7236a187aeceb30ab0bbd9b673df513a6a5b) Thanks [@coopbri](https://github.com/coopbri)! - Fixed a regression where already-registered backends would be reinitialized, causing a render loop

## 0.4.1

### Patch Changes

- [#27](https://github.com/omnidotdev/rdk/pull/27) [`d808716`](https://github.com/omnidotdev/rdk/commit/d808716960b1268387cf7cd9d8d7814e8f473223) Thanks [@nickw1](https://github.com/nickw1)! - Added `onGpsUpdated` callback to geolocation backend

- [#30](https://github.com/omnidotdev/rdk/pull/30) [`4027439`](https://github.com/omnidotdev/rdk/commit/40274394940e35b4e8401b61bfee8621adc68863) Thanks [@coopbri](https://github.com/coopbri)! - - Removed `XRStoreActions` and `XRStoreState` library exports
  - Added `FiducialAnchorProps` and `GeolocationAnchorProps` library exports
  - Fixed `GeolocationSession` and `FiducialSession` `options` prop being typed to `any`

## 0.4.0

### Minor Changes

- [#26](https://github.com/omnidotdev/rdk/pull/26) [`fa31da4`](https://github.com/omnidotdev/rdk/commit/fa31da44bb86f403dff9d553e5ba792531b7f462) Thanks [@coopbri](https://github.com/coopbri)! - Added native WebXR support, powered by [`@react-three/xr`](https://github.com/pmndrs/xr).

  **BREAKING:** Removed `cameraSource` prop from XR component. Sessions now auto-configure themselves:

  ```tsx
  // before
  <XR cameraSource="video">
    <FiducialSession />
  </XR>

  // after
  <XR>
    {/* auto-configures video mode */}
    <FiducialSession />
  </XR>
  ```

  **New Features:**

  - `ImmersiveSession` component for WebXR AR/VR
  - Nested `@react-three/xr`'s store nested under `useXRStore`'s `immersive` property
  - Added `ImmersiveMode` type export, which maps to and from [official WebXR modes](https://www.w3.org/TR/webxr/#xrsessionmode-enum) (`immersive-ar` ↔ `ar`, `immersive-vr` ↔ `vr`, `inline` ↔ `inline`)

## 0.3.0

### Minor Changes

- [#22](https://github.com/omnidotdev/rdk/pull/22) [`95e4a7c`](https://github.com/omnidotdev/rdk/commit/95e4a7c0bc7b528320d6695436d8b098c305aa27) Thanks [@coopbri](https://github.com/coopbri)! - Migrated the RDK state manager from React Context to Zustand for better performance, flexibility, and access outside of React contexts. 🐻

  **Breaking Changes:**

  - Replaced `XRContext` and `useXR` hook with Zustand store (`useXRStore`)
  - Renamed types
    - `XRBackend` → `Backend`
    - `XRContextValue` → `ContextValue`

  **New Library Exports:**

  - `useXRStore`: Main Zustand store hook for full state access
  - `getXRStore`: Non-React access to store state
  - `subscribeToXRStore`: Non-React subscription to store changes
  - `XRStore`, `XRStoreState`, `XRStoreActions`: TypeScript types

  **Migration Guide:**

  Replace `useXR()` with direct store selectors:

  - `useXR().camera` → `useXRStore((state) => state.camera)`
  - `useXR().backends` → `useXRStore((state) => state.backends)`
  - Full store access: `useXRStore()` or `useXRStore(selector)`

  Replace types:

  - `XRBackend` → `Backend`
  - `XRContextValue` → `ContextValue`

## 0.2.2

### Patch Changes

- [#19](https://github.com/omnidotdev/rdk/pull/19) [`f2b80f6`](https://github.com/omnidotdev/rdk/commit/f2b80f6f78d3252c21cb3921bd4e8d46e81c0a4a) Thanks [@nickw1](https://github.com/nickw1)! - Fix anchor initialization by using `getLastKnownLocation()` (LocAR 0.1.4) to seed GPS data immediately instead of waiting for a new update. This ensures anchors are added to the scene reliably even when GPS arrives before anchor creation.

## 0.2.1

### Patch Changes

- [#17](https://github.com/omnidotdev/rdk/pull/17) [`68b6de2`](https://github.com/omnidotdev/rdk/commit/68b6de2709183129f0fa1f18695d27f38c08caca) Thanks [@nickw1](https://github.com/nickw1)! - Remove unnecessary permission calls in geolocation backend

## 0.2.0

### Minor Changes

- [#8](https://github.com/omnidotdev/rdk/pull/8) [`57d2439`](https://github.com/omnidotdev/rdk/commit/57d243984bcdc2d659e69a75cbc9ebbb1db7c08a) Thanks [@coopbri](https://github.com/coopbri)! - Added experimental geolocation augmented reality support

- [#13](https://github.com/omnidotdev/rdk/pull/13) [`d58ef41`](https://github.com/omnidotdev/rdk/commit/d58ef4154f00492d31173ee2553df1aa396ea2a3) Thanks [@coopbri](https://github.com/coopbri)! - **BREAKING:** Removed `XRCanvas` and its explicit `mode` prop in favor of a composable `XR` context component. An explicit R3F `Canvas` ancestor is now required. Now, usage works like this:

  ```tsx
  import { Canvas } from "@react-three/fiber";
  import {
    FiducialAnchor,
    FiducialSession,
    GeolocationAnchor,
    GeolocationSession,
    XR,
  } from "@omnidotdev/rdk";

  <Canvas>
    <XR>
      <GeolocationSession>
        <GeolocationAnchor>{/* ... */}</GeolocationAnchor>
      </GeolocationSession>
    </XR>
  </Canvas>

  // ...

  <Canvas>
    <XR>
      <FiducialSession>
        <FiducialAnchor>{/* ... */}</FiducialAnchor>
      </FiducialSession>
    </XR>
  </Canvas>
  ```

  This results in a more composable architecture.

  Importantly, `GeolocationSession` and `FiducialSession` cannot be used in the same XR context. This is because their underlying libraries (LocAR.js and AR.js, respectively) both try to access the same camera/video, thus fight over it. A console error will be thrown if both are detected.

## 0.1.0

### Minor Changes

- [#1](https://github.com/omnidotdev/rdk/pull/1) [`2ead4ed`](https://github.com/omnidotdev/rdk/commit/2ead4edf2487667d5667ec9dc6e5182b798c0165) Thanks [@coopbri](https://github.com/coopbri)! - Initial release with experimental fiducial marker-based augmented reality support
