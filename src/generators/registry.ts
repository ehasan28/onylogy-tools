import type { TextGenerator } from "./types";
import { meaningfulEnglishGenerator } from "./meaningful-english";
import { randomEnglishWordsGenerator } from "./random-english-words";
import { loremIpsumGenerator } from "./lorem-ipsum";
import { hipsterIpsumGenerator } from "./hipster-ipsum";
import { corporateBuzzwordsGenerator } from "./corporate-buzzwords";
import { htmlMarkupGenerator } from "./html-markup";
import { markdownGenerator } from "./markdown";
import { jsonMockGenerator } from "./json-mock";
import { uuidsGenerator } from "./uuids";
import { emailsGenerator } from "./emails";
import { slugsGenerator } from "./slugs";
import { urlsGenerator } from "./urls";
import { namesGenerator } from "./names";
import { randomCharsGenerator } from "./random-chars";
import { hexColorsGenerator } from "./hex-colors";
import { cssClassesGenerator } from "./css-classes";

const generators = new Map<string, TextGenerator>();

export function registerGenerator(g: TextGenerator): void {
  generators.set(g.id, g);
}

export function listGenerators(): TextGenerator[] {
  return Array.from(generators.values());
}

export function getGenerator(id: string): TextGenerator | undefined {
  return generators.get(id);
}

[
  meaningfulEnglishGenerator,
  randomEnglishWordsGenerator,
  loremIpsumGenerator,
  hipsterIpsumGenerator,
  corporateBuzzwordsGenerator,
  htmlMarkupGenerator,
  markdownGenerator,
  jsonMockGenerator,
  uuidsGenerator,
  emailsGenerator,
  slugsGenerator,
  urlsGenerator,
  namesGenerator,
  randomCharsGenerator,
  hexColorsGenerator,
  cssClassesGenerator,
].forEach(registerGenerator);

export const DEFAULT_GENERATOR_ID = meaningfulEnglishGenerator.id;
