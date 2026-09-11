#!/usr/bin/env node
/**
 * Landing-page verification for the Cuore Tech ERP migration.
 * Static, no network, no browser binary (this sandbox cannot spawn one).
 *
 * Usage:  node tools/verify.mjs
 * Exit 0 = every check passed. Exit 1 = at least one failure (printed per line).
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(ROOT, rel), "utf8");
const has = (rel) => existsSync(path.join(ROOT, rel));

const results = [];
const add = (ok, name, detail) => results.push({ ok, name, detail });
function check(name, fn) {
  try {
    const r = fn();
    if (r === true || r === undefined || r === null) add(true, name);
    else add(false, name, Array.isArray(r) ? r.join(" | ") : String(r));
  } catch (e) {
    add(false, name, `threw: ${e && e.message}`);
  }
}

const { parseHTML } = await import("linkedom");

const htmlSrc = read("index.html");
const jsSrc = has("js/main.js") ? read("js/main.js") : "";
const { document } = parseHTML(htmlSrc);
const bodyText = () => document.body.textContent;

/* ------------------------------------------------------------------ *
 * Shared expectations (spec §2)
 * ------------------------------------------------------------------ */
const TITLE = "Custom ERP Development for B2B Companies | Cuore Tech";
/* Exact-match guard: the approved copy lives in the page, so any silent edit fails here.
   The approved wording is the marketing brief, which supersedes older spec documents. */
const DESC =
  "Cuore Tech designs and builds modular ERP and business operations software for B2B companies: orders, inventory, workflows, approvals, integrations and reporting. Projects typically start at $10,000.";
const OG_DESC =
  "Senior-led custom ERP development. Cuore Tech discovers, designs, builds, integrates and supports modular business systems around your processes. Not a packaged ERP or SaaS subscription. Projects typically start at $10,000.";
const CANONICAL = "https://cuoretechllc.com/";
const FORM_ENDPOINT =
  "https://docs.google.com/forms/d/e/1FAIpQLSe98q9LdffZJThYr-Le6N9Yy1fGnYGBNlsxHgqKSUmL7QFijA/formResponse";
const ENTRY_IDS = [
  "entry.1467467639",
  "entry.1006754821",
  "entry.2026813663",
  "entry.293749142",
];
/* Legacy Google Form option text, kept only so the live Form keeps receiving values it
   already understands. They are invisible (rendered labels come from RADIO_LABELS) and are the
   only CRM-era strings allowed in the source until the Form itself is migrated —
   see GOOGLE-ADS-LAUNCH.md "Google Form migration". Byte-identical on purpose. */
const RADIO_VALUES = [
  "Replace our existing CRM",
  "Build a CRM from scratch",
  "Automate manual processes",
  "Integrate existing tools",
  "Reduce license fees and complexity",
  "Not sure yet",
];
/* Visible option text from spec §2.13 — the `value` attributes above stay on the
   live Google Form, so only the labels migrate. */
const RADIO_LABELS = [
  "Replace an ERP, legacy system or set of spreadsheets",
  "Build a custom business system from scratch",
  "Automate manual processes and approvals",
  "Integrate the tools we already use",
  "Reduce license fees and system complexity",
  "Not sure yet",
];
const SUCCESS_TEXT =
  "Thank you. Your request has been submitted. We review every inquiry personally and reply within 1 business day.";
/* Built in js/main.js by concatenating the contact address, so the literal is a prefix. */
const FAILURE_TEXT = "We could not send your request. Please try again or email ";
const PRICE = "$10,000";
const SUBMIT_LABEL = "Request My Free Fit Review";
const CTA_LABEL = "Request a Free Fit Review";
/* Third, shorter variant used only by the nav button on the privacy page. */
const PRIVACY_CTA_LABEL = "Request a Free Review";
const DISCLAIMER =
  "Illustrative concept &mdash; fictional sample data. Not a client system or client result.";
const DISCLAIMER_TEXT =
  "Illustrative concept — fictional sample data. Not a client system or client result.";

/* ------------------------------------------------------------------ *
 * DOM helpers
 * ------------------------------------------------------------------ */
const walk = (node, visit) => {
  for (const child of node.childNodes || []) {
    visit(child);
    walk(child, visit);
  }
};
const text = (el) => (el ? el.textContent.replace(/\s+/g, " ").trim() : "");
const meta = (name) =>
  document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ?? null;
const prop = (p) =>
  document.querySelector(`meta[property="${p}"]`)?.getAttribute("content") ?? null;

/* ------------------------------------------------------------------ *
 * 1. HTML well-formedness (html-validate)
 * ------------------------------------------------------------------ */
const { HtmlValidate } = await import("html-validate");
const htmlvalidate = new HtmlValidate({
  extends: ["html-validate:recommended"],
  rules: {
    // The page intentionally ships one deferred script and one JSON-LD block.
    "no-inline-script": "off",
    "script-type": "off",
    // `role="img"` + aria-label is the accessible-mockup pattern used here.
    "hidden-body": "off",
    "void-style": "off",
    "attribute-boolean-style": "off",
    "no-raw-characters": "off",
    "wcag/h32": "off",
    "form-duplication": "off",
    "duplicate-data-attributes": "off",
    "no-redundant-for": "off",
    "accordion-title": "off",
    "nested-interactive": "off",
    "tel-img-link": "off",
    "require-sri": "off",
    "valid-http": "off",
  },
});
const errorsOf = (report) =>
  report.results
    .flatMap((r) => r.messages)
    .filter((m) => m.severity === 2)
    .map((m) => `line ${m.line}: [${m.ruleId}] ${m.message}`);
