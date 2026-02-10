import { MagicSession, WorldAnchor, XR } from "@omnidotdev/rdk";
import { Canvas } from "@react-three/fiber";
import { FloatingCrystal, OrientationHUD } from "components";

const App = () => (
  <>
    <OrientationHUD />

    <Canvas>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <XR>
        <MagicSession>
          {/* World-anchored objects at different positions */}
          <WorldAnchor position={[0, 0, -3]}>
            <FloatingCrystal isAnimated color="#4ecdc4" />
          </WorldAnchor>

          <WorldAnchor position={[-1.5, 0.5, -4]} isBillboard>
            <mesh>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial
                color="#ff6b6b"
                emissive="#ff2222"
                emissiveIntensity={0.2}
              />
            </mesh>
          </WorldAnchor>

          <WorldAnchor position={[1.5, -0.5, -5]}>
            <FloatingCrystal color="#45b7d1" scale={0.6} />
          </WorldAnchor>
        </MagicSession>
      </XR>
    </Canvas>
  </>
);

export default App;
