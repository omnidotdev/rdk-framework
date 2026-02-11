<div align="center">
  <img src="/assets/rdk-logo.png" width="350" />

  <h1 align="center">Reality Development Kit (RDK)</h1>

[Website (Coming Soon)](https://rdk.omni.dev) | [Docs (Coming Soon)](https://docs.omni.dev/rdk/overview) | [Provide feedback on Omni Backfeed](https://backfeed.omni.dev/workspaces/omni/projects/rdk) | [Join Omni community on Discord](https://discord.gg/omnidotdev)

</div>

**Omni Reality Development Kit (RDK)** is a React-first framework for building web-based XR experiences, from AR to VR, orchestrated through one unified API powered by Three.js and `react-three-fiber`.

> [!IMPORTANT]
> **Project Status:** 🚧 This project is **brand new**.
> Currently, fiducial marker-based AR via [AR.js](https://github.com/ar-js-org/ar.js), location-based AR via [LocAR.js](https://github.com/ar-js-org/locar.js), and WebXR via [`@react-three/xr`](https://github.com/pmndrs/xr) are working (see [`apps/`](./apps/) for demos), though they are **experimental**. Contributions (PRs, [Omni organization sponsorship](https://github.com/sponsors/omnidotdev)) appreciated.

## Overview

RDK unifies multiple spatial and XR technologies, such as AR.js for marker-based AR, LocAR.js for geolocation-based AR, and WebXR for device-native support under one React-first abstraction powered by Three.js.

| Capability/Use Case                  | Status          | Backend (Current or Proposed)                                                                        | Android | iOS            | Notes                                                                                     |
| ------------------------------------ | --------------- | ---------------------------------------------------------------------------------------------------- | ------- | -------------- | ----------------------------------------------------------------------------------------- |
| **Fiducial (Pattern/Barcode)**       | ⚗️ Experimental | [AR.js (ARToolKit)](https://github.com/ar-js-org/ar.js)                                              | ✅      | ✅             | Uses `.patt` or barcode markers. Reliable for printed markers. No WebXR dependency.       |
| **Image Tracking (Natural Feature)** | 🧭 Planned      | [AR.js (ARToolKit)](https://github.com/ar-js-org/ar.js)                                              | N/A     | N/A            | May use `.mind` or `XRTrackedImage`. Ideal for logos or posters. Requires image database. |
| **Geolocation / World Anchors**      | ⚗️ Experimental | [LocAR.js](https://github.com/ar-js-org/locar.js)                                                    | ✅      | ✅             | Uses GPS + compass; may later integrate Mapbox or Cesium.                                 |
| **Magic Window (Camera Passthrough)**| ⚗️ Experimental | DeviceOrientation + getUserMedia                                                                      | ✅      | ✅             | Camera passthrough with device orientation tracking. No WebXR dependency; works everywhere |
| **WebXR Native AR/VR Session**       | ⚗️ Experimental | [`@react-three/xr`](https://github.com/pmndrs/xr)                                                    | ✅      | ❌[^ios-webxr] | Entry point for immersive AR/VR sessions.                                                 |
| **Face Tracking**                    | 🧭 Planned      | -                                                                                                    | N/A     | N/A            | Uses webcam + ML model; lightweight and fast.                                             |
| **Body/Pose Tracking**               | 🧭 Planned      | [WebXR Body Tracking](https://github.com/immersive-web/body-tracking)                                | N/A     | N/A            | Real-time skeletal tracking. GPU/WebGL acceleration required.                             |
| **Hand Tracking**                    | 🧭 Planned      | -                                                                                                    | N/A     | N/A            | Supported on Chrome + Meta; ML fallback possible.                                         |
| **Plane/Surface Detection**          | 🧭 Planned      | [WebXR Hit Test API](https://immersive-web.github.io/hit-test)/ar.js (limited)                       | N/A     | N/A            | Enables AR object placement on flat surfaces.                                             |
| **Depth Sensing/Environment Mesh**   | 🧭 Planned      | [WebXR Depth Sensing API](https://immersive-web.github.io/depth-sensing)                             | N/A     | N/A            | Provides per-pixel depth; early spec.                                                     |
| **SLAM/Visual Positioning (VPS)**    | 🧭 Planned      | Custom                                                                                               | N/A     | N/A            | Requires world map data; long-term goal.                                                  |
| **Voice/Gesture Interaction**        | 🧭 Planned      | [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)/MediaPipe Gestures | N/A     | N/A            | Enables multimodal input: voice, hand, gaze.                                              |
| **Mixed Reality Compositing**        | 🧭 Planned      | WebXR Layers/CanvasCaptureStream                                                                     | N/A     | N/A            | Transparent overlays/live compositing.                                                    |

## Demos

Demo applications showcasing different AR capabilities can be seen in the `apps/` directory. View their READMEs for more information.

## Ecosystem

Since RDK builds on [`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber) and [`three.js`](https://github.com/mrdoob/three.js), the R3F and Three.js ecosystems are accessible to RDK. Eventually, more integrations with other frameworks and libraries will be explored, including RDK's own natural ecosystem.

## Performance

RDK is brand new, performance patterns are still being explored. However, we are committed to optimizing performance and ensuring a smooth user experience, and community discussion and benchmarks are appreciated.

For now, we proxy performance suggestions to [R3F's performance guide](https://r3f.docs.pmnd.rs/advanced/scaling-performance) where applicable. Great practices for scaling are outlined there, such as mesh instancing and resource caching.

## Getting Started

### Local Development

Use [Tilt](https://tilt.dev) for a unified development experience:

```bash
tilt up
```

or manually:

```bash
bun run dev      # start development servers
bun run build    # build all packages
bun run test     # run tests
```

#### Adding a New Module

If you want to add a new XR module to be orchestrated by the overarching RDK API:

1. Create `packages/rdk/src/[moduleName]`
2. Export the module files from `packages/rdk/src/index.ts`
3. If needed, add session compatibility checks to the XR store

See the `fiducial/` and `geolocation/` modules for reference implementations.

### Installation

Install RDK and core dependencies:

```bash
bun add @omnidotdev/rdk @react-three/fiber react react-dom three
```

Then install the extra dependencies you need based on your use case:

```bash
# for fiducial marker AR
bun add @ar-js-org/ar.js

# for location-based AR
bun add locar

# for WebXR immersive AR/VR
bun add @react-three/xr
```

See the demo applications for examples of usage:

- [`apps/fiducial-demo`](./apps/fiducial-demo): Fiducial marker tracking powered by AR.js
- [`apps/geolocation-demo`](./apps/geolocation-demo): GPS-based AR powered by LocAR.js
- [`apps/immersive-demo`](./apps/immersive-demo): WebXR powered by `@react-three/xr`
- [`apps/magic-demo`](./apps/magic-demo): Magic window camera passthrough with device orientation

## Goals: the "Why"

Web-based XR today is deeply fragmented: split between native SDKs (ARCore, ARKit) and the web, and further divided by platform politics.

Apple’s refusal to support WebXR on iOS despite supporting it on their Vision Pro headset leaves developers maintaining separate code paths for identical use cases.

RDK aims to unify these worlds under a single, web-native React API so that you can target browsers, Android, iOS, and XR headsets alike with minimal friction.

## Vision

Our long-term focus areas include:

- **Rust + WebAssembly** for on-device SLAM and visual positioning with near-native performance
- **WebGPU + Web Workers** for parallelized rendering and physics acceleration
- **Interoperable modules** designed to plug into any renderer or sensor source over time

## What about React Native?

RDK is designed for web-based XR. We may explore ways to integrate RDK with React Native to enable developers to build cross-platform XR applications using a single codebase, but this is not guaranteed. For now, take a look at [react-native-webgpu](https://github.com/wcandillon/react-native-webgpu). This library blends React Native, Three.js (react-three-fiber), and WebGPU. At the time of writing, it does not appear to support XR, but it could be extended to do so.

## What about Babylon.js?

Babylon.js support may be added in the future, but RDK is currently focused on the Three.js ecosystem. For React + Babylon.js (including XR support), take a look at:

- [Reactylon](https://www.reactylon.com)
- [react-babylonjs](https://github.com/brianzinn/react-babylonjs)

## Contributing

See Omni's [contributing docs](https://docs.omni.dev/contributing/overview).

## License

The code in this repository is licensed under MIT, &copy; [Omni LLC](https://omni.dev). See [LICENSE.md](LICENSE.md) for more information.

[^ios-webxr]: [iOS does not currently natively support WebXR](https://caniuse.com/webxr), but an iOS fallback is planned for the RDK immersive module.
