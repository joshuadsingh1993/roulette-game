import { Application, Assets, Container, Sprite } from "pixi.js";
import BowOuter from "../../assets/images/bow_outer.png";
import BowInner from "../../assets/images/bow_inner.png";
import Wheel from "../../assets/images/wheel.png";
import Ball from "../../assets/images/ball.png";
import { fitSpritesToScreen } from "./helpers";
import { useGameStore } from "../../stores/gameStore";
import { watch } from "vue";
import gsap from "gsap";

const DEFAULT_ROTATION_SPEED = 0.01;

const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const wheelPostionData = { speed: DEFAULT_ROTATION_SPEED };
const ballPositionData = {
  angle: Math.PI * 1.5, // Bottom of elipse
  velocity: 0,
  x: 204,
  y: 147,
};

export const initCanvas = async (ref: HTMLElement) => {
  const gameStore = useGameStore();
  const app = new Application();

  await app.init({
    background: 0x218c74,
    resizeTo: ref,
  });

  app.canvas.style.position = "absolute";
  app.canvas.style.top = `0`;
  app.canvas.style.left = `0`;

  ref.appendChild(app.canvas);

  const bowOuterTexture = await Assets.load(BowOuter);
  const bowInnerTexture = await Assets.load(BowInner);

  const bowOuterSprite = new Sprite(bowOuterTexture);
  const bowInnerSprite = new Sprite(bowInnerTexture);

  fitSpritesToScreen(app, [bowOuterSprite, bowInnerSprite]);

  const wheelTexture = await Assets.load(Wheel);
  const ballTexture = await Assets.load(Ball);

  const wheelContainer = new Container();
  wheelContainer.position.set(app.screen.width / 2, app.screen.height / 2);

  const isoSkew = (-45 * Math.PI) / 180;
  wheelContainer.scale.y = Math.cos(isoSkew) / 2.6;
  wheelContainer.scale.x = wheelContainer.scale.x / 2.65;
  wheelContainer.x = app.screen.width * 0.513;
  wheelContainer.y = app.screen.height * 0.435;

  const wheelSprite = new Sprite(wheelTexture);

  const ballPivotCenterY = app.screen.height * 0.4;
  const ballPivotCenterX = app.screen.width * 0.5;
  const ballSprite = new Sprite(ballTexture);

  ballSprite.zIndex = 5;
  ballSprite.alpha = 0;
  ballSprite.scale.set(0.5);

  app.stage.addChild(ballSprite);

  wheelSprite.anchor.set(0.5);
  wheelSprite.alpha = 1;
  wheelSprite.zIndex = 1;

  //   wheelContainer.addChild(ballSprite);
  wheelContainer.addChild(wheelSprite);

  app.stage.addChild(wheelContainer);

  watch(
    () => gameStore.gameStatus,
    (newStatus) => {
      if (newStatus === "spinning") {
        gsap.to(wheelPostionData, {
          speed: DEFAULT_ROTATION_SPEED * 10,
          duration: 2,
          ease: "power3.out",
          onComplete: () => {
            ballSprite.alpha = 1;

            gsap.to(ballPositionData, {
              velocity: 0.1,
              duration: 2,
              ease: "power2.out",
              onComplete: () => {
                gsap.to(wheelPostionData, {
                  speed: 0,
                  duration: 2,
                  ease: "power3.in",
                  onComplete: () => {
                    const wheelLocation =
                      Math.PI - (wheelSprite.rotation % (Math.PI * 2));
                    const baselineBallTopPos =
                      Math.PI * 2.5 +
                      Math.ceil(ballPositionData.angle / Math.PI) * Math.PI;

                    gsap.to(ballPositionData, {
                      velocity: 0,
                      angle:
                        baselineBallTopPos +
                        wheelLocation -
                        getNumberAngle(gameStore.currentNumber!) +
                        0.005,
                      x: ballPositionData.x * 0.7,
                      y: ballPositionData.y * 0.7,
                      duration: 6,
                      ease: "power2.out",
                      onComplete: () => {
                        gameStore.updateHistory(gameStore.currentNumber!);
                        setTimeout(() => gameStore.setGameStatus("idle"), 1000);
                      },
                    });
                  },
                });
              },
            });
          },
        });

        return;
      }

      if (newStatus === "idle") {
        ballSprite.alpha = 0;

        ballPositionData.angle = Math.PI * 1.5;
        ballPositionData.x = 204;
        ballPositionData.y = 147;

        gsap.to(wheelPostionData, {
          speed: DEFAULT_ROTATION_SPEED,
          duration: 1,
          ease: "power3.in",
        });

        return;
      }
    }
  );

  app.ticker.add(() => {
    wheelSprite.rotation += wheelPostionData.speed;

    ballPositionData.angle += ballPositionData.velocity;
    ballSprite.x =
      ballPivotCenterX + ballPositionData.x * Math.cos(-ballPositionData.angle);
    ballSprite.y =
      ballPivotCenterY + ballPositionData.y * Math.sin(-ballPositionData.angle);
  });
};

const getNumberAngle = (number: number) => {
  const index = ROULETTE_NUMBERS.indexOf(number);
  const degrees = (index * (360 / 37)) % 360;
  return (degrees * Math.PI) / 180;
};
