import {
  fromPack,
  hackCompendiumMappingClass,
  makeFromPack,
} from "./converter-from-pack";
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
    [`${ID}-fromPack`]: makeFromPack(
      () => game.babele.packs.get("fade-compendiums.item-compendium")?.mapping
    ),
    [`${ID}-alignment`]: (original, ...args) => {
      return original;
    },
    [`${ID}-size`]: (original, ...args) => {
      return original;
    },
    [`${ID}-spellRange`]: (original, ...args) => {
      return original;
    },
    [`${ID}-spellDuration`]: (original, ...args) => {
      return original;
    },
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
