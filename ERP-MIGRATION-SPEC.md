# ERP Migration Spec — Cuore Tech landing page

Contract for implementation rounds. Work in batches, keep the page valid after every batch, and
run `node tools/verify.mjs` before finishing a round.

> **Status: subordinate to the final marketing brief.** Where this spec and the brief disagree, the
> brief won and is what `index.html` ships. Superseded lines are left in place for the record:
> the hero eyebrow is `CUSTOM ERP DEVELOPMENT FOR B2B OPERATIONS` and the H1 is the short
> `ERP software built around your business.` (not §4); the price is written **`$10,000`**, never
> `USD 10,000`; the CTA click event is **`main_cta_click`** (not `cta_click`); the visible quote is
> "The right system is not the one with the most features. It is the one your operation can actually
> rely on."; §"No CRM leakage" allows the module name **Sales & CRM** and the dashboard examples are
> four industries (Retail, Restaurant, Travel, Manufacturing), not the verticals listed below. The
> only other permitted CRM strings are the hidden Google Form `value` attributes and their migration
> comment. See `ERP-MIGRATION-REPORT.md` for what shipped and what is still pending off-repo.

## 0. Objective

Migrate the landing page from **custom CRM development** to a **B2B custom ERP + business
operations software** service, in **American English**, optimized to convert Google Ads traffic.

The page must communicate, plainly and above the fold:

- Cuore Tech **designs and implements custom business/ERP systems module by module**, adapted to each
  company's processes, integrations, metrics and dashboards.
- It is a **development and implementation service**, **not a generic SaaS**, **not a closed
  product**, and there is **no Cuore ERP subscription or instant demo**.
- **Who it is for** (operations-heavy B2B companies with non-standard workflows), **when custom is
  worth it** (honest build-or-buy), and **the next commercial step** (free 30-minute fit review).
- **Initial phases typically start at USD 10,000.**

## 1. Hard rules

1. **Never invent** clients, testimonials, logos, case studies, ratings, awards, project counts,
   years in business, revenue results, guaranteed timelines or certifications.
2. **No dead claims about receipt.** The form posts cross-origin with `mode: "no-cors"`, so an HTTP
   200 proves nothing. Never write "We received your request".
3. **Do not change**: the Google Forms endpoint, the four `data-googleforms` entry IDs
   (`entry.1467467639`, `entry.1006754821`, `entry.2026813663`, `entry.293749142`), the canonical URL
   `https://cuoretechllc.com/`, existing section `id`s used by nav/footer/sticky links, or
   `href="#contact"` + `data-cta-section` behavior on CTAs.
4. **Radio `value` attributes must keep matching the live Google Form options** (verified against
   the form on this task): `Replace our existing CRM`, `Build a CRM from scratch`,
   `Automate manual processes`, `Integrate existing tools`, `Reduce license fees and complexity`,
   `Not sure yet`. The visible **label text** changes to ERP wording; the `value` does not. Keep the
   first option `checked`. See §12 for the mapping and the follow-up external step.
5. **American English** everywhere: `license`, `utilization`, `modeling`, `program`, `inquiry`,
   `analyze`, `center`, `behavior`, `customize`, `organize`, `recognize`.
6. Preserve: static no-build site, single `index.html`, deferred script, visible price, honest
   comparison, phased process, "30 minutes · No obligation", email fallback
   `administration@cuoretechllc.com`, privacy link, native labels/validation, `aria-live` status,
   keyboard-accessible tabs, **dashboards visible without JS**, `prefers-reduced-motion`, contrast,
   mobile comparison layout, hidden social-proof placeholder (stays hidden, no fake proof).
7. Reuse existing CSS classes; add new CSS only when a block genuinely needs it.
8. Keep `LANDING_CHANGES*.md`, `IMPLEMENTATION-REPORT.md`, `CHANGES.md` as history. Do not delete them.

## 2. Copy blocks (final wording)

Replace text nodes only; keep element structure, classes, `data-reveal`, `aria-*` scaffolding and
`&mdash;`/`&middot;` entity style used in the file.

### 2.1 `<head>` (SEO)

