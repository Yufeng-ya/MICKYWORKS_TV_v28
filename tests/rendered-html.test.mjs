import assert from "node:assert/strict";
import test from "node:test";

test("renders the annotated brand, reference headline and ordered social links", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.doesNotMatch(html, /name="codex-preview"/);
  assert.match(html, /MICKYWORKS TV/);
  const wordmark = html.match(/<button class="wordmark"[\s\S]*?<\/button>/)?.[0];
  assert.ok(wordmark, "Navigation keeps its brand button");
  assert.match(wordmark, /mickyworks-logo\.png/);
  assert.match(wordmark, /<span>MICKYWORKS TV<\/span>/);
  assert.doesNotMatch(wordmark, /<b>M<\/b>/);
  assert.match(html, /class="heroBrand"[\s\S]*?mickyworks-logo\.png[\s\S]*?class="heroEyebrow"/);
  assert.equal((html.match(/href="\/mickyworks-logo\.png"/g) ?? []).length, 2);
  assert.match(html, /LIVE COMMERCE/);
  assert.match(html, /Live commerce/);
  assert.doesNotMatch(html, /MULTI-MEDIA|Cross-media creation/);
  assert.match(html, /Cinematic storytelling that brings your vision to life\./);
  assert.match(html, /Zhenbao: The Road Home/);
  assert.match(html, /TSthAJTcShI/);
  assert.match(html, /wechat-qr\.jpg/);
  assert.match(html, /MS4wLjABAAAAvdWfwhinLn6J_cDH2xFXO3i50wMGPwLsAUWcYa8iDfk/);
  const socialRow = html.match(/<div class="aboutContact">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(socialRow, "About section has a social link row");
  assert.ok(socialRow.indexOf("youtube.com/@mickeyworkstv9049") < socialRow.indexOf("douyin.com/user/"));
  assert.ok(socialRow.indexOf("douyin.com/user/") < socialRow.indexOf("space.bilibili.com/16151010"));
  assert.match(html, /class="languageSwitch"/);
  assert.match(html, /data-language="en"/);
  assert.match(html, /hero-feature-full\.mp4/);
  assert.match(html, /hero-feature-mobile\.mp4/);
});