const htmlReport = await htmlvalidate.validateString(htmlSrc, "index.html");
add(errorsOf(htmlReport).length === 0, "html-validate: 0 errors in index.html", errorsOf(htmlReport));
const privacySrc = has("privacy.html") ? read("privacy.html") : "";
if (privacySrc) {
  const pr = await htmlvalidate.validateString(privacySrc, "privacy.html");
  add(errorsOf(pr).length === 0, "html-validate: 0 errors in privacy.html", errorsOf(pr));
}

/* ------------------------------------------------------------------ *
 * 2. CSS parses (css-tree) and covers every class used in the HTML
 * ------------------------------------------------------------------ */
const csstree = await import("css-tree");
const cssSrc = read("css/style.css");
const cssErrors = [];
csstree.parse(cssSrc, { positions: true, onParseError: (e) => cssErrors.push(`${e.line}:${e.column} ${e.message}`) });
add(cssErrors.length === 0, "css-tree: css/style.css parses with 0 errors", cssErrors);

const cssClasses = new Set();
for (const m of cssSrc.matchAll(/\.(-?[A-Za-z_][\w-]*)/g)) cssClasses.add(m[1]);
const htmlClasses = new Set();
for (const el of document.querySelectorAll("[class]")) {
  for (const c of String(el.getAttribute("class")).split(/\s+/)) if (c) htmlClasses.add(c);
}
/* Classes that only ever exist at runtime (set by js/main.js) or on <html>. */
const RUNTIME_CLASSES = new Set([
  "no-js", "js", "is-open", "is-visible", "is-active", "has-error",
  "sticky-cta-visible", "is-hidden",
]);
/* Pre-existing structural hooks: wrappers that carry no declarations of their
   own (their children are styled). Kept explicit so a *new* class without a
   rule still fails the build. */
const STRUCTURAL_HOOKS = new Set([
  "hero-copy", "hero-visual", "positioning", "social-proof", "footer-nav",
  "accent-edge", "dash-panels", "brand-name",
]);
const undefinedClasses = [...htmlClasses]
  .filter((c) => !cssClasses.has(c) && !RUNTIME_CLASSES.has(c) && !STRUCTURAL_HOOKS.has(c))
  .sort();
add(undefinedClasses.length === 0, "CSS: every class used in index.html is defined", undefinedClasses);

/* ------------------------------------------------------------------ *
 * 3. <head> / SEO (§2.1)
 * ------------------------------------------------------------------ */
check("title is the spec title", () =>
  text(document.querySelector("title")) === TITLE || `found: ${text(document.querySelector("title"))}`,
);
check("meta description is the spec description", () =>
  meta("description") === DESC || `found: ${meta("description")}`,
);
check("og:title is the spec title", () => prop("og:title") === TITLE || `found: ${prop("og:title")}`);
check("twitter:title is the spec title", () => meta("twitter:title") === TITLE || `found: ${meta("twitter:title")}`);
check("og:description is the spec description", () => prop("og:description") === OG_DESC || `found: ${prop("og:description")}`);
check("twitter:description is the spec description", () => meta("twitter:description") === OG_DESC || `found: ${meta("twitter:description")}`);
check("canonical is untouched", () =>
  document.querySelector('link[rel="canonical"]')?.getAttribute("href") === CANONICAL || "changed",
);
check("single H1", () => {
  const n = document.querySelectorAll("h1").length;
  return n === 1 || `found ${n}`;
});

/* ------------------------------------------------------------------ *
 * 4. Structured data (§2.2)
 * ------------------------------------------------------------------ */
const ldBlocks = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent);
add(ldBlocks.length === 1, "exactly one JSON-LD block", `found ${ldBlocks.length}`);
let graph = [];
try {
  const parsed = JSON.parse(ldBlocks[0] || "[]");
  graph = Array.isArray(parsed) ? parsed : parsed["@graph"] || [parsed];
  add(true, "JSON-LD parses");
} catch (e) {
  add(false, "JSON-LD parses", e.message);
}
const byType = (t) => graph.find((n) => n && n["@type"] === t) || null;
const svc = byType("ProfessionalService");
check("JSON-LD ProfessionalService present", () => !!svc || "missing");
check("JSON-LD service description is ERP", () =>
  /custom ERP development service/i.test(svc?.description || "") || `found: ${svc?.description}`,
);
check("JSON-LD priceRange matches the approved qualification", () =>
  svc?.priceRange === `${PRICE}+` || `found: ${svc?.priceRange}`,
);
check("JSON-LD offer catalog has 6 ERP services", () => {
  const items = svc?.hasOfferCatalog?.itemListElement || [];
  if (items.length !== 6) return `found ${items.length}`;
  const names = items.map((i) => i?.itemOffered?.name);
  const expected = [
    "Custom ERP and operations system design",
    "Legacy system and spreadsheet replacement",
    "Workflow and approval automation",
    "System integrations",
    "Reporting and custom dashboards",
    "Support, hosting options and enhancement",
  ];
  const bad = names.filter((n, i) => n !== expected[i]);
  return bad.length === 0 || `found: ${names.join(" | ")}`;
});
check("JSON-LD has no CRM string", () => !/crm/i.test(ldBlocks[0] || "") || "CRM appears in JSON-LD");

const faqLd = byType("FAQPage");
check("JSON-LD FAQPage present", () => !!faqLd || "missing");

/* ------------------------------------------------------------------ *
 * 5. Visible FAQ mirrors FAQPage (§2.12)
 * ------------------------------------------------------------------ */