- `<title>Custom ERP Development for B2B Companies | Cuore Tech</title>`
- `description`: `Custom ERP development for operations-heavy B2B companies. A senior-led team builds business software module by module: workflows, integrations, metrics and dashboards.`
- `og:title` / `twitter:title`: `Custom ERP Development for B2B Companies | Cuore Tech`
- `og:description` / `twitter:description`: `Custom ERP and business operations software, designed and built module by module around your processes. Not a generic SaaS product. Initial phases typically start at USD 10,000.`
- Add `<meta name="robots" content="index,follow">` if absent. Keep canonical, theme-color, Inter font, inline favicon as they are.
- Keep the GA4 / Google Ads `<script>` TODO blocks in place and still empty; update their TODO comments to say `generate_lead` + `lp_*` events.
- JSON-LD `@graph`: keep `ProfessionalService` + `WebSite` + `FAQPage`. **`FAQPage.mainEntity` must
  mirror the visible FAQ questions and answers word for word** (§2.12). `hasOfferCatalog.itemList`
  items must match the six "What we build" cards (§2.7). Update `priceRange` note if present; keep
  `USD` and the `10000` minimum mentioned only in body copy, not as a fake price schema.

### 2.2 Hero (`#hero`)

- `.eyebrow`: `Custom ERP &amp; business operations software`
- `h1`: `Custom ERP development built around how your business actually runs` (keep any inner
  `<span class="…">` accent wrapper pattern the file already uses)
- `.hero-sub`: `Cuore Tech designs and builds the software your operations depend on &mdash; workflows, approvals, integrations, metrics and dashboards &mdash; delivered module by module around your processes.`
- `.hero-brand-line`: `Your software should fit your business. Not the other way around.`
- Primary CTA text: `Request My Free Fit Review`
- `.hero-micro`: `30 minutes &middot; No obligation &middot; Honest build-or-buy recommendation`
- `.hero-trust` (3 items): `Senior-led from discovery to delivery` ·
  `Built by module, scope agreed before development starts` · `Initial phases typically start at USD 10,000`

Hero mockup (`role="img"`, decorative inside) — relabel as an operations console with **sample,
obviously fictional data** and **no company names**:

- `aria-label`: `Preview of a custom-built operations system: a purchase order board, a navigation sidebar and an automation status card. Illustrative concept with fictional sample data.`
- `.mockup-brand`: `Ops Console`; `.mockup-search`: `Search orders, items, vendors…`
- Sidebar items: `Dashboard`, `Purchase orders`, `Inventory`, `Vendors`, `Approvals`, `Reports`
- `.mockup-main-title`: `Purchase orders`; `.mockup-chip`: `Sample data`
- Kanban columns: `Awaiting approval` (2), `Approved` (3), `Received` (6). Cards, two per column for
  the first two and one in the last:
  `PO-1042 · Packaging stock` / `Sample vendor · $8,450 · Lead time 6 days`;
  `PO-1047 · Freight lane 12` / `Sample vendor · $1,920 · Due Friday`;
  `PO-1038 · MRO supplies` / `Sample vendor · $2,310 · Partially received`;
  `PO-1051 · Labels and tags` / `Sample vendor · $640 · Auto-approved`;
  `PO-1029 · Pallets` / `Sample vendor · $4,180 · 12 of 20 received`
- `.automation-title`: `Approval rule ran`; `.automation-desc`: `Orders under $500 auto-approved and posted to accounting`
  (update the card `aria-label` the same way, ending with `Sample data shown.`)
- Add a visible caption directly under `.mockup`:
  `<p class="mockup-caption">Illustrative interface concept with fictional sample data. Not a client system or client result.</p>`
  Style it small, muted, same max-width as the mockup (add `.mockup-caption` CSS).

### 2.3 Problem (`#problem`)

- eyebrow: `When generic stops working`
- h2: `Your operations run on software that none of it was built for.`
- lead: `Custom development becomes worth considering when your teams repeatedly have to work around the system:`
- six `.problem-item` entries:
  1. `Critical work still happens in spreadsheets`
  2. `Teams re-enter the same data across systems`
  3. `Approvals and handoffs depend on manual follow-up`
  4. `License and add-on costs keep growing`
  5. `Integrations are fragile or incomplete`
  6. `Your actual process lives outside your software`
- closer: `The problem isn&rsquo;t your business. The problem is software that wasn&rsquo;t built for it.`

### 2.4 Service model (`#service-model`)

