import type { ConfiguredConfig, GameFade } from "./types/global";

declare global {
  interface ConfigFade extends ConfiguredConfig {
    FADE: {
      ActorSizes: { id: string; isCombat: boolean; maxFeet: number }[];
    };
  }

  const CONFIG: ConfigFade;
  const canvas: Canvas;
  var game: GameFade;
}