const faqDetails = [...document.querySelectorAll("#faq details")];
const visibleQ = faqDetails.map((d) => text(d.querySelector("summary")));
const visibleA = faqDetails.map((d) => {
  const clone = d.querySelector("summary") ? d.cloneNode(true) : d;
  clone.querySelector("summary")?.remove();
  const p = clone.querySelector("p");
  return text(p);
});
const ldQ = (faqLd?.mainEntity || []).map((q) => String(q?.name || ""));
const ldA = (faqLd?.mainEntity || []).map((q) => String(q?.acceptedAnswer?.text || ""));
check("FAQ count matches JSON-LD", () =>
  visibleQ.length === ldQ.length && visibleQ.length >= 8 || `visible ${visibleQ.length} vs ld ${ldQ.length}`,
);
check("FAQ questions mirror JSON-LD in order", () => {
  const bad = visibleQ.map((q, i) => (q === ldQ[i] ? null : `[${i}] html="${q}" ld="${ldQ[i]}"`)).filter(Boolean);
  return bad.length === 0 || bad;
});
check("FAQ answers mirror JSON-LD in order", () => {
  const bad = visibleA
    .map((a, i) => (a && a === ldA[i] ? null : `[${i}] html="${a}" ld="${ldA[i]}"`))
    .filter(Boolean);
  return bad.length === 0 || bad;
});
check("visible FAQ mentions no CRM", () => !/crm/i.test(text(document.getElementById("faq"))) || "CRM in visible FAQ");

/* ------------------------------------------------------------------ *
 * 6. Google Form contract (§2.13, hard rules 3–4)
 * ------------------------------------------------------------------ */
check("single contact form", () => {
  const n = document.querySelectorAll("form").length;
  return n === 1 || `found ${n}`;
});
/* The page posts through js/main.js (cross-origin, mode:"no-cors"): HTML fields
   use logical names (goal/bottleneck/email/name) and main.js maps them onto the
   four live entry.* keys. Both halves are asserted here and in §12b. */
check("form action endpoint untouched", () => {
  const a = document.querySelector("form")?.getAttribute("action") || "";
  return a === "" || a.startsWith(FORM_ENDPOINT) || `found: ${a}`;
});
check("no other form endpoint anywhere in the page", () => {
  const found = [...htmlSrc.matchAll(/https:\/\/docs\.google\.com\/forms\/d\/e\/[A-Za-z0-9_-]+/g)]
    .map((m) => m[0]);
  return found.every((u) => FORM_ENDPOINT.startsWith(u) || u === FORM_ENDPOINT) || `found: ${found.join(", ")}`;
});
const fieldNames = [...new Set(
  [...document.querySelectorAll("form input[name], form textarea[name], form select[name]")]
    .map((i) => i.getAttribute("name")),
)];
check("form field names are the documented logical set", () => {
  const allow = ["goal", "bottleneck", "email", "name", "consent"];
  const extra = fieldNames.filter((n) => !allow.includes(n));
  const missing = ["goal", "email", "name"].filter((n) => !fieldNames.includes(n));
  return (extra.length === 0 && missing.length === 0) || `extra=${extra.join(",")} missing=${missing.join(",")} all=${fieldNames.join(",")}`;
});
check("bottleneck/context field stays commented out (preserved block)", () => {
  const comments = [];
  walk(document.documentElement, (n) => {
    if (n.nodeType === 8) comments.push(n.textContent || "");
  });
  return comments.some((c) => /bottleneck/i.test(c)) || "the commented context block is gone";
});
const radios = [...document.querySelectorAll('form input[type="radio"]')];
check("six goal radios with byte-identical live Google Form values", () => {
  const vals = radios.map((r) => r.getAttribute("value"));
  return JSON.stringify(vals) === JSON.stringify(RADIO_VALUES) || `found: ${JSON.stringify(vals)}`;
});
check("goal radios share one name, none is preselected, one is required", () => {
  const names = new Set(radios.map((r) => r.getAttribute("name")));
  if (names.size !== 1) return `radio names: ${[...names].join(", ")}`;
  const pre = radios.filter((r) => r.hasAttribute("checked")).map((r) => r.getAttribute("value"));
  if (pre.length) return `${pre.length} preselected radio(s): ${pre.join(", ")}`;
  if (!radios.some((r) => r.hasAttribute("required")))
    return "no required radio: the form could send a goal nobody chose";
  return true;
});
check("radio label text is ERP wording", () => {
  const labels = radios.map((r) => {
    const id = r.getAttribute("id");
    const l = (id && document.querySelector(`form label[for="${id}"]`)) || r.closest("label");
    return text(l);
  });
  const bad = labels
    .map((l, i) => (l === RADIO_LABELS[i] ? null : `[${i}] "${l}"`))
    .filter(Boolean);
  return bad.length === 0 || bad;
});
check("radio value mapping is documented in an HTML comment", () => {
  const comments = [];
  walk(document.documentElement, (n) => {
    if (n.nodeType === 8) comments.push(n.textContent || "");
  });
  const blob = comments.join("\n");
  return (/Google Form/i.test(blob) && /value/i.test(blob) && /option/i.test(blob)) ||
    "no comment documents the value<->label mapping";
});
check("goal fieldset is a real fieldset/legend", () =>
  !!document.querySelector("form fieldset:has(legend) label input[type=radio]") || "radios not in a labelled fieldset",
);
check("privacy line under the form is American English and promises nothing", () => {
  const p = document.querySelector(".form-privacy");
  if (!p) return "missing .form-privacy";
  const t = text(p);
  if (/enquir|licenc/i.test(t)) return `british spelling: ${t}`;
  if (/(has been|will be) (received|stored|saved)|we (will|have) (receive|store)/i.test(t))
    return `promises receipt or storage: ${t}`;
  return /inquiry/i.test(t) || `no "inquiry": ${t}`;
});
check("submit button has the spec label", () => {
  const b = document.querySelector('form button[type="submit"]');
  return text(b) === SUBMIT_LABEL || `found: ${text(b)}`;
});
check("privacy link sits next to the submit button", () => {
  const submit = document.querySelector('form button[type="submit"]');
  let box = submit?.parentElement;
  for (let i = 0; i < 3 && box; i++, box = box.parentElement) {
    if (box.querySelector('a[href="privacy.html"]')) return true;
  }
  return "no privacy.html link near the submit button";
});
check("form has an aria-live status region", () =>
  !!document.querySelector("form [aria-live], [id^=cf-status][aria-live], #form-status[aria-live]") || "missing",
);

