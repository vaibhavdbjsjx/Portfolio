import { useEffect } from "react";
import Scene from "./Scene";

const CharacterModel = () => {
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1025px)").matches;
    console.log(isDesktop ? "DESKTOP CHARACTER MOUNTED" : "MOBILE CHARACTER MOUNTED");
    return () => {
      console.log("[CharacterModel] unmounted");
    };
  }, []);

  return <Scene />;
};

export default CharacterModel;
