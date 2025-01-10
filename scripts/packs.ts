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
};

const itemMappings: CompendiumMappingDefinition = {
  name: "name",
  description: "system.description",
  gmNotes: "system.gm.notes",
  spellRange: {
    path: "system.range",
    converter: `${ID}-spellRange`,
  },
  spellDuration: {
    path: "system.duration",
    converter: `${ID}-spellDuration`,
  },
  spellEffect: "system.effect",
};

export const packs: Record<string, CompendiumMappingDefinition> = {
  "actor-compendium": actorMappings,
  "item-compendium": itemMappings,
};