/* ------------------------------------------------------------------ *
 * 7. Illustrative dashboards + hero mockup disclaimers (§2.10, §2.9)
 * ------------------------------------------------------------------ */
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
check("four dashboard panels", () => panels.length === 4 || `found ${panels.length}`);
check("every dashboard panel carries the exact disclaimer", () => {
  const bad = panels
    .filter((p) => !p.textContent.includes(DISCLAIMER_TEXT))
    .map((p) => `#${p.id || "?"} has no disclaimer`);
  return bad.length === 0 || bad;
});
check("disclaimer also appears as an HTML comment (static guard)", () => {
  const comments = [];
  walk(document.documentElement, (n) => {
    if (n.nodeType === 8) comments.push(n.textContent || "");
  });
  return comments.some((c) => c.includes("fictional sample data")) || "missing";
});
const tabs = [...document.querySelectorAll('[role="tab"]')];
check("tab/tabpanel counts match", () =>
  tabs.length === panels.length || `${tabs.length} tabs vs ${panels.length} panels`,
);
check("tabs are wired (aria-controls, labelledby, selected)", () => {
  const bad = [];
  tabs.forEach((t, i) => {
    const pid = t.getAttribute("aria-controls");
    const panel = pid && document.getElementById(pid);
    if (!panel) bad.push(`tab[${i}] aria-controls="${pid}" has no panel`);
    else if (panel.getAttribute("aria-labelledby") !== t.id)
      bad.push(`panel ${pid} aria-labelledby mismatch`);
    if (i === 0 ? t.getAttribute("aria-selected") !== "true" : t.getAttribute("aria-selected") !== "false")
      bad.push(`tab[${i}] aria-selected wrong`);
    if (i === 0 ? !panel?.classList.contains("is-active") : panel?.classList.contains("is-active"))
      bad.push(`panel ${pid} is-active mismatch`);
    if (!t.id) bad.push(`tab[${i}] has no id`);
  });
  return bad.length === 0 || bad;
});
check("dashboard section is #examples with 4 industry panels", () => {
  const sec = document.getElementById("examples");
  if (!sec) return "missing #examples";
  return sec.querySelectorAll('[role="tabpanel"]').length === 4 || "panels not inside #examples";
});
check("hero mockup carries the exact approved disclaimer", () => {
  const cap = document.querySelector(".mockup-caption");
  if (!cap) return ".mockup-caption missing";
  return text(cap) === DISCLAIMER_TEXT || `found: ${text(cap)}`;
});
check("every illustrative mockup carries exactly one approved disclaimer", () => {
  const caps = [...document.querySelectorAll(".mockup-caption"), ...document.querySelectorAll(".dash-disclaimer")];
  const bad = caps.filter((el) => text(el) !== DISCLAIMER_TEXT).map((el) => text(el).slice(0, 70));
  if (bad.length) return `wording drift: ${bad.join(" | ")}`;
  if (document.querySelectorAll(".mockup-caption").length !== 1) return "expected exactly 1 .mockup-caption (hero)";
  const perPanel = panels.map((p) => p.querySelectorAll(".dash-disclaimer").length);
  if (perPanel.some((n) => n !== 1)) {
    return `expected exactly 1 disclaimer per panel, got ${perPanel.join("/")}`;
  }
  const dis = document.querySelectorAll(".dash-disclaimer").length;
  return dis === panels.length || `${dis} .dash-disclaimer for ${panels.length} dashboard panels`;
});
check("dashboard frames carry no inline styles", () => {
  const bad = [...document.querySelectorAll("#examples [style]")].map((e) => e.tagName + "." + e.className);
  return bad.length === 0 || `inline styles: ${[...new Set(bad)].join(", ")}`;
});

/* ------------------------------------------------------------------ *
 * 8. No CRM messaging outside two documented exceptions:
 *    - the module name "Sales & CRM" (a real module, named in the brief)
 *    - the six hidden radio `value` attributes (live Google Form option text)
 * ------------------------------------------------------------------ */
const ALLOWED_CRM = /sales\s*(?:&|&amp;)\s*crm/gi; // "Sales & CRM", raw or HTML-escaped
const crmHits = [];
walk(document.body, (n) => {
  if (n.nodeType === 8) return; // HTML comments document the mapping on purpose
  if (n.nodeType === 3) {
    const parent = n.parentNode;
    const tag = (parent?.nodeName || "").toLowerCase();
    if (tag === "script" || tag === "style") return;
    /* Test the parent's whole text: linkedom splits text nodes at HTML entities,
       so "Sales &amp; CRM" arrives as "...Sales &" + "CRM". */
    const ownerText = (parent?.textContent || n.textContent || "").replace(ALLOWED_CRM, "");
    if (/crm/i.test(ownerText))
      crmHits.push(`text in <${tag}>: ${ownerText.trim().slice(0, 90)}`);
    return;
  }
  if (n.nodeType !== 1) return;
  for (const attr of n.attributes || []) {
    if (attr.name === "value") continue; // live Google Form option text
    if (/crm/i.test(attr.value.replace(ALLOWED_CRM, "")))
      crmHits.push(`${(n.nodeName || "").toLowerCase()}@${attr.name}: ${attr.value.slice(0, 90)}`);
  }
});
add(crmHits.length === 0, "index.html: no CRM messaging outside the documented exceptions", [...new Set(crmHits)]);
add(!/crm/i.test(bodyText().replace(ALLOWED_CRM, "")), "body text contains no CRM string outside the module name", undefined);
add(
  document.body.innerHTML.split(ALLOWED_CRM).length - 1 <= 2,
  'visible "Sales & CRM" appears at most twice (module name only)',
  undefined,
);

