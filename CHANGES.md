# Improvements in this version

Current offer on the page: a senior-led **custom ERP and business operations software**
development service (not a packaged ERP, not SaaS, not a reseller). Full change log of the
migration from the previous CRM positioning: `ERP-MIGRATION-REPORT.md`.

## Positioning and conversion

- Reworked the hero around the approved copy: **ERP software built around your business.** with the
  `CUSTOM ERP DEVELOPMENT FOR B2B OPERATIONS` eyebrow and the modular build supporting line.
- Page states plainly that Cuore discovers, designs, builds, integrates and supports modular
  business systems, delivered in phases, and that accounting/payroll/banking are integrated rather
  than rebuilt.
- Turned the primary CTA into one offer pointing at one form: **Request My Free Fit Review** on the
  hero, section CTAs and the submit button, shortened to **Request a Free Fit Review** in the sticky
  nav link.
- Kept the project anchor: **Projects typically start at $10,000.** above the fold, in the process
  section and in the structured data.
- Kept an honest build-vs-buy comparison, including the cases where packaged software is the better
  answer, plus a "not right for everyone" qualification block with a CTA.
- AI appears only as a delivery accelerator, never as the product.
- Replaced the CRM-era positioning quote with: "The right system is not the one with the most
  features. It is the one your operation can actually rely on."
- Services, use cases, modules and integrations rewritten around orders, inventory, workflows,
  approvals, integrations and reporting. "Sales & CRM" survives only as a module name.

## Illustrative dashboards

- `#examples` is now a keyboard-accessible tablist with four industries: **Retail, Restaurant,
  Travel, Manufacturing**. Each panel measures that industry's own numbers (AOV and stock turnover,
  covers and food cost, package margin and departures, work orders and scrap rate) and has its own
  layout and accent, not a recolored copy.
- Every panel carries the disclaimer `Illustrative concept — fictional sample data. Not a client
  system or client result.`, and the hero mockup keeps its caption. No client names, logos, metrics
  or results are claimed anywhere.
- Panel spacing and bar widths moved from inline styles to CSS utilities.

## Trust and usability

- Form no longer preselects a goal option; the choice is required and the visible labels are ERP
  wording while the submitted values still match the live Google Form (see
  `GOOGLE-ADS-LAUNCH.md`, "Google Form migration").
- Success message says the request was **submitted**, never that it was received or read, and keeps
  the 1 business day reply promise.
- Dashboard tabs keep roving tabindex, `aria-selected`/`aria-controls` and a `.no-js` fallback that
  shows all panels. The `aria-live` status region belongs to the contact form.
- Contrast tokens corrected (`--text-on-light` on light sections), focus states and
  `prefers-reduced-motion` behavior preserved. American English throughout the shipped files.

## Google Ads and measurement

- Analytics events renamed to product-neutral names: `lp_page_view`, `lp_scroll_depth`,
  `main_cta_click`, `email_click`, `lp_form_submit`, plus `generate_lead` with
  `form_name: "erp_fit_review"`.
- A CTA click never counts as a lead: `generate_lead` fires only on a submitted form.
- GA4 and Google Ads conversion IDs are deliberately **empty**; nothing is measured until they are
  configured. No ID was invented.
- UTM, `gclid`, `gbraid`, `wbraid`, landing page and referrer are still captured per session and
  appended to the "current setup" answer, because the live Form has no dedicated attribution
  questions. Until those questions and their `entry.*` IDs exist, attribution is not queryable as
  its own column in Google Sheets.
- A `no-cors` submission cannot be verified in the browser, so the page never claims delivery.

## SEO and technical

- Title, meta description, Open Graph and Twitter copy rewritten for B2B custom ERP intent;
  canonical stays `https://cuoretechllc.com/`.
- JSON-LD `ProfessionalService` description, `priceRange` (`$10,000+`) and the six-item service
  catalog match the visible page; `FAQPage` mirrors the visible FAQ verbatim and in order.
- `cuore-tech-symbol.svg` used consistently in header, footer and favicon.
- `robots.txt` and `sitemap.xml` refreshed (`lastmod` 2026-09-10); privacy page stays indexable and
  links back to the landing page.

## Verification

`node tools/verify.mjs` (110 checks, all passing), `node --check js/main.js`, `html-validate` (0
errors on `index.html` and `privacy.html`), a jsdom run of the real form submit, duplicate-ID/anchor
checks, and `node tools/audit.mjs`, a repo-wide terminology and encoding audit.
The lead-separation rules were also mutation-tested with `tools/mutation-check.mjs`, which
temporarily breaks `js/main.js` in three ways
(lead on CTA click, two leads per submit, no lead) and confirms the suite fails each time and then
restores the file byte-for-byte.
Results and the remaining external launch blockers are in `ERP-MIGRATION-REPORT.md`. Nothing has
been deployed and no Google Ads or Google Forms setting has been changed.
