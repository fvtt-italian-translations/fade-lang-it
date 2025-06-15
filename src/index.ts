import { $B, performBabeleHack } from "./babele-hack";
import { makeFromPack } from "./converter-from-pack";
import { removeMismatchingTypes } from "./utils";

export const LANG = "it";
export const ID = "fade-lang-it";

function onBabeleReady() {
  performBabeleHack();

  class TranslatedCompendiumCustom extends $B.TranslatedCompendium {
    hasTranslation(data: Record<string, any>): boolean {
      if (this.types && !this.types.includes(data.type)) {
        return false;
      }
      return (
        !!this.translations[`${data.name}@${data._id}`] ||
        !!this.translations[data._id] ||
        !!this.translations[data.name] ||
        this.hasReferenceTranslations(data)
      );
    }
    translationsFor(data: Record<string, any>): Record<string, any> {
      return (
        this.translations[`${data.name}@${data._id}`] ||
        this.translations[data._id] ||
        this.translations[data.name] ||
        {}
      );
    }
  }
  const addTranslations = (metadata: CompendiumMetadata) => {
    const collection = game.babele.getCollection(metadata);
    if (!game.babele.supported(metadata)) return;
    const translation = game.babele.translations.find(
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
}

Hooks.once("init", () => {
  if (!game.babele) {
    return;
  }

  if (game.i18n.lang === LANG) {
    for (const actorSize of CONFIG.FADE.ActorSizes) {
      actorSize.maxFeet = convertFeet(actorSize.maxFeet);
    }
  }

  if (foundry.utils.isNewerVersion(game.version, "13.0")) {
    Hooks.once("babele.dataLoaded", onBabeleReady);
  } else {
    Hooks.once("babele.ready", onBabeleReady);
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
    [`${ID}-actorFeetConverter`]: (system) => {
      return {
        movement: {
          day: convertFeet(system.movement.day),
          max: convertFeet(system.movement.max),
          round: convertFeet(system.movement.round),
          run: convertFeet(system.movement.run),
          turn: convertFeet(system.movement.turn),
        },
        movement2: {
          day: convertFeet(system.movement2.day),
          max: convertFeet(system.movement2.max),
          round: convertFeet(system.movement2.round),
          run: convertFeet(system.movement2.run),
          turn: convertFeet(system.movement2.turn),
        },
      };
    },
    [`${ID}-lightRadiusConverter`]: (system, _, data) => {
      if (data.type !== "light") {
        return;
      }
      return { light: { radius: convertFeet(system.light.radius) } };
    },
    [`${ID}-weaponRangeConverter`]: (system, _, data) => {
      if (data.type !== "weapon") {
        return;
      }
      return {
        range: {
          long: convertFeet(system.range.long),
          medium: convertFeet(system.range.medium),
          short: convertFeet(system.range.short),
        },
      };
    },
    [`${ID}-weaponMasteryLevels`]: (original, translated, data) => {
      if (data.type !== "weaponMastery") {
        return;
      }
      const newValue = (() => {
        if (!Array.isArray(original) || !translated) {
          return foundry.utils.deepClone(original);
        }
        return original.map((data, index) => {
          const translation = translated[`${index}`];
          if (!translation) {
            return foundry.utils.deepClone(data);
          }
          return foundry.utils.mergeObject(data, translation);
        });
      })();
      if (newValue?.range?.long) {
        newValue.range.long = convertFeet(newValue.range.long);
      }
      if (newValue?.range?.long) {
        newValue.range.long = convertFeet(newValue.range.long);
      }
      if (newValue?.range?.long) {
        newValue.range.long = convertFeet(newValue.range.long);
      }
      return newValue;
    },
  });
});

function convertFeet<T extends number | null | undefined>(feet: T): T {
  return (feet && (feet / 5) * 1.5) as T;
}

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