- eyebrow: `Service, not subscription`
- h2: `We don&rsquo;t sell another ERP subscription.`
- lead: `We design and build the system your company needs &mdash; closer to having a senior product and engineering team assigned to one problem than to buying another license.`
- item 1 title `Consulting, design, development and integration` / text unchanged in spirit:
  `One team carries the project from business problem to working software, including the connections to the systems you already run.`
- item 2 title `A working system, not a configuration document` /
  `Each phase ends with software your team uses, so decisions get made against something real.`
- item 3 title `Modules defined before development starts` /
  `Every module is scoped with its data, workflow, integrations, metrics and acceptance criteria before code begins.`
- item 4 title `You stay in control` /
  `Hosting, source code, maintenance and roadmap stay with you, according to the agreed project scope.`

### 2.5 Why custom (`#why-custom`)

Keep eyebrow/h2. Lead unchanged except "generic implementation reseller" stays. Key line:
`You get pragmatic technical judgment, a clear first phase and a system your team can evolve without unnecessary vendor lock-in.`

### 2.6 Build or buy (`#fit`)

- eyebrow: `An honest build-or-buy decision`
- h2: `Custom ERP is not the right answer for every company.`
- lead: `If a well-configured packaged ERP or operations platform covers your workflow, we will tell you &mdash; and tell you what it will cost you to live inside it. Custom becomes compelling when your processes, integrations or economics are genuinely different.`
- Table headers: `Stay with packaged software if…` / `Consider custom if…`
- Rows (left → right), keeping `data-label` attributes consistent with the new header wording:
  1. `Your process is standard for your industry` → `Your workflow is a competitive advantage`
  2. `You need something live this month` → `Control over data, hosting and roadmap is a priority`
  3. `Standard reports and a generic dashboard are enough` → `Workarounds and manual steps dominate daily work`
  4. `Your integrations are simple and stable` → `ERP, accounting, inventory or proprietary systems must connect`
  5. `Per-seat costs are not material at your size` → `Licenses, add-ons and change orders are getting expensive`
- Add after the table:
  `<p class="table-note">Packaged software can be extended too, and a custom system still has running costs such as hosting, maintenance and support. The difference is who decides what gets built next.</p>`
  (add minimal `.table-note` CSS matching `.dash-note` styling)
- Keep `data-label` values on `td` in sync (e.g. `Packaged software fits` / `Custom may fit`) —
  mobile-stacked table depends on them.

### 2.7 What we build (`#services`) — 6 cards, order fixed (mirrors JSON-LD catalog)

1. `Custom ERP and operations system design` — `Your real process becomes the architecture: records, states, roles, approvals and the metrics that matter to your operation.`
2. `Legacy system and spreadsheet replacement` — `We move the records and history worth keeping out of aging software and shadow spreadsheets, then build the workflow around them.`
3. `Workflow and approval automation` — `Rekeying, chasing approvals and month-end spreadsheets become background workflows with an audit trail.`
4. `System integrations` — `Accounting, payroll, payment providers, e-commerce, POS, warehouses and internal databases connected through APIs, queues and controlled sync.`
5. `Reporting and custom dashboards` — `Each module ships with the metrics its owner needs, calculated from live data instead of exported to a spreadsheet.`
6. `Support, hosting options and enhancement` — `After go-live we can host, maintain and extend the system under an agreed support scope, or hand it over documented to your team.`

Keep existing icons/markup. If the section has fewer than six cards, add cards reusing `.card.card-dark`
with an inline SVG in the existing stroke style (no new colors beyond the existing palette).

### 2.8 Use cases (`#use-cases`) — 6 items

1. `Operations and approvals` — `Quote to order, purchase orders, stock movements, exception handling and multi-level approvals with a full audit trail.`
2. `Inventory, procurement and orders` — `Stock levels, suppliers, lead times and order status in one place instead of a shared spreadsheet.`
3. `Customers, accounts and contracts` — `The operational view of each customer: contracts, service levels, price lists and the documents that go with them.`
4. `Document and compliance workflows` — `Generate, approve, version and retain the documents your operation and your auditors depend on.`
5. `Data migration and legacy replacement` — `Extracting the data worth keeping from old ERP software, spreadsheets and end-of-life tools into a system that fits today.`
6. `Integrations and reporting layer` — `One view assembled from the systems you keep, with dashboards for the people who act on it.`

### 2.9 Modules (`#modules`) — 6 cards + clarifying lead