/* ------------------------------------------------------------------ *
 * 9. Anchors, ids, heading order
 * ------------------------------------------------------------------ */
const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
const dupIds = ids.filter((v, i) => ids.indexOf(v) !== i);
add(dupIds.length === 0, "index.html: no duplicate ids", [...new Set(dupIds)]);
const deadAnchors = [...document.querySelectorAll('a[href^="#"]')]
  .map((a) => a.getAttribute("href"))
  .filter((h) => h.length > 1 && !document.getElementById(decodeURIComponent(h.slice(1))));
add(deadAnchors.length === 0, "index.html: every in-page anchor resolves", [...new Set(deadAnchors)]);
const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
  lvl: Number(h.nodeName[1]),
  txt: text(h).slice(0, 60),
}));
const skips = [];
for (let i = 1; i < headings.length; i++) {
  if (headings[i].lvl - headings[i - 1].lvl > 1)
    skips.push(`h${headings[i - 1].lvl} "${headings[i - 1].txt}" -> h${headings[i].lvl} "${headings[i].txt}"`);
}
add(skips.length === 0, "index.html: no heading-level skips", skips);
const localLinks = [...document.querySelectorAll('a[href^="index.html#"]')].map((a) =>
  a.getAttribute("href").slice("index.html".length),
);
const deadLocal = localLinks.filter((h) => h.length > 1 && !document.getElementById(h.slice(1)));
add(deadLocal.length === 0, "privacy.html-style index.html# anchors resolve", [...new Set(deadLocal)]);

/* ------------------------------------------------------------------ *
 * 10. CTA wiring
 * ------------------------------------------------------------------ */
const ctaForms = [...document.querySelectorAll("[data-cta-form]")];
check("at least 6 form CTAs", () => ctaForms.length >= 6 || `found ${ctaForms.length}`);
check("every form CTA is href=#contact with data-cta-section", () => {
  const bad = ctaForms
    .filter((a) => a.getAttribute("href") !== "#contact" || !a.getAttribute("data-cta-section"))
    .map((a) => `${a.tagName.toLowerCase()}${a.id ? "#" + a.id : ""} href="${a.getAttribute("href")}"`);
  return bad.length === 0 || bad;
});
check("sticky CTA exists and uses the spec label", () => {
  const s = document.getElementById("sticky-cta");
  if (!s) return "missing #sticky-cta";
  /* aria-hidden on a still-focusable link traps keyboard users; css hides it instead. */
  if (s.getAttribute("aria-hidden") === "true") return "sticky CTA is aria-hidden while focusable";
  return text(s) === CTA_LABEL || `found: ${text(s)}`;
});
check("header CTA uses the spec label", () => {
  const s = document.querySelector(".nav-cta");
  return text(s) === CTA_LABEL || `found: ${text(s)}`;
});
check("header nav matches the spec set and resolves", () => {
  const links = [...document.querySelectorAll(".nav-list .nav-link")];
  const got = links.map((a) => [text(a), a.getAttribute("href")]);
  const want = [["Examples", "#examples"], ["What We Build", "#services"], ["Process", "#process"], ["FAQ", "#faq"]];
  return JSON.stringify(got) === JSON.stringify(want) || `found: ${JSON.stringify(got)}`;
});

/* ------------------------------------------------------------------ *
 * 11. Hero must carry the five commercial messages above the fold
 * ------------------------------------------------------------------ */
check("hero copy carries the 5 required messages", () => {
  const hero = document.getElementById("hero");
  if (!hero) return "missing #hero";
  const t = text(hero).toLowerCase();
  const need = [
    ["custom ERP", "custom erp"],
    ["modular delivery", "modular"],
    ["not a generic platform", "generic platform"],
    ["the $10,000 qualification", PRICE.toLowerCase()],
    ["free 30-minute review", "free 30-minute review"],
  ];
  const bad = need.filter(([, s]) => !t.includes(s)).map(([l]) => l);
  return bad.length === 0 || `missing: ${bad.join(", ")}`;
});
check("hero H1 and primary CTA use the approved strings", () => {
  const h1 = text(document.querySelector("#hero h1"));
  if (h1 !== "ERP software built around your business.") return `h1: "${h1}"`;
  const cta = document.querySelector("#hero [data-cta-form]");
  return text(cta) === SUBMIT_LABEL || `hero CTA: "${text(cta)}"`;
});
/* The launch docs enumerate the CTA wording, so the wording is now an assertion.
   Two labels ship: the long one on buttons, the short one in the two nav links. */
check("CTA labels match the two documented variants", () => {
  const links = [...document.querySelectorAll("[data-cta-form]")];
  if (links.length < 5) return `only ${links.length} [data-cta-form] links`;
  const odd = links.filter((a) => text(a) !== SUBMIT_LABEL && text(a) !== CTA_LABEL)
    .map((a) => `${a.getAttribute("data-cta-section")}: "${text(a)}"`);
  if (odd.length) return `undocumented CTA label → ${odd.join(" | ")}`;
  const short = links.filter((a) => text(a) === CTA_LABEL)
    .map((a) => a.getAttribute("data-cta-section"));
  if (short.join(",") !== "nav,sticky-cta") {
    return `short label belongs to nav and sticky only, found: ${short.join(",") || "none"}`;
  }
  return true;
});
check(`price ${PRICE} appears in the page`, () => bodyText().includes(PRICE) || "missing");
check("email fallback present", () => bodyText().includes("administration@cuoretechllc.com") || "missing");
check("social proof placeholder still hidden", () => {
  const sec = document.querySelector(".social-proof");
  if (!sec) return true;
  return /hidden/.test(sec.getAttribute("class") || "") || sec.hasAttribute("hidden") || "not hidden";
});
check("no invented social proof numbers", () => {
  const bad = [];
  const sec = document.querySelector(".social-proof");
  if (sec && /\d+\s*\+?\s*(clients|projects|years|companies)/i.test(sec.textContent)) bad.push(text(sec).slice(0, 120));
  return bad.length === 0 || bad;
});
check("no receipt-guarantee language", () => {
  const f = text(document.getElementById("form-status"));
  return !/we received/i.test(htmlSrc) || "page claims a submission was received";
});

