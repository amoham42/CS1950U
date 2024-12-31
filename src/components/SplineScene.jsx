import React, { useRef, useEffect } from 'react';
import { styles } from "../styles";
import Spline from '@splinetool/react-spline';
import gsap from 'gsap';

const SplineScene = ({ transition, onSky }) => {

  const cameraRef = useRef(null);

  const handleLoad = (splineApp) => {
    cameraRef.current = splineApp._scene?.getObjectByName("Camera");
  };
  
  useEffect(() => {
    if (cameraRef.current) {
      if (onSky) {
        gsap.to(cameraRef.current.position, {
          x: 358.18,
          y: 483.79,
          z: 124.59,
          duration: 1,
        });
        gsap.to(cameraRef.current.rotation, {
          y: 2,
          duration: 1,
        });
      } else {
        gsap.to(cameraRef.current.position, {
          x: -32.4,
          y: 278.19,
          z: 327.3,
          duration: 1,
        });
        gsap.to(cameraRef.current.rotation, {
          y: 8.75,
          duration: 1,
        });
      }
    }
  }, [onSky]);

  return (
    <div className="h-screen w-full mx-auto relative">
      <Spline scene="https://prod.spline.design/E0TrSQj2N8D2wUPS/scene.splinecode" onLoad={handleLoad} />
      <div
        className={`absolute top-[10%] left-[10%] max-w-7xl flex flex-row items-start gap-5 transition-transform duration-400 ${
  transition ? "transform -translate-x-full" : "transform translate-x-0 "
}`}
      >
        <h1 className={`${transition ? "text-transparent" : styles.heroHeadText}`}>
          Welcome to <br />
          <span className={` ${transition ? "text-transparent" : styles.titleHeadText}`}>3D Game Engines</span>
        </h1>
      </div>
    </div>
  );
};

export default SplineScene;