Lead (add/replace): `Modules are the shape of the work, not a product catalogue. Yours are defined during discovery.`

1. `Master data and records` — `Customers, suppliers, items, contracts and the relationships between them, with duplicate control and history.`
2. `Workflows and approvals` — `States, transitions, roles and escalation rules that match how work actually moves through your business.`
3. `Inventory, procurement and orders` — `Stock, purchase orders, lead times and fulfilment status connected to the rest of the system.`
4. `Integrations and data pipelines` — `APIs, scheduled sync and queues that keep accounting, payroll, e-commerce and internal databases consistent.`
5. `Metrics, dashboards and reports` — `Operational and financial KPIs defined with the people who use them, calculated from live data.`
6. `Roles, audit and access control` — `Who can see and change what, with an audit trail and controlled document retention.`

Keep the `.accent-blue|teal|violet|amber` rotation already in the file.

### 2.10 Dashboard examples by industry (`#examples`) — **4 tabs**

- eyebrow: `Dashboard examples by industry`
- h2: `The same system, measured differently in every industry.`
- lead: `Each example shows the kind of dashboard and metrics a module set can produce for an industry. They are illustrative interfaces built with fictional sample data &mdash; not client systems or client results.`
- Add under the tabs (before the first panel), as `<p class="dash-disclaimer">These examples show possible workflows and metrics. Modules, integrations and dashboards are designed during discovery; they are not prebuilt products.</p>`
- **Every panel** must contain, as its first visible child, the illustrative banner (reuse `.dash-banner`
  or add `.dash-illustrative`): `Illustrative concept &mdash; fictional sample data. Not a client system or client result.`
- **Every panel must have visible text** (not only `aria-label`/`aria-hidden` content).
- Replace invented account names (`Northline Supply`, `Cobalt Industries`, `Meridian Foods`, etc.)
  with `Sample account A`, `Sample account B`, `Customer 12`, `Sample vendor`, `Lane 12`.
- Any delta (`+4 pts QoQ`, `▲ 12%`) must be suffixed or accompanied by `sample` wording, e.g.
  chip text `Sample` next to KPIs, or a KPI label ending in `(sample target)`. Do not present deltas
  as achieved client results.
- Tabs (`role="tab"`, roving tabindex, `aria-controls`, `aria-selected` — keep `initTabs()` working
  for **4** tabs; verify no hardcoded count of 3 in JS or CSS):
  1. **Distribution &amp; inventory** (`#examples`, existing distribution panel, renamed entities)
     KPIs: `On-time delivery` `94.2%` · `Inventory value` `$412,800` · `Fill rate` `91.6%` ·
     `Open purchase orders` `23`. Blocks: `Reorder points breached` list (3 rows w/ pills),
     `Vendor lead time (days)` bars (`Sample vendor A` 6, `Sample vendor B` 11, `Sample vendor C` 4),
     note.
  2. **Manufacturing &amp; production** (new panel, reuse `.dash-*` classes; add
     `.dash-frame--manufacturing` accent following the existing accent pattern)
     KPIs: `Schedule adherence` `88.4%` · `Machine utilization` `71.2%` · `Scrap rate` `2.4%` ·
     `Late work orders` `7`. Blocks: `Work orders by stage` progress list
     (`Awaiting materials` 7, `In production` 12, `Quality check` 4, `Ready to dispatch` 21);
     `Top delay causes this week` list with pills (`Material shortage` red, `Changeover` amber,
     `Machine down` amber, `Rework` teal); banner `3 purchase orders late against promised dates`.
  3. **Field &amp; project services** (reuse existing services panel)
     KPIs: `Jobs on schedule` `76%` · `Gross margin per job` `34.1%` · `Open change orders` `9` ·
     `Invoiced within 5 days` `68%`. Blocks: `Approvals waiting` list
     (`Awaiting client sign-off`, `Awaiting parts`, `Ready to invoice`);
     `Crew utilization by week` bars.
  4. **Travel &amp; logistics** (reuse existing travel panel; rename any partner/agency names to
     `Partner A/B/C`, `Booking ref 4471`)
     KPIs: `Bookings in pipeline` `38` · `Documents complete` `82%` · `Departures next 7 days` `9` ·
     `Exceptions open` `5`. Blocks: booking pipeline funnel, `Partner load` bars, `Exceptions` list
     (`Visa expiry`, `Payment pending`, `Manifest due`, `Guide conflict`).