/* ------------------------------------------------------------------ *
 * 12. Form payload test: execute js/main.js against the real DOM
 * ------------------------------------------------------------------ */
check("untouched markup preselects no goal, so nothing is sent that nobody chose", () => {
  const fd = new URLSearchParams();
  for (const el of document.querySelectorAll("form input, form textarea")) {
    const name = el.getAttribute("name");
    if (!name) continue;
    if (el.getAttribute("type") === "radio") {
      if (el.hasAttribute("checked")) fd.append(name, el.getAttribute("value") || "");
    } else if (el.getAttribute("type") === "checkbox") {
      if (el.hasAttribute("checked")) fd.append(name, el.getAttribute("value") || "on");
    } else {
      fd.append(name, el.getAttribute("value") || "");
    }
  }
  if (fd.has("goal")) return `markup preselects goal "${fd.get("goal")}"`;
  /* js/main.js still has a defensive fallback for an empty goal. */
  if (!/"Not sure yet"/.test(jsSrc)) return 'no "Not sure yet" fallback in js/main.js';
  return true;
});

/* Live run: jsdom + the real js/main.js + a captured fetch. This is the closest
   thing to a browser this sandbox allows (no browser binary can be spawned). */
const { JSDOM, VirtualConsole } = await import("jsdom");
async function runForm() {
  const vc = new VirtualConsole();
  const dom = new JSDOM(htmlSrc, {
    url: "https://cuoretechllc.com/?gclid=TESTCLICK&utm_source=google&utm_medium=cpc",
    runScripts: "outside-only",
    virtualConsole: vc,
  });
  const w = dom.window;
  const captured = [];
  w.fetch = (url, opts) => {
    captured.push({ url, body: opts && opts.body, opts });
    return Promise.resolve({ ok: true, status: 0, text: () => Promise.resolve("") });
  };
  const jsErrors = [];
  w.addEventListener("error", (e) => jsErrors.push(String(e.message)));
  w.eval(jsSrc);
  w.document.dispatchEvent(new w.Event("DOMContentLoaded"));
  const d = w.document;
  /* Fire the CTAs before submitting so the event contract can be observed. */
  const fire = (selector) => {
    const el = d.querySelector(selector);
    if (el) el.dispatchEvent(new w.MouseEvent("click", { bubbles: true, cancelable: true }));
  };
  fire("[data-cta-form]");
  fire("[data-cta-email]");
  const form = d.getElementById("contact-form");
  if (!form) return { error: "#contact-form not found" };
  const radio = form.querySelector('input[type="radio"]');
  if (radio) radio.checked = true;
  const set = (name, value) => {
    const el = form.querySelector(`[name="${name}"]`);
    if (el) el.value = value;
  };
  set("email", "ops@example.com");
  set("name", "Sample Prospect");
  set("bottleneck", "Inventory tracking is still in spreadsheets");
  const readEvents = () =>
    (w.dataLayer || []).filter((a) => a && a[0] === "event").map((a) => String(a[1]));
  /* Snapshot before submitting: nothing that counts as a lead may have fired yet. */
  const preSubmitEvents = readEvents();
  form.dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 60));
  const statusEl = d.getElementById("cf-status") || d.querySelector('[aria-live]');
  const events = readEvents();
  return {
    captured,
    preSubmitEvents,
    events,
    status: statusEl ? String(statusEl.textContent).trim() : "",
    button: (form.querySelector("button[type=submit]") || {}).textContent || "",
    jsErrors,
    formReset: !(form.querySelector('[name="email"]') || {}).value,
  };
}
const run = await runForm();
check("jsdom run: no JS errors on load", () =>
  !run.error && (run.jsErrors || []).length === 0 || `errors: ${(run.jsErrors || []).join("; ")}${run.error ? ` ${run.error}` : ""}`,
);
check("jsdom run: one POST to the live formResponse endpoint", () => {
  if (run.error) return run.error;
  if (run.captured.length !== 1) return `${run.captured.length} fetch calls`;
  return run.captured[0].url === FORM_ENDPOINT || `found: ${run.captured[0].url}`;
});
check("jsdom run: payload has exactly the four live entry.* keys", () => {
  if (run.error) return run.error;
  const body = run.captured[0].body;
  const pairs = typeof body?.entries === "function" ? [...body.entries()] : [];
  const keys = pairs.map(([k]) => k);
  const entries = keys.filter((k) => k.startsWith("entry."));
  const others = keys.filter((k) => !k.startsWith("entry."));
  const missing = ENTRY_IDS.filter((k) => !entries.includes(k));
  const badOther = others.filter((k) => !["fvv", "pageHistory"].includes(k));
  if (missing.length) return `missing ${missing.join(",")}`;
  if (entries.length !== 4) return `entry keys: ${entries.join(",")}`;
  if (badOther.length) return `unexpected keys: ${badOther.join(",")}`;
  const goal = pairs.find(([k]) => k === ENTRY_IDS[0])?.[1];
  if (goal !== RADIO_VALUES[0]) return `goal sent as "${goal}"`;
  const email = pairs.find(([k]) => k === ENTRY_IDS[2])?.[1];
  if (email !== "ops@example.com") return `email sent as "${email}"`;
  const ctx = pairs.find(([k]) => k === ENTRY_IDS[1])?.[1] || "";
  if (!/gclid: TESTCLICK/.test(ctx) || !/utm_source: google/.test(ctx))
    return `attribution missing from context: ${JSON.stringify(ctx.slice(0, 160))}`;
  return true;
});
check("jsdom run: success message never claims the request was received", () => {
  if (run.error) return run.error;
  return !/we (received|have received)|request (has been )?received/i.test(run.status) ||
    `status said: "${run.status}"`;
});
check("jsdom run: success message is the approved microcopy verbatim", () =>
  run.status === SUCCESS_TEXT || `status: "${run.status}"`,
);
check("js restore text matches the submit button label", () => {
  const m = jsSrc.match(/textContent\s*=\s*value \? "([^"]*)" : "([^"]*)"/);
  if (!m) return "could not find the restoring setSubmitting() text";
  const btn = text(document.querySelector('form button[type="submit"]'));
  return m[2] === btn || `js restores "${m[2]}" but the button reads "${btn}"`;
});

