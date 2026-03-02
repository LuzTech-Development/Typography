import { MeshGradient as Gradient } from "@paper-design/shaders-react";
import { CSSProperties, FC } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Sequence,
  Img,
  staticFile,
} from "remotion";

const SPEED = 10;
const ALTERNATE = false;

interface AnimatedGradientProps {
  reversed?: boolean;
}

const AnimatedGradient: FC<AnimatedGradientProps> = ({ reversed = false }) => {
  const currentFrame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const frame = interpolate(
    currentFrame,
    [0, durationInFrames],
    reversed ? [SPEED * durationInFrames, 0] : [0, SPEED * durationInFrames],
    {
      easing: Easing.inOut(Easing.ease),
    },
  );

  return (
    <Gradient
      width={width}
      height={height}
      colors={["#00ff9d", "#69dd96", "#4665c3", "#1f6fef"]}
      distortion={0.65}
      swirl={0.3}
      grainMixer={0}
      grainOverlay={0}
      frame={frame}
      speed={0}
      scale={0.7}
    />
  );
};

const Logo: FC = () => {
  const { width, height } = useVideoConfig();

  const size = Math.min(width, height) * 0.8;

  const commonStyles: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  function props(styles: CSSProperties = {}) {
    return {
      src: staticFile("name.svg"),
      width: size * 0.8,
      style: {
        ...commonStyles,
        ...styles,
      },
    };
  }

  return (
    <>
      <Img
        {...props({
          opacity: 0.6,
          filter: "blur(50px)",
        })}
      />
      <Img {...props()} />
    </>
  );
};

export const MeshGradient: FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <>
      {ALTERNATE ? (
        <>
          <Sequence durationInFrames={durationInFrames / 2}>
            <AnimatedGradient />
          </Sequence>
          <Sequence
            from={durationInFrames / 2}
            durationInFrames={durationInFrames / 2}
          >
            <AnimatedGradient reversed />
          </Sequence>
        </>
      ) : (
        <AnimatedGradient />
      )}
      <Logo />
    </>
  );
};