- Ensure tab order/`aria-labelledby` pairing stays valid for 4 tabs and that panels without
  `.is-active` are hidden by CSS **but visible when JS is absent** (`.no-js` behavior must show all).

### 2.11 Process (`#process`, footer links to it — see §2.15)

1. `Free fit review` — `30 minutes on your current setup, bottlenecks and goals. You leave with an honest build-or-buy view, whether or not you work with us.`
2. `Process discovery and module plan` — `We map the workflows, data and integrations that matter, then propose modules in priority order with an indicative cost per phase.`
3. `Build in working phases` — `You see working software early and steer each phase. Scope changes are documented against cost and timeline.`
4. `Integrate, migrate and go live` — `Data moves across from the old system, integrations go live, your team is trained and the first dashboards start driving decisions.`
- Note under the steps: `Initial phases typically start at USD 10,000. Larger systems are scoped in phases with defined deliverables and acceptance criteria, so you can stop after any phase and still have something useful running.`

### 2.12 Positioning + FAQ + closing CTA

- `#positioning` quote: `The right system is not the one with the most features. It is the one your business can actually run on.`
- FAQ (`#faq`): keep the existing eight ERP questions, fix spellings (`licence`→`license`,
  `programme`→`program`), and **add three more** so the set covers the objections that stop a click:
  9. `Who hosts and maintains the system after go-live?` —
     `Your choice. Many clients run what we build in their own cloud account; others prefer managed hosting with support. Hosting, maintenance, updates, backups and support responsibilities are set out in the scope before development starts, and the source code and documentation stay yours as agreed.`
  10. `Do you build accounting or payroll?` —
      `Usually not from scratch. We integrate the accounting, payroll and banking platforms you already use and build the operational data flow into them. If a finance module is genuinely required, we scope it separately.`
  11. `Do you work with our existing developers or IT team?` —
      `Yes. We can own delivery end to end, work alongside an internal team, or hand over a documented system with the guardrails your team needs to maintain it.`
- **`FAQPage` JSON-LD must contain all eleven Q/A pairs, text-identical to the visible FAQ**
  (same punctuation after entity decoding; `’` vs `&rsquo;` must decode identically).
- Secondary CTA band: eyebrow `Free 30-minute fit review` · h2
  `Find out whether custom ERP development makes financial sense.` · lead
  `In a 30-minute call we review your current setup, identify what to solve first and give you an honest build-or-buy recommendation.` ·
  three bullets: `Where your current systems create cost or risk`,
  `What a sensible first module would include`, `Likely approach, dependencies and next steps` ·
  button `Request My Free Fit Review`
- Final CTA (`#final-cta` / before contact): h2 `Your software should fit your business. Not the other way around.` ·
  lead `Start with an honest 30-minute assessment of what your operation actually needs.` ·
  button `Request My Free Fit Review`
- Hidden social-proof placeholder: stays hidden; scrub any CRM wording inside it (comments too).

### 2.13 Contact (`#contact`) and form

- eyebrow: `Request your free fit review`
- h2: `Tell us where your current setup is holding you back.`
- lead: `We will review your situation and contact you to arrange a focused 30-minute conversation. If packaged software is the better answer, we will say so.`
- `<fieldset>` legend: `What is your primary goal?` (drop "for a new CRM"), `data-validation-message`
  like `Choose the option closest to your goal.`
- Six options: **visible labels** below, `value` attributes = live Google Form strings from §1.4,
  first one `checked`, order preserved. Add an HTML comment above the fieldset documenting the
  mapping and that the Google Form must be updated before the values can change:

  | visible label | `value` (unchanged, must match live form) |
  | --- | --- |
  | `Replace an ERP, legacy system or set of spreadsheets` | `Replace our existing CRM` |
  | `Build a custom business system from scratch` | `Build a CRM from scratch` |
  | `Automate manual processes and approvals` | `Automate manual processes` |
  | `Integrate the tools we already use` | `Integrate existing tools` |
  | `Reduce license fees and system complexity` | `Reduce license fees and complexity` |
  | `Not sure yet` | `Not sure yet` |

