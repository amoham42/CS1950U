import React, { useRef, useEffect } from "react";
import { initializeScene } from "./scene/main";
import { styles } from "../styles";
import gsap from "gsap";

const SplineScene = ({ transition, onSky, onHome, value }) => {
  const mountRef = useRef(null);
  const cameraRef = useRef(null);
  const lightRef = useRef(null);
  useEffect(() => {
    const cleanup = initializeScene(mountRef, cameraRef, lightRef);

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  useEffect(() => {
    if (cameraRef.current) {
      const targetPosition = onSky
        ? { x: 0.3, y: 2, z: 4 }
        : { x: 2.8, y: 0.9, z: 1.5 };
      let targetRotation = onSky ? { x: -0.2, y: 0.05, z: 0 } : { x: 0, y: 1.078, z: 0 };
      targetRotation.x = onHome ? targetRotation.x : 0.42;
      
      gsap.to(cameraRef.current.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 1,
      });
      gsap.to(cameraRef.current.rotation, {
        x: targetRotation.x,
        y: targetRotation.y,
        z: targetRotation.z,
        duration: 1,
      });
    }
  }, [onSky]);

  return (
    <div className="h-screen w-full mx-auto relative">
      <div ref={mountRef} className="h-screen w-full"></div>
      <div
        className={`absolute top-[10%] left-[10%] max-w-7xl flex flex-row items-start gap-5 transition-transform duration-400 ${
          transition ? "transform -translate-x-full" : "transform translate-x-0"
        }`}
      >
        <h1 className={`${transition ? "text-transparent" : styles.heroHeadText}`}>
          Welcome to <br />
          <span className={`${transition ? "text-transparent" : styles.titleHeadText}`}>
            3D Game Engines
          </span>
        </h1>
      </div>
    </div>
  );
};

export default SplineScene;
