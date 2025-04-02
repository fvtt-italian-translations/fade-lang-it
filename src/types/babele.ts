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
  translations: any[];

  supported(pack: CompendiumMetadata): boolean;
  getCollection(metadata: CompendiumMetadata): string;
  register(module: ModuleDefinition): void;
  registerConverters(converters: Record<string, BabeleConverter>): void;
}

interface TranslationConfig {
  label?: string;
  reference?: string | string[];
  entries?: any[] | Record<string, any>;
  mapping?: Record<string, string | { path: string; converter: string }>;
  folders?: Record<string, string>;
  types?: string[];
}

export declare class TranslatedCompendium {
  metadata: CompendiumMetadata;
  mapping: CompendiumMapping;
  translations: Record<string, any>;
  types: string[] | undefined;

  constructor(
    metadata: Partial<CompendiumMetadata>,
    translations: TranslationConfig
  );
  hasTranslation(data: Record<string, any>): boolean;
  hasReferenceTranslations(data: Record<string, any>): boolean;
  translationsFor(data: Record<string, any>): Record<string, any>;
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
