import { useEffect } from "react";
import Scene from "./Scene";

const CharacterModel = () => {
  useEffect(() => {
    const isDesktop = window.innerWidth > 1024;
    console.log(isDesktop ? "DESKTOP CHARACTER MOUNTED" : "MOBILE CHARACTER MOUNTED");
    console.log(`[CharacterModel Mount Diagnostics] innerWidth=${window.innerWidth} outerWidth=${window.outerWidth} screen.width=${window.screen.width} devicePixelRatio=${window.devicePixelRatio} isDesktopView=${isDesktop}`);
    return () => {
      console.log(`[CharacterModel] unmounted ${isDesktop ? "desktop" : "mobile"}`);
    };
  }, []);

  return <Scene />;
};

export default CharacterModel;
