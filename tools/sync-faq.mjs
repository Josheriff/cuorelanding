#!/usr/bin/env node
/**
 * Rebuild the FAQPage mainEntity in the index.html JSON-LD <script> block from the
 * visible FAQ section, so the structured data can never drift from what a visitor reads.
 *
 *   node tools/sync-faq.mjs         # rewrite index.html in place
 *   node tools/sync-faq.mjs --check # exit 1 if the JSON-LD is not already in sync
 *
 * The FAQ is authored once, in <details class="faq-item"> blocks inside #faq.
 * linkedom decodes HTML entities, so "&rsquo;" arrives here as a real apostrophe and
 * the JSON-LD gets the same character the browser renders.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseHTML } from "linkedom";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "index.html");
const html = readFileSync(target, "utf8");
const checkOnly = process.argv.includes("--check");

const { document } = parseHTML(html);

/* 1. Visible FAQ, in document order. */
const visible = [...document.querySelectorAll("#faq details.faq-item")].map((item) => ({
  question: (item.querySelector("summary")?.textContent || "").trim(),
  answer: [...item.querySelectorAll("p")].map((p) => p.textContent.trim()).join(" ").trim(),
}));

if (visible.length === 0) {
  console.error("sync-faq: no #faq details.faq-item found — refusing to touch the file.");
  process.exit(1);
}

/* 2. The JSON-LD block that carries the @graph. */
const scriptTag = [...document.querySelectorAll('script[type="application/ld+json"]')].find((s) =>
  s.textContent.includes("@graph"),
);
if (!scriptTag) {
  console.error("sync-faq: no JSON-LD <script> with an @graph found.");
  process.exit(1);
}

const data = JSON.parse(scriptTag.textContent);
const faqNode = (data["@graph"] || []).find((node) => node["@type"] === "FAQPage");
if (!faqNode) {
  console.error("sync-faq: @graph has no FAQPage node.");
  process.exit(1);
}

faqNode.mainEntity = visible.map((item) => ({
  "@type": "Question",
  name: item.question,
  acceptedAnswer: { "@type": "Answer", text: item.answer },
}));

/* 3. Splice the re-serialized JSON back into the exact script block. */
const serialized = JSON.stringify(data, null, 2);
const open = html.indexOf(scriptTag.outerHTML);
if (open === -1) {
  console.error("sync-faq: could not locate the JSON-LD script block in the raw file.");
  process.exit(1);
}
const start = open + scriptTag.outerHTML.indexOf(">") + 1;
const end = open + scriptTag.outerHTML.lastIndexOf("<");
const rebuilt = `${html.slice(0, start)}\n  ${serialized.replace(/\n/g, "\n  ")}\n  ${html.slice(end)}`;

const currentFaq = JSON.parse(scriptTag.textContent)["@graph"].find((n) => n["@type"] === "FAQPage");
const inSync = JSON.stringify(currentFaq.mainEntity) === JSON.stringify(faqNode.mainEntity);

if (checkOnly) {
  if (inSync) {
    console.log(`sync-faq: JSON-LD FAQ matches the visible FAQ (${visible.length} items).`);
    process.exit(0);
  }
  console.error(`sync-faq: JSON-LD FAQ is out of sync with the visible FAQ (${visible.length} visible).`);
  process.exit(1);
}

writeFileSync(target, rebuilt, "utf8");
console.log(`sync-faq: wrote ${visible.length} FAQ items into the JSON-LD graph.`);
