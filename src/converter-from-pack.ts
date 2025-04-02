import { $B } from "./babele-hack";
import type {
  BabeleConverter,
  CompendiumMapping,
  CompendiumMappingDefinition,
} from "./types/babele";

// translations can be either an array of translations or an object
function getTranslationForItem(data: any, translations: any) {
  if (Array.isArray(translations)) {
    return translations.find((t) => t.id === data._id || t.id === data.name);
  } else {
    return translations[data._id] || translations[data.name];
  }
}

const sourceIdRegex =
  /^Compendium\.(?<namespace>[^\.]+)\.(?<compendium>[^\.]+)\.(?<type>Actor|Item|RollTable|JournalEntry|Macro|Item)\.(?<id>[^\.]+)(?:\.Item\.(?<itemId>[^\.]+))?$/;

// parse a sourceId reference (supports sub-items) and
// return the matching translation and mapping
function findTranslationSource(
  sourceId: string,
  getItemMapping: MappingCache
): null | [any, CompendiumMapping] {
  const m = sourceId.match(sourceIdRegex);
  if (!m) {
    return null;
  }

  const { namespace, compendium, id, itemId } = m.groups as Record<
    string,
    string
  >;
  const pack = game.babele.packs.get(`${namespace}.${compendium}`);
  if (!pack) {
    return null;
  }

  const foundryPack = game.packs.get(`${namespace}.${compendium}`)!;
  if (!foundryPack) {
    return null;
  }

  const referenced = foundryPack.index.get(id);
  if (!referenced) {
    return null;
  }

  const referencedName = (referenced as any).originalName ?? referenced.name;
  const referencedTranslation = pack.translationsFor({
    _id: id,
    name: referencedName,
  });

  if (!itemId) {
    return [referencedTranslation, pack.mapping];
  }

  if (!referencedTranslation?.items) {
    return null;
  }

  // try get the real item... will probably fail.
  // TODO: make it work with foundryPack.getDocument(id)
  const items: any[] = (foundryPack.get(id) as any)?.items;
  if (!items) {
    return null;
  }

  const name = items?.find((item: any) => item._id == itemId);
  return [
    getTranslationForItem({ _id: itemId, name }, referencedTranslation.items),
    getItemMapping(),
  ];
}

type MappingInitializer =
  | CompendiumMapping
  | CompendiumMappingDefinition
  | (() => CompendiumMapping | CompendiumMappingDefinition | undefined);

type MappingCache = () => CompendiumMapping;

function makeMappingCache(
  type: string,
  mapping?: MappingInitializer
): MappingCache {
  let cachedMapping: CompendiumMapping | null = null;
  return () => {
    return (cachedMapping ??= (() => {
      if (!mapping) {
        return new $B.CompendiumMapping(type);
      }
      if (mapping instanceof $B.CompendiumMapping) {
        return mapping;
      }
      if (typeof mapping === "function") {
        const mapping1 = mapping();
        if (!mapping1) {
          return new $B.CompendiumMapping(type);
        }
        if (mapping1 instanceof $B.CompendiumMapping) {
          return mapping1;
        }
        return new $B.CompendiumMapping(type, mapping1);
      }
      return new $B.CompendiumMapping(type, mapping);
    })());
  };
}

export function makeFromPack(
  mapping?: MappingInitializer
): BabeleConverter<any[]> {
  const getItemMapping = makeMappingCache("Item", mapping);

  return (items, translations) => {
    return items.map((data) => {
      let translationData;
      let translationSource;

      if (translations) {
        const translation = getTranslationForItem(data, translations);
        if (translation) {
          const { _source, ...rest } = translation;

          translationData = getItemMapping().map(data, rest);
          translationSource = _source ? `Compendium.${_source}` : null;
        }
      }

      const sourceId = translationSource ?? data._stats?.compendiumSource;
      if (sourceId) {
        const found = findTranslationSource(sourceId, getItemMapping);
        if (found) {
          const [translationData1, mapping] = found;
          translationData = foundry.utils.mergeObject(
            mapping.map(data, translationData1),
            translationData
          );
        }
      }

      if (!translationData) {
        return data;
      }

      return foundry.utils.mergeObject(
        data,
        foundry.utils.mergeObject(
          translationData,
          {
            translated: true,
            flags: {
              babele: {
                translated: true,
                hasTranslation: true,
                originalName: data.name,
              },
            },
          },
          { inplace: false }
        ),
        { inplace: false }
      );
    });
  };
}

export const fromPack: BabeleConverter<any[]> = makeFromPack();
