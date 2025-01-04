import type { ConfiguredConfig, GameFade } from "./types/global";

declare global {
  interface ConfigFade extends ConfiguredConfig {}

  const CONFIG: ConfigFade;
  const canvas: Canvas;
  var game: GameFade;
}
