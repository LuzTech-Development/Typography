import "./index.css";
import { Composition } from "remotion";
import { MeshGradient } from "./MeshGradient";

const FPS = 60;
const DURATION_SECONDS = 3;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MeshGradient}
        durationInFrames={DURATION_SECONDS * FPS}
        fps={FPS}
        width={1170}
        height={2532}
      />
    </>
  );
};
