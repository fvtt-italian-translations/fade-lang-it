import { fromPack, hackCompendiumMappingClass } from "./converter-from-pack";

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
    // ...
  }
});

Hooks.once("babele.ready", () => {
  hackCompendiumMappingClass();
});
