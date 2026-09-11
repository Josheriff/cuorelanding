/* Throwaway harness: proves the lead-separation checks actually fail on a bad
   implementation. Orchestration stays in the shell because the sandbox blocks
   captured child stdio from Node.
     node tools/mutation-check.mjs backup
     node tools/mutation-check.mjs apply 0|1|2
     node tools/mutation-check.mjs restore
*/
import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";

const FILE = "js/main.js";
const BAK = "tools/.main.bak";
const ANCHOR = 'track("main_cta_click", { cta_location: section });';

const cases = [
  ["lead emitted on a CTA click", (s) => s.replace(ANCHOR, ANCHOR + ' track("generate_lead", {});')],
  /* Exactly one duplicated emission: two lead events per submit, not three. */
  ["lead emitted twice per submit", (s) => {
    const at = s.indexOf('track("generate_lead"');
    const line = s.slice(at, s.indexOf("\n", at));
    return s.slice(0, at) + line + s.slice(at);
  }],
  ["lead never emitted", (s) => s.replace(/track\("generate_lead"/g, 'track("unused_lead"')],
];

const [mode, arg] = process.argv.slice(2);
if (mode === "backup") {
  writeFileSync(BAK, readFileSync(FILE, "utf8"));
  console.log("backup written");
} else if (mode === "apply") {
  const src = readFileSync(BAK, "utf8");
  const [name, mutate] = cases[Number(arg)];
  const out = mutate(src);
  if (out === src) { console.log(`SETUP MISS: ${name}`); process.exit(2); }
  writeFileSync(FILE, out);
  console.log(`applied: ${name}`);
} else if (mode === "restore") {
  writeFileSync(FILE, readFileSync(BAK, "utf8"));
  rmSync(BAK);
  console.log(existsSync(BAK) ? "RESTORE FAILED" : "restored and backup removed");
} else {
  console.log("usage: backup | apply <0|1|2> | restore");
  process.exit(2);
}
