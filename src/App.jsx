import { BrowserRouter } from "react-router-dom";
import { About, Hero, Classes, Assignments, Resources, Labs, Navbar } from "./components";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "./constants";

const BASE_URL = import.meta.env.BASE_URL;

// Restore the open page when the site is loaded on a deep link such as /CS1950U/labs.
const getInitialOverlay = () => {
  const path = "/" + window.location.pathname.slice(BASE_URL.length).replace(/\/+$/, "");
  return navLinks.find((nav) => nav.path === path)?.title ?? "Home";
};


const App = () => {
  const [scrollValue, setScrollValue] = useState(-1);
  const [showAbout, setShowAbout] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [onSky, setOnSky] = useState(false);
  const [onHome, setOnHome] = useState(true);
  const [rotationValue, setRotationValue] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  // Created lazily on first use: the 4.5 MB campfire track is only fetched if the visitor turns
  // sound on (previously a new Audio element was constructed on every render).
  const audioElement = useRef(null);
  const getAudio = () => {
    audioElement.current ??= new Audio(`${BASE_URL}fire.mp3`);
    return audioElement.current;
  };

  const [currentOverlay, setCurrentOverlay] = useState(getInitialOverlay);

  const handleShowOverlay = (componentName) => {
    setCurrentOverlay(componentName);
  };

  const handleShowTitle = (value) => {
    setShowTitle(value);
  };

  const handleOnSky = (value) => {
    setOnSky(value);
  };

  const handleOnHome = (value) => {
    setOnHome(value);
  };
  const handleAudio = (value) => {
    setAudioEnabled(value);
    const audioRef = getAudio();
    if(value){
      audioRef.loop = true;
    audioRef.play()
      .then(() => setAudioEnabled(true))
      .catch((error) => console.error("Audio playback failed", error));
    } else if (!value){
      try {
        audioRef.loop = false;
        audioRef.pause();
        setAudioEnabled(false);
      } catch (error) {
        console.error("Audio pause failed", error);
      }
    }
  };

  const handleWheel = (event) => {
    setScrollValue((prev) => {
      const newValue = prev + (event.deltaY > 0 ? 1 : -1);
      const clampedValue = Math.min(15, Math.max(newValue, -5));
      if (clampedValue < 0) {
        setShowAbout(false);
        setShowTitle(false);
      } else {
        setShowAbout(true);
        setShowTitle(true);
      }
      setRotationValue(clampedValue);
      return clampedValue;
    });
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <BrowserRouter basename={BASE_URL} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="relative z-0 bg-primary">
        <Navbar initialActive={currentOverlay} onOverlaySelect={handleShowOverlay} setAudio={handleAudio} audio={audioEnabled}/>
        <div className="relative h-screen">
          <Hero transition={showTitle} onSky={onSky} onHome={onHome} value={rotationValue}/>
        </div>
            {currentOverlay === "Home" && <About showAbout={showAbout} onSky={handleOnSky} onHome={handleOnHome} />}
            {currentOverlay === "Classes" && <Classes onChange={handleShowTitle} onSky={handleOnSky}  onHome={handleOnHome}/>}
            {currentOverlay === "Assignments" && <Assignments onChange={handleShowTitle} onSky={handleOnSky} onHome={handleOnHome}/>}
            {currentOverlay === "Resources" && <Resources onChange={handleShowTitle} onSky={handleOnSky} onHome={handleOnHome}/>}
            {currentOverlay === "Labs" && <Labs onChange={handleShowTitle} onSky={handleOnSky} onHome={handleOnHome}/>}
      </div>
    </BrowserRouter>
  );
};

export default App;
