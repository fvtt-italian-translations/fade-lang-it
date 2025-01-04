import { Babele } from "./babele";

export interface GameFade
  extends Game<
    Actor<null>,
    Actors<Actor<null>>,
    ChatMessage,
    Combat,
    Item<null>,
    Macro,
    Scene,
    User
  > {
  babele: Babele;
}

export type ConfiguredConfig = Config<
  AmbientLightDocument<Scene | null>,
  ActiveEffect<Actor | Item | null>,
  Actor,
  ActorDelta<TokenDocument>,
  ChatLog,
  ChatMessage,
  Combat,
  Combatant<Combat | null, TokenDocument>,
  CombatTracker<Combat | null>,
  CompendiumDirectory,
  Hotbar,
  Item,
  Macro,
  MeasuredTemplateDocument,
  RegionDocument,
  RegionBehavior,
  TileDocument<Scene>,
  TokenDocument,
  WallDocument<Scene | null>,
  Scene,
  User,
  EffectsCanvasGroup
>;
