import { type Application, type Renderer, Sprite } from "pixi.js";

export function fitSpritesToScreen(
  app: Application<Renderer>,
  sprites: Sprite[]
) {
  sprites.forEach(async (sprite) => {
    sprite.anchor.set(0.5);

    sprite.x = app.screen.width / 2;
    sprite.y = app.screen.height / 2;

    resizeSprites(app, [sprite]);
    sprites.push(sprite);

    app.stage.addChild(sprite);
  });

  window.addEventListener("resize", () => {
    resizeSprites(app, sprites);
  });
}

export function resizeSprites(app: Application<Renderer>, assets: Sprite[]) {
  assets.forEach((asset) => {
    const scaleX = app.screen.width / asset.texture.width;
    const scaleY = app.screen.height / asset.texture.height;
    const scale = Math.min(scaleX, scaleY);
    asset.scale.set(scale);

    asset.zIndex = 2;

    asset.x = app.screen.width / 2;
    asset.y = app.screen.height / 2;
  });
}
