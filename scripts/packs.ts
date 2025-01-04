import { CompendiumMappingDefinition } from "../src/types/babele";

const ID = "fade-lang-it";

const actorMappings: CompendiumMappingDefinition = {
  name: "name",
  biography: "system.biography",
  items: {
    path: "items",
    converter: `${ID}-fromPack`,
  },
};

const itemMappings: CompendiumMappingDefinition = {
  name: "name",
  description: "system.description",
  gmNotes: "system.gm.notes",
};

export const packs: Record<string, CompendiumMappingDefinition> = {
  "actor-compendium": actorMappings,
  "item-compendium": itemMappings,
};