- Work email field, name field: keep labels, `required` on email, placeholders, `data-validation-message` text (ERP-neutral).
- Keep the commented-out bottleneck textarea block **uncommented-out state as-is** (it stays
  commented). If it is commented out, JS must still send the attribution text into
  `entry.1006754821` (it builds the value in JS, not from the DOM). Verify this still works when the
  field is absent from the DOM — no `null` dereference.
- Privacy line under the form: American English (`inquiry`), and it must not promise that the
  submission was received or stored.
- Below the form: keep the email fallback (`administration@cuoretechllc.com`) and privacy link.

### 2.14 Sticky CTA + header

- Sticky mobile CTA label and header CTA label: `Request a Free Fit Review`.
- Header nav links: `Examples` → `#examples`, `What We Build` → `#services`, `Process` → `#process`,
  `FAQ` → `#faq`, plus the CTA. Every `href="#…"` must resolve to an existing `id`.
- Sticky CTA keeps `aria-hidden` + `visibility:hidden` behavior until scrolled.

### 2.15 Footer

- `.footer-tagline`: `Custom ERP and business operations software, built around your business.`
- Footer nav must not contain dead anchors: `Is Custom Right?` → `#fit`, `What We Build` → `#services`,
  `Industries` → `#examples`, `Our Process` → `#process` (**fix the current dead `#how-it-works`**),
  `FAQ` → `#faq`, `Privacy` → `privacy.html`.

## 3. `js/main.js` changes

1. Rename analytics events (keep `track()` shape and the GA4/Ads double-emit):
   `crm_page_view`→`lp_page_view`, `crm_cta_click`→`cta_click`, `crm_email_click`→`email_click`,
   `crm_scroll_depth`→`lp_scroll_depth`, `crm_form_submit`→`lp_form_submit`;
   `generate_lead` payload `form_name: "erp_fit_review"`.
2. Submit button label while sending: `Request My Free Fit Review` (matching CTA).
3. Success text: `Your request has been submitted. If you don&rsquo;t hear from us, email administration@cuoretechllc.com.`
   Never claim receipt. On failure: `We couldn&rsquo;t send that. Please try again, or email administration@cuoretechllc.com.`
4. **Resilience**: wrap all `sessionStorage` access in a small safe helper (`try/catch`, returns
   `null` on failure) so a blocked storage API can never abort form initialization or submission.
   Wrap analytics calls (`gtag`, `track`) in their own `try/catch`; an analytics error must never
   surface as a submission failure.
5. Keep the in-flight lock, and add a **reload-surviving duplicate guard**: on successful submit set
   `localStorage["cuore_lead_sent"] = Date.now()`; if a submission happens within 24 h, show a status
   message saying a request was already sent from this browser and offering the email address, and
   provide a "Send another request" control that clears the flag. Must not break without `localStorage`.
6. Keep: UTM/gclid/gbraid/wbraid capture with the `cuore_` prefix, the attribution key list appended
   as `[Attribution]` lines, the single conversion path (`generate_lead` + `gtag("event","conversion",…)`
   only when `adsConversionLabel` is configured), `SCROLL_THRESHOLDS = [25,50,75,90]`, `initTabs()`
   (must work with 4 tabs).
7. `SITE_CONFIG`: keep `ga4Id`, `adsConversionId`, `adsConversionLabel` empty with clear TODO
   comments; document the expected event names and that `form_name` is `erp_fit_review`.

## 4. Other files

- `privacy.html`: replace CRM wording (`request a CRM Fit Review` → `request a fit review`),
  `enquiry`→`inquiry`, keep everything else; confirm link back to `index.html` works.
- `sitemap.xml`: `lastmod` → `2026-09-10`. `robots.txt`: unchanged unless sitemap path is wrong.
- `GOOGLE-ADS-LAUNCH.md`: rename the conversion action to the ERP fit review, list the new event
  names, state explicitly that the `no-cors` submission is **not verified** and how to confirm real
  leads in the Google Sheet, add the "update the Google Form question/option text, then update the
  matching `value` attributes in `index.html`" step, and keep the "IDs still empty" state accurate.
- `.gitignore`: create/extend with `node_modules/`, `.npm-cache/`, `.pw-browsers/`, `.tmp-shots/`.

## 5. Verification (must actually run)

`node tools/verify.mjs` (create it; use `linkedom` for parsing, plus `node --check js/main.js`).
It must exit non-zero on any error and print grouped results. Checks:

