import assert from "node:assert/strict";
import test from "node:test";
import { socialProfiles, translations } from "../app/content.mjs";

function structure(value) {
  if (Array.isArray(value)) return value.map(structure);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, structure(item)]));
  assert.equal(typeof value, "string");
  assert.ok(value.trim().length > 0, "Translated content must not be empty");
  return "string";
}

test("English and Chinese cover the same entire content structure", () => {
  assert.deepEqual(structure(translations.en), structure(translations.zh));
  for (const locale of Object.values(translations)) {
    assert.equal(locale.projects.length, 5);
    assert.equal(locale.strengths.items.length, 4);
    assert.equal(locale.hero.firstLine + " " + locale.hero.secondPrefix + locale.hero.accent + locale.hero.secondSuffix, locale.hero.title.replace("，", "， "));
  }
});

test("profile destinations exactly match the requested order and URLs", () => {
  assert.deepEqual(socialProfiles.map(profile => profile.id), ["youtube", "douyin", "bilibili"]);
  assert.deepEqual(socialProfiles.map(profile => profile.href), [
    "https://www.youtube.com/@mickeyworkstv9049",
    "https://www.douyin.com/user/MS4wLjABAAAAvdWfwhinLn6J_cDH2xFXO3i50wMGPwLsAUWcYa8iDfk",
    "https://space.bilibili.com/16151010?spm_id_from=333.337.0.0",
  ]);
});

test("the fourth capability is live commerce in both languages", () => {
  assert.equal(translations.en.strengths.items[3].title, "Live commerce");
  assert.match(translations.en.strengths.items[3].desc, /livestream planning and product demos/);
  assert.equal(translations.zh.strengths.items[3].title, "直播电商");
  assert.match(translations.zh.strengths.items[3].desc, /直播策划、产品讲解/);
});
