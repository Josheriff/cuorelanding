/* Repo-wide audit that verify.mjs deliberately does not do: it scans *every* text
   file in the repository (including the historical docs and the user's own briefs)
   for retired terminology, and reports byte-level encoding hygiene per file.

     node tools/audit.mjs            summary only
     node tools/audit.mjs --lines    also print each terminology hit  */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SKIP_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  ".next",
  ".npm-cache",
  ".pw-browsers",
  "logs",
  ".cache",
]);
const BINARY = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".woff", ".woff2", ".pdf", ".zip"]);
const showLines = process.argv.includes("--lines");

const TERMS = [
  "crm", "salesforce", "hubspot", "pipeline", "deal", "deals", "lead", "leads",
  "crm_page_view", "crm_cta_click", "crm_scroll_depth", "crm_form_submit", "crm_email_click",
];
/* Unique terms, longest first so "leads" is reported before "lead". */
const UNIQUE = [...new Set(TERMS)].sort((a, b) => b.length - a.length);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "." || entry === ".." || SKIP_DIRS.has(entry)) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (!BINARY.has(entry.slice(entry.lastIndexOf(".")).toLowerCase())) out.push(p);
  }
  return out;
}

const root = process.cwd();
const files = walk(root).sort();
const hits = new Map();
const encoding = [];
let scanned = 0;

for (const file of files) {
  const rel = relative(root, file).replaceAll("\\", "/");
  if (rel.startsWith("tools/audit.")) continue;
  scanned++;
  const buf = readFileSync(file);
  const badByte = buf.includes(0);
  let text = "";
  let decoded = true;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(buf);
  } catch {
    decoded = false;
  }
  const moji = decoded && /\u00C3[\u0080-\u00BF]|\u00E2\u20AC|\u00C2[\u00A0-\u00BF]|\u00F0\u0178/u.test(text);
  const notes = [];
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) notes.push("BOM");
  if (decoded && /\r\n/.test(text)) notes.push("CRLF");
  if (decoded && !/\n$/.test(text) && text.length) notes.push("no-final-newline");
  if (!decoded) notes.push("NOT-UTF8");
  if (badByte) notes.push("NUL");
  if (moji) notes.push("MOJIBAKE");
  if (notes.length) encoding.push([rel, notes.join(" ")]);

  if (!decoded) continue;
  text.split(/\r?\n/).forEach((line, i) => {
    const low = line.toLowerCase();
    const found = UNIQUE.filter((t) => low.includes(t));
    if (found.length) {
      if (!hits.has(rel)) hits.set(rel, new Map());
      const per = hits.get(rel);
      for (const t of found) {
        if (!per.has(t)) per.set(t, []);
        per.get(t).push(`${i + 1}`);
      }
    }
  });
}

process.stdout.write("== Terminology (case-insensitive, whole repo) ==\n");
if (!hits.size) process.stdout.write("  no hits\n");
for (const [rel, per] of [...hits].sort()) {
  const parts = [...per].map(([t, lines]) => `${t} x${lines.length}`);
  process.stdout.write(`  ${rel}: ${parts.join(", ")}\n`);
  if (showLines) {
    for (const [t, lines] of per) process.stdout.write(`      ${t}: ${lines.slice(0, 12).join(", ")}\n`);
  }
}

process.stdout.write("\n== Encoding hygiene ==\n");
if (!encoding.length) process.stdout.write("  all text files: valid UTF-8, no BOM, LF, final newline\n");
for (const [rel, notes] of encoding) process.stdout.write(`  ${rel}: ${notes}\n`);
process.stdout.write(`\n${scanned} files scanned (${files.length - scanned} skipped)\n`);
