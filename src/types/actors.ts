import fields = foundry.data.fields;

class FDActorBase extends Actor {}

class FDActor extends FDActorBase {}

class CharacterActor extends FDActor {}

class MonsterActor extends FDActor {}

type FDActorBaseDS = {
  movement: fields.SchemaField<{
    turn: fields.NumberField;
    max: fields.NumberField;
    round: fields.NumberField;
    day: fields.NumberField;
    run: fields.NumberField;
  }>;
  movement2: fields.SchemaField<{
    turn: fields.NumberField;
    max: fields.NumberField;
    round: fields.NumberField;
    day: fields.NumberField;
    run: fields.NumberField;
  }>;
};

type FDActorDS = FDActorBaseDS & {};

type CharacterDataSchema = FDActorDS & {};

type MonsterDataSchema = FDActorDS & {};

class FDActorBaseDM<
  TParent extends FDActorBase,
  TSchema extends FDActorBaseDS
> extends foundry.abstract.TypeDataModel<TParent, TSchema> {}

class FDActorDM<
  TParent extends FDActor,
  TSchema extends FDActorDS
> extends FDActorBaseDM<TParent, TSchema> {}

class CharacterDataModel extends FDActorDM<
  CharacterActor,
  CharacterDataSchema
> {}

class MonsterDataModel extends FDActorDM<MonsterActor, MonsterDataSchema> {}

export { CharacterDataModel, MonsterDataModel, FDActorBaseDM, FDActorDM };
