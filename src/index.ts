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
    [`${ID}-alignment`]: (original, translated) => {
      if (translated) {
        return translated;
      }
      if (typeof original !== "string") {
        return original;
      }
      original = original.trim();
      return translateWithFallback(
        `FADE_TRANSLATIONS.monsterAlignment.${original}`,
        original
      );
    },
    [`${ID}-size`]: (original, translated) => {
      if (translated) {
        return translated;
      }
      if (typeof original !== "string") {
        return original;
      }
      original = original.trim();
      return translateWithFallback(
        `FADE_TRANSLATIONS.monsterSize.${original}`,
        original
      );
    },
    [`${ID}-spellRange`]: (original, translated) => {
      if (translated) {
        return translated;
      }
      if (typeof original !== "string") {
        return original;
      }
      original = original.trim();
      if (translatedSpellRange.includes(original)) {
        return translateWithFallback(
          `FADE_TRANSLATIONS.spellRange.${original}`,
          original
        );
      }
      return original;
    },
    [`${ID}-spellDuration`]: (original, translated) => {
      if (translated) {
        return translated;
      }
      if (typeof original !== "string") {
        return original;
      }
      original = original.trim();
      if (translatedSpellDuration.includes(original)) {
        return translateWithFallback(
          `FADE_TRANSLATIONS.spellDuration.${original}`,
          original
        );
      }
      return original;
    },
  });
});

function translateWithFallback(key: string, fallback: string) {
  if (game.i18n.has(key)) {
    return game.i18n.localize(key);
  }
  return fallback;
}

const translatedSpellRange = ["Touch", "Personal"];

const translatedSpellDuration = ["Instantaneous", "Permanent", "Concentration"];

Hooks.once("ready", () => {});

Hooks.once("i18nInit", () => {
  if (game.i18n.lang === LANG) {
    removeMismatchingTypes(game.i18n._fallback, game.i18n.translations);
  }
});

Hooks.once("babele.ready", () => {
  hackCompendiumMappingClass();
});
