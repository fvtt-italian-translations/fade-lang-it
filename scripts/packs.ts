import { CompendiumMappingDefinition } from "../src/types/babele";

const ID = "fade-lang-it";

const actorMappings: CompendiumMappingDefinition = {
  name: "name",
  biography: "system.biography",
  items: {
    path: "items",
    converter: `${ID}-fromPack`,
  },
  gmNotes: "system.gm.notes",
  monsterType: "system.details.monsterType",
  alignment: {
    path: "system.details.alignment",
    converter: `${ID}-alignment`,
  },
  size: {
    path: "system.details.size",
    converter: `${ID}-size`,
  },
  actorFeetConverter: {
    path: "system",
    converter: `${ID}-actorFeetConverter`,
  },
};

const itemMappings: CompendiumMappingDefinition = {
  name: "name",
  description: "system.description",
  gmNotes: "system.gm.notes",
  shortName: "system.shortName",
  unidentifiedName: "system.unidentifiedName",
  unidentifiedDesc: "system.unidentifiedDesc",
  spellRange: {
    path: "system.range",
    converter: `${ID}-spellRange`,
  },
  spellDuration: {
    path: "system.duration",
    converter: `${ID}-spellDuration`,
  },
  spellEffect: "system.effect",
  alignment: {
    path: "system.alignment",
    converter: `${ID}-alignment`,
  },
  classSpecies: {
    path: "system.species",
    converter: `${ID}-classSpecies`,
  },
  classLevels: {
    path: "system.levels",
    converter: `${ID}-arrayConverter`,
  },
  specialAbilities: {
    path: "system.specialAbilities",
    converter: `${ID}-arrayConverter`,
  },
  classItems: {
    path: "system.classItems",
    converter: `${ID}-arrayConverter`,
  },
  weaponMastery: "system.mastery",
  lightRadiusConverter: {
    path: "system",
    converter: `${ID}-lightRadiusConverter`,
  },
  weaponRangeConverter: {
    path: "system",
    converter: `${ID}-weaponRangeConverter`,
  },
  weaponMasteryLevels: {
    path: "system.levels",
    converter: `${ID}-weaponMasteryLevels`,
  },
};

export const packs: Record<string, CompendiumMappingDefinition> = {
  "actor-compendium": actorMappings,
  "item-compendium": itemMappings,
};
