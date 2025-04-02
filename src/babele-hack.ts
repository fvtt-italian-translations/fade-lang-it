import {
  TranslatedCompendium as TranslatedCompendiumClass,
  type CompendiumMapping as CompendiumMappingClass,
} from "./types/babele";

let CompendiumMapping: typeof CompendiumMappingClass = null!;
let TranslatedCompendium: typeof TranslatedCompendiumClass = null!;

export function performBabeleHack() {
  const tc = game.babele.packs.contents[0];
  TranslatedCompendium = tc.constructor as any;
  CompendiumMapping = tc.mapping.constructor as any;
}

export namespace $B {
  export interface CompendiumMapping extends CompendiumMappingClass {}
  export interface TranslatedCompendium extends TranslatedCompendiumClass {}
}

export const $B = {
  get CompendiumMapping() {
    return CompendiumMapping;
  },
  get TranslatedCompendium() {
    return TranslatedCompendium;
  },
};
