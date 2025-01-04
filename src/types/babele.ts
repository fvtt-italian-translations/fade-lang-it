export type ModuleDefinition = {
  module: string;
  lang: string;
  dir: string;
};

export type CompendiumMappingDefinition = Record<
  string,
  FieldMappingDefinition
>;

export type FieldMappingDefinition =
  | string
  | {
      path: string;
      converter: string;
    };

export type BabeleConverter<T = any> = (
  originalValue: T,
  translation: any,
  data: any,
  tc: TranslatedCompendium,
  translations: Record<string, unknown>
) => T;

export declare class Babele {
  static instance?: Babele;

  static get(): Babele;

  modules: ModuleDefinition[];
  converters: Record<string, BabeleConverter>;
  packs: Collection<TranslatedCompendium>;

  register(module: ModuleDefinition): void;

  registerConverters(converters: Record<string, BabeleConverter>): void;
}

export declare class TranslatedCompendium {
  mapping: CompendiumMapping;

  translationsFor(data: any): any;
}

export declare class CompendiumMapping {
  constructor(
    entityType: string,
    mapping?: CompendiumMappingDefinition,
    tc?: TranslatedCompendium
  );

  map(data: any, translations: any): any;
}

export declare class FieldMapping {
  field: string;
  tc?: TranslatedCompendium;
  path: string;
  converter: BabeleConverter | null;
  dynamic: boolean;

  constructor(
    field: string,
    mapping: FieldMappingDefinition,
    tc?: TranslatedCompendium
  );
}
