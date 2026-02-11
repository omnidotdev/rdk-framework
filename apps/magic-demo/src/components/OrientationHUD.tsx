import { BACKEND_TYPES, useXRStore } from "@omnidotdev/rdk";
import { useEffect, useRef, useState } from "react";

import type { Backend, MagicInternal } from "@omnidotdev/rdk";

const HUD_STYLES = {
  container: {
    position: "fixed" as const,
    top: "12px",
    left: "12px",
    padding: "12px 16px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "monospace",
    zIndex: 1000,
    lineHeight: 1.6,
    minWidth: "200px",
    backdropFilter: "blur(8px)",
  },
  label: {
    color: "#888",
    marginRight: "6px",
  },
  value: {
    color: "#4ecdc4",
  },
  title: {
    fontSize: "14px",
    fontWeight: 700,
    marginBottom: "6px",
    color: "#fff",
  },
  status: (isActive: boolean) => ({
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: isActive ? "#4ecdc4" : "#666",
    marginRight: "6px",
  }),
};

/**
 * Display live device orientation data as a DOM overlay.
 */
const OrientationHUD = () => {
  const backends = useXRStore((state) => state.backends);
  const [orientation, setOrientation] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [status, setStatus] = useState({
    hasInitial: false,
    permissionGranted: false,
  });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const poll = () => {
      const magicBackend = backends.get(BACKEND_TYPES.MAGIC) as
        | Backend<MagicInternal>
        | undefined;

      if (magicBackend) {
        const internal = magicBackend.getInternal();

        setOrientation({
          alpha: internal.currentOrientation.alpha,
          beta: internal.currentOrientation.beta,
          gamma: internal.currentOrientation.gamma,
        });

        setStatus({
          hasInitial: internal.hasInitialOrientation,
          permissionGranted: internal.orientationPermissionGranted,
        });
      }

      rafRef.current = requestAnimationFrame(poll);
    };

    rafRef.current = requestAnimationFrame(poll);

    return () => cancelAnimationFrame(rafRef.current);
  }, [backends]);

  const fmt = (deg: number) => deg.toFixed(1);

  return (
    <div style={HUD_STYLES.container}>
      <div style={HUD_STYLES.title}>Magic Window</div>

      <div>
        <span style={HUD_STYLES.status(status.permissionGranted)} />
        <span style={HUD_STYLES.label}>Permission:</span>
        <span>{status.permissionGranted ? "granted" : "pending"}</span>
      </div>

      <div>
        <span style={HUD_STYLES.status(status.hasInitial)} />
        <span style={HUD_STYLES.label}>Anchored:</span>
        <span>{status.hasInitial ? "yes" : "waiting"}</span>
      </div>

      <div style={{ marginTop: "6px" }}>
        <div>
          <span style={HUD_STYLES.label}>α</span>
          <span style={HUD_STYLES.value}>{fmt(orientation.alpha)}°</span>
        </div>
        <div>
          <span style={HUD_STYLES.label}>β</span>
          <span style={HUD_STYLES.value}>{fmt(orientation.beta)}°</span>
        </div>
        <div>
          <span style={HUD_STYLES.label}>γ</span>
          <span style={HUD_STYLES.value}>{fmt(orientation.gamma)}°</span>
        </div>
      </div>
    </div>
  );
};

export default OrientationHUD;