1. `index.html` and `privacy.html` parse; `<div>` open/close counts balance; **html-validate**
   (`require('html-validate')` is installed) reports 0 errors on both files.
2. `css/style.css` parses with `css-tree` (0 syntax errors); brace balance.
3. All `id`s unique; every internal `href="#x"` and `aria-controls`/`aria-labelledby`/
   `data-cta-form` target resolves; every `img` has `alt`; every `input`/`textarea` has an
   associated `<label>` (or `aria-label`); no heading-level skips; exactly one `<h1>`.
4. JSON-LD: `@graph` parses; `FAQPage` questions/answers **exactly match** the visible FAQ items
   (decode HTML entities before comparing).
5. **No CRM leakage**: case-insensitive `\bCRM\b` must not appear anywhere in `index.html`,
   `privacy.html`, `js/main.js`, `css/style.css`, `sitemap.xml`. (Allowed exception: the six live
   Google Form `value` attributes and the HTML comment documenting the mapping — the checker must
   allow exactly those occurrences and report any others as errors.)
6. **No British spellings**: `licence`, `programme`, `utilisation`, `organisation`, `analyse`,
   `colour`, `centre`, `enquiry`, `customise`, `prioritise`, `realise`, `recognise`, `behaviour`,
   `favour`, `defence`, `fulfilment`→ allowed only in nothing; use `fulfillment`.
7. **No invented evidence**: no lines matching `testimonials`, `Trusted by`, `clients include`,
   `5-star`, `awards`, `case stud`, `#1`, `\b\d+ clients\b`; each `.dash-panel` contains the word
   `Illustrative` and the tabs section contains `fictional sample data`.
8. **Form contract**: the form contains exactly 6 radios named `goal`; each `value` equals one of the
   six live Google Form strings; exactly one `checked`; `data-googleforms` entries are exactly the
   four approved IDs; endpoint string unchanged.
9. **Runtime smoke test** (jsdom or linkedom + stubs): load `js/main.js` with a stubbed `fetch`,
   `sessionStorage`, `localStorage`, `location.search` containing `utm_source=google&utm_medium=cpc&gclid=TEST`,
   simulate a submit with valid values → assert `fetch` called once, body contains all four entry
   IDs, the goal value matches, `[Attribution]` appears with `gclid=TEST`, no uncaught exception,
   status element gets text, and no `gtag` present doesn't throw. Also assert: empty email →
   validation blocks submit (no `fetch`); double submit → only one `fetch`.
10. Print a WARN section for things that need a real browser (Lighthouse, axe, layout overflow at
    320/360/390/768/1024/1440) — a browser cannot be installed in this sandbox; do **not** claim
    those checks passed.

## 6. Batch order

1. Head/SEO + JSON-LD graph skeleton + hero (incl. mockup relabel + caption CSS).
2. Problem, service model, why-custom, build-or-buy table (+ `.table-note` CSS).
3. What we build, use cases, modules.
4. Dashboard examples: 4 tabs, illustrative banners, renamed sample data, `.dash-frame--manufacturing`,
   `initTabs()` compatibility, no-JS visibility.
5. Process, positioning, secondary CTA, FAQ additions + JSON-LD FAQ mirror, final CTA, contact form,
   header/footer/sticky labels + dead-anchor fix.
6. `js/main.js` (events, labels, storage guards, duplicate guard, resilience) + `privacy.html` +
   `sitemap.xml` + `GOOGLE-ADS-LAUNCH.md` + `.gitignore`.
7. `tools/verify.mjs`, run it, fix everything it reports, re-run until clean.

## 7. Acceptance criteria

- Zero CRM messaging anywhere except the six live Google Form `value` attributes (documented).
- Hero states, above the fold: custom ERP/business software, module-by-module service, not a SaaS
  product, USD 10,000 entry point, next step = free 30-minute fit review.
- Four industry dashboard examples, each visibly labeled as illustrative fictional sample data, all
  keyboard accessible, all visible with JS disabled.
- FAQ JSON-LD mirrors the visible FAQ exactly.
- `node tools/verify.mjs` exits 0; `node --check js/main.js` passes; html-validate 0 errors;
  css-tree 0 errors; JSON-LD parses; form payload test passes.
- Nothing invented; no claim that a submission was received.
- American English throughout.
- No console/JS errors introduced; no dead anchors; no broken CSS.
