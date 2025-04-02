import { $B, performBabeleHack } from "./babele-hack";
import { makeFromPack } from "./converter-from-pack";
import { removeMismatchingTypes } from "./utils";

export const LANG = "it";
export const ID = "fade-lang-it";

Hooks.once("babele.ready", () => {
  performBabeleHack();

  class TranslatedCompendiumCustom extends $B.TranslatedCompendium {
    hasTranslation(data: Record<string, any>): boolean {
      if (this.types && !this.types.includes(data.type)) {
        return false;
      }
      return (
        !!this.translations[data._id] ||
        !!this.translations[data.name] ||
        !!this.translations[`${data.name}@${data._id}`] ||
        this.hasReferenceTranslations(data)
      );
    }
    translationsFor(data: Record<string, any>): Record<string, any> {
      return (
        this.translations[data._id] ||
        this.translations[data.name] ||
        this.translations[`${data.name}@${data._id}`] ||
        {}
      );
    }
  }
  const addTranslations = (metadata: CompendiumMetadata) => {
    const collection = game.babele.getCollection(metadata);
    if (!collection.startsWith(`${ID}.`)) return;
    if (!game.babele.supported(metadata)) return;
    let translation = game.babele.translations.find(
      (t) => t.collection === collection
    );
    if (!translation) return;
    game.babele.packs.set(
      collection,
      new TranslatedCompendiumCustom(metadata, translation)
    );
    // ignore adventures
  };
  for (const metadata of game.data.packs) {
    addTranslations(metadata);
  }
});

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
    [`${ID}-arrayConverter`]: (original, translated) => {
      if (!Array.isArray(original) || !translated) {
        return original;
      }
      return original.map((data, index) => {
        const translation = translated[`${index}`];
        if (!translation) {
          return data;
        }
        return foundry.utils.mergeObject(data, translation);
      });
    },
    [`${ID}-classSpecies`]: (original, translated) => {
      if (translated) {
        return translated;
      }
      if (typeof original !== "string") {
        return original;
      }
      original = original.trim();
      return translateWithFallback(
        `FADE_TRANSLATIONS.classSpecies.${original}`,
        original
      );
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
