import { CharacterDataModel, MonsterDataModel } from "./types/actors";
import type { ConfiguredConfig, GameFade } from "./types/global";

declare global {
  interface ConfigFade extends ConfiguredConfig {
    FADE: {
      ActorSizes: { id: string; isCombat: boolean; maxFeet: number }[];
    };
    Actor: ConfiguredConfig["Actor"] & {
      dataModels: {
        character: typeof CharacterDataModel;
        monster: typeof MonsterDataModel;
      };
    };
  }

  const CONFIG: ConfigFade;
  const canvas: Canvas;
  var game: GameFade;
}