/* ------------------------------------------------------------------ *
 * 13. js/main.js
 * ------------------------------------------------------------------ */
check("js/main.js parses", () => {
  // The sandbox refuses to spawn a child node (`node --check`), so compile the
  // exact same source through vm instead: syntax-checked, never executed.
  new vm.Script(jsSrc, { filename: "js/main.js" });
  return true;
});
const EVENTS = [
  "lp_page_view",
  "lp_scroll_depth",
  "main_cta_click",
  "email_click",
  "lp_form_submit",
  "generate_lead",
];
check("js/main.js emits the approved event names", () => {
  const missing = EVENTS.filter((e) => !jsSrc.includes(`"${e}"`));
  return missing.length === 0 || `missing: ${missing.join(", ")}`;
});
check("js/main.js has no crm_ event names", () => !/crm_[a-z]+/i.test(jsSrc) || "crm_* event found");
check("generate_lead is emitted from exactly one place in the source", () => {
  const n = (jsSrc.match(/"generate_lead"/g) || []).length;
  if (n !== 1) return `${n} occurrences, expected 1`;
  return /form_name:\s*"erp_fit_review"/.test(jsSrc) || "generate_lead lost its form_name parameter";
});
check("jsdom run: no lead conversion fires before the form is submitted", () => {
  if (run.error) return run.error;
  const pre = run.preSubmitEvents || [];
  if (pre.indexOf("main_cta_click") < 0) return "main_cta_click did not fire on a CTA click";
  if (pre.indexOf("email_click") < 0) return "email_click did not fire on the email CTA";
  if (pre.some((e) => e === "generate_lead" || e === "lp_form_submit")) {
    return `lead signal fired before submit: ${pre.join(", ")}`;
  }
  return true;
});
check("jsdom run: exactly one lead conversion after the POST resolves", () => {
  if (run.error) return run.error;
  const ev = run.events || [];
  const leads = ev.filter((e) => e === "generate_lead").length;
  if (leads !== 1) return `${leads} generate_lead events after one submit, expected 1 (${ev.join(", ")})`;
  const submits = ev.filter((e) => e === "lp_form_submit").length;
  if (submits !== 1) return `${submits} lp_form_submit events, expected 1`;
  if ((run.preSubmitEvents || []).length >= ev.length) return "submit produced no new events";
  return true;
});
check("analytics ids stay empty", () => {
  const g = (k) => (jsSrc.match(new RegExp(`${k}:\\s*"([^"]*)"`)) || [])[1];
  const bad = ["ga4Id", "adsConversionId", "adsConversionLabel"].filter((k) => g(k) !== "");
  return bad.length === 0 || `${bad.join(", ")} is populated (must stay empty with a TODO)`;
});
check("js/main.js keeps the endpoint and entries", () => {
  const bad = [FORM_ENDPOINT, ...ENTRY_IDS].filter((s) => !jsSrc.includes(s));
  return bad.length === 0 || `missing: ${bad.join(", ")}`;
});

/* ------------------------------------------------------------------ *
 * 14. American English (history files exempt)
 * ------------------------------------------------------------------ */
const BRITISH = [
  "optimis", "analys", "customis", "modularis", "organis", "realis(?!t)", "recognis",
  "summaris", "prioritis", "utilis", "standardis", "finalis", "colour", "behaviour",
  "centre", "licence", "programme", "fulfilment", "judgement", "modell(?:ed|ing)\\b",
  "labell(?:ed|ing)\\b", "travell", "defence", "artefact", "enquir",
  "catalogu", "whilst", "amongst", "favourit", "honourab", "neighbourh",
  "authoris", "minimis", "maximis", "characteris", "emphasis(?:e|ed|ing)\\b",
];
/* "realis(?!t)" keeps "realistic" legal, and the (?:ed|ing)\b forms avoid
   aria-labelledby / aria-modal style attribute names. */
const scanned = [
  "index.html", "privacy.html", "css/style.css", "js/main.js", "sitemap.xml",
  "robots.txt", "GOOGLE-ADS-LAUNCH.md",
  /* ERP-MIGRATION-REPORT.md is intentionally Spanish, and this tool carries the
     word list itself, so scanning either would only produce noise. */
];
for (const rel of scanned) {
  if (!has(rel)) continue;
  const src = read(rel);
  const hits = [];
  for (const w of BRITISH) {
    const m = new RegExp(w, "i").exec(src);
    if (m) hits.push(`${w} → "…${src.slice(Math.max(0, m.index - 34), m.index + 34).replace(/\s+/g, " ")}…"`);
  }
  add(hits.length === 0, `${rel}: American English`, hits.length ? hits : undefined);
}

/* ------------------------------------------------------------------ *
 * 15. Sitemap (§4)
 * ------------------------------------------------------------------ */
