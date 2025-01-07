import { fromPack, hackCompendiumMappingClass } from "./converter-from-pack";
import { removeMismatchingTypes } from "./utils";

export const LANG = "it";
export const ID = "fade-lang-it";

Hooks.once("init", () => {
  if (!game.babele) {
    return;
  }

  game.babele.register({
    module: ID,
    lang: LANG,
    dir: "lang/compendiums",
  });

  game.babele.registerConverters({
    [`${ID}-fromPack`]: fromPack,
  });
});

Hooks.once("ready", () => {});

Hooks.once("i18nInit", () => {
  if (game.i18n.lang === LANG) {
    removeMismatchingTypes(game.i18n._fallback, game.i18n.translations);
  }
});

Hooks.once("babele.ready", () => {
  hackCompendiumMappingClass();
});
