import { packs } from "./packs";
import { build as esbuildBuild } from "esbuild";
import { join as pathJoin, resolve as pathResolve } from "path";
import {
  mkdir as fsMkdir,
  readFile as fsReadFile,
  rm as fsRm,
  writeFile as fsWriteFile,
} from "fs/promises";

const cwd = pathResolve(process.cwd());
const outdir = pathJoin(cwd, "dist");

await fsRm(outdir, { recursive: true }).catch(() => {});
await fsMkdir(outdir, { recursive: true });

await esbuildBuild({
  entryPoints: {
    module: "src/index.ts",
  },
  format: "esm",
  absWorkingDir: cwd,
  outdir,
  bundle: true,
});

// module.json

const moduleJson = pathJoin(cwd, "src", "module.json");
const distModuleJson = pathJoin(outdir, "module.json");

const repoName =
  process.env.GITHUB_REPOSITORY ?? "fvtt-italian-translations/fade-lang-it";

await copyJsonFile(moduleJson, distModuleJson, (json) => {
  let downloadPath = "latest/download";
  if (process.env.GITHUB_RUN_NUMBER) {
    const prefix = (json.version as string).match(/^\d+\.\d+/);
    if (prefix) {
      downloadPath = `download/${prefix[0]}.${process.env.GITHUB_RUN_NUMBER}`;
    }
  }
  return {
    ...json,
    url: `https://github.com/${repoName}`,
    manifest: `https://github.com/${repoName}/releases/latest/download/module.json`,
    download: `https://github.com/${repoName}/releases/${downloadPath}/module.zip`,
  };
});

// translation files

const languageCode = "it";
const compendiumId = "fade-compendiums";

const tradPath = pathJoin(cwd, "sources", "lang", languageCode);

const distLang = pathJoin(outdir, "lang");
await fsMkdir(distLang);

const tradLangPath = pathJoin(tradPath, `${languageCode}.json`);
const distLangPath = pathJoin(distLang, `${languageCode}.json`);
await copyJsonFile(tradLangPath, distLangPath);

const tradCompendiumPath = pathJoin(tradPath, "compendium");
const distLangCompendiums = pathJoin(distLang, "compendiums");
await fsMkdir(distLangCompendiums);
for (const [id, mapping] of Object.entries(packs)) {
  const source = pathJoin(tradCompendiumPath, `${id}.json`);
  const dist = pathJoin(distLangCompendiums, `${compendiumId}.${id}.json`);

  await copyJsonFile<BabeleCompendium>(source, dist, (contents) => {
    if (!contents?.label) {
      return;
    }
    return {
      ...contents,
      mapping,
    };
  }).catch(() => {});
}

process.exit();

type BabeleCompendium = {
  label: string;
  entries: Record<string, AnyJson>;
};

type AnyJson = Record<string, unknown>;
type MaybePromise<T> = Promise<T> | T;

async function copyJsonFile<T1 = AnyJson>(
  source: string,
  output: string,
  transformer: (x: T1) => MaybePromise<AnyJson | null | undefined> = (x) =>
    x as AnyJson
) {
  const transformed = await transformer(await readFileJson(source));
  if (!transformed) return;
  await writeFileJson(output, transformed);
}

async function readFileJson<T = AnyJson>(file: string): Promise<T> {
  const contents = await fsReadFile(file, "utf-8");
  return JSON.parse(contents);
}

async function writeFileJson<T = AnyJson>(
  file: string,
  data: T
): Promise<void> {
  await fsWriteFile(file, JSON.stringify(data, null, 2));
}