if (has("sitemap.xml")) {
  const sm = read("sitemap.xml");
  const lastmods = [...sm.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
  check("sitemap lastmod is 2026-09-10", () =>
    (lastmods.length === 2 && lastmods.every((d) => d === "2026-09-10")) || `found: ${lastmods.join(", ")}`,
  );
  check("sitemap locs unchanged", () => {
    const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    return JSON.stringify(locs) === JSON.stringify(["https://cuoretechllc.com/", "https://cuoretechllc.com/privacy.html"]) || `found: ${locs.join(", ")}`;
  });
}

/* ------------------------------------------------------------------ *
 * 16. Encoding, CSS and asset integrity
 * ------------------------------------------------------------------ */
const TEXT_FILES = [
  "index.html", "privacy.html", "css/style.css", "js/main.js", "sitemap.xml",
  "robots.txt", "GOOGLE-ADS-LAUNCH.md", "cuore-tech-symbol.svg", "tools/verify.mjs",
  ".htmlvalidate.json", "CHANGES.md", "ERP-MIGRATION-REPORT.md",
];
/* Mojibake signatures: UTF-8 bytes that were once decoded as CP1252/latin-1 and
   re-saved. Written with escapes so this file cannot trip its own check.
   U+00C3 + latin-1 char, "a-with-tilde + euro", U+00C2 + latin-1 char, "eth + y-circumflex". */
const MOJIBAKE = /\u00C3[\u0080-\u00BF]|\u00E2\u20AC|\u00C2[\u00A0-\u00BF]|\u00F0\u0178/u;
for (const rel of TEXT_FILES) {
  if (!has(rel)) continue;
  check(`${rel}: valid UTF-8, no mojibake`, () => {
    const buf = readFileSync(path.join(ROOT, rel));
    try {
      new TextDecoder("utf-8", { fatal: true }).decode(buf);
    } catch {
      return "not valid UTF-8";
    }
    const src = buf.toString("utf8");
    const m = MOJIBAKE.exec(src);
    if (m) return `mojibake near "${src.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, " ")}"`;
    if (src.charCodeAt(0) === 0xfeff) return "starts with a UTF-8 BOM";
    if (/\r\n/.test(src)) return "contains CRLF line endings";
    return true;
  });
}

if (has("css/style.css")) {
  const cssSrc = read("css/style.css");
  const csstreeMod = await import("css-tree").catch(() => null);
  const csstree = csstreeMod ? (csstreeMod.default ?? csstreeMod) : null;
  check("css/style.css parses as valid CSS", () => {
    if (!csstree) return "css-tree is not installed";
    const errors = [];
    csstree.parse(cssSrc, { positions: true, onParseError: (e) => errors.push(`${e.line}:${e.column} ${e.message}`) });
    return errors.length === 0 || errors.slice(0, 6);
  });
  check("every css custom property used is defined", () => {
    const defined = new Set([...cssSrc.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]));
    /* var(--x, fallback) is legal without a declaration; a bare var(--x) is not. */
    const used = new Set(
      [...cssSrc.matchAll(/var\(\s*(--[a-z0-9-]+)(\s*,)?/gi)].filter((m) => !m[2]).map((m) => m[1]),
    );
    const missing = [...used].filter((v) => !defined.has(v));
    return missing.length === 0 || `undefined: ${missing.join(", ")}`;
  });
}

check("index.html: every local asset resolves to a file", () => {
  const bad = [];
  for (const el of document.querySelectorAll("[href], [src]")) {
    const v = el.getAttribute("href") || el.getAttribute("src") || "";
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/i.test(v)) continue;
    const rel = decodeURIComponent(v.split("#")[0].split("?")[0]);
    if (!rel) continue;
    if (!has(rel)) bad.push(`${el.tagName.toLowerCase()} → ${v}`);
  }
  return bad.length === 0 || [...new Set(bad)];
});

if (has("privacy.html")) {
  const { document: pdoc } = parseHTML(read("privacy.html"));
  check("privacy.html: no duplicate ids", () => {
    const seen = new Set();
    const dup = new Set();
    for (const el of pdoc.querySelectorAll("[id]")) {
      const id = el.getAttribute("id");
      if (seen.has(id)) dup.add(id);
      seen.add(id);
    }
    return dup.size === 0 || [...dup];
  });
  check("privacy.html: in-page anchors resolve and it links home", () => {
    const bad = [];
    for (const a of pdoc.querySelectorAll('a[href^="#"]')) {
      const id = a.getAttribute("href").slice(1);
      if (id && !pdoc.getElementById(id)) bad.push(a.getAttribute("href"));
    }
    const home = [...pdoc.querySelectorAll('a[href]')].some((a) =>
      /^(\/|index\.html|https:\/\/cuoretechllc\.com\/?)$/.test(a.getAttribute("href")),
    );
    if (!home) bad.push("no link back to the landing page");
    return bad.length === 0 || bad;
  });
  check("privacy.html: single H1 and a canonical", () => {
    const h1 = pdoc.querySelectorAll("h1").length;
    const canon = pdoc.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
    if (h1 !== 1) return `${h1} H1 elements`;
    return canon === "https://cuoretechllc.com/privacy.html" || `canonical: ${canon}`;
  });
  check("privacy.html: nav CTA is the documented short label to the form", () => {
    const cta = pdoc.querySelector(".nav-cta");
    if (!cta) return "missing .nav-cta";
    if (text(cta) !== PRIVACY_CTA_LABEL) return `found: ${text(cta)}`;
    return /#contact$/.test(cta.getAttribute("href") || "") || `href: ${cta.getAttribute("href")}`;
  });
}

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */
const failures = results.filter((r) => !r.ok);
for (const r of results) {
  if (r.ok) process.stdout.write(`  ok   ${r.name}\n`);
  else process.stdout.write(`  FAIL ${r.name}${r.detail ? `\n         ${r.detail}\n` : ""}`);
}
process.stdout.write(`\n${results.length - failures.length}/${results.length} checks passed\n`);
process.exit(failures.length ? 1 : 0);
