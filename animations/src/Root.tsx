import "./index.css";
import { Composition } from "remotion";
import { MeshGradient } from "./MeshGradient";

const FPS = 60;
const DURATION_SECONDS = 60;
const ALTERNATE = true;
const SPEED = 10;
const SHOW_LOGO = false;
const WIDTH = 1920;
const HEIGHT = 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MeshGradient.bind(null, { alternate: ALTERNATE, showLogo: SHOW_LOGO, speed: SPEED })}
        durationInFrames={DURATION_SECONDS * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
