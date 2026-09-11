# Cuore Tech — pre-launch checklist

The landing page is a lead-generation page for a custom ERP and business operations software
development service. It submits to Google Forms and passes campaign attribution inside the
"current setup" answer, not as its own columns (see "Attribution" below).

Nothing in this repository has been deployed, and no Google Ads or Google Forms setting has been
changed. Steps 2–7 below happen in the Google accounts and step 8 in the hosting settings of this
repository. Step 1 and step 2 of "Google Form migration" are edits inside this repository
(`js/main.js`, `index.html`) that then have to be deployed before they take effect.

## Required before paid traffic

1. In `js/main.js`, set `ga4Id`, `adsConversionId` and `adsConversionLabel` inside `SITE_CONFIG`.
   They are deliberately empty; the page ships with no analytics ID and no conversion ID.
2. Create the Google Ads conversion action for a **submitted Fit Review form** — a stored form
   submission on the Google Forms response, not a CTA click. A CTA click only fires
   `main_cta_click` and must never be imported as a conversion.
3. Enable Enhanced Conversions for Leads for that conversion action.
4. Migrate the Google Form's option text to the ERP wording (see "Google Form migration" below).
   Until this is done, the submitted `goal` values still read as the old CRM options.
5. Submit a real test lead from a production URL containing test UTMs and confirm:
   - one response appears in the Google Sheet linked to the Form;
   - the "current setup" answer contains the UTMs, landing page and any click ID;
   - exactly one `generate_lead` event and one `lp_form_submit` event are recorded in GA4;
   - exactly one Google Ads conversion is recorded.
   Delete the test row afterwards.
6. Add the domain to Google Search Console and submit `/sitemap.xml`.
7. Confirm HTTPS, the canonical URL, the favicon and the privacy page work on production.
8. Confirm what actually publishes this repository. It ships no hosting or CI configuration of its
   own (there is no `.github/`, `netlify.toml` or `vercel.json` here), so what appears at
   `cuoretechllc.com` depends entirely on the host settings: check the GitHub Pages branch and
   folder in the repository settings, since a source pointing at another branch or directory
   publishes stale content or nothing at all. That setting cannot be read from this repository and
   has not been verified — check it in the account before any ad spend, then reload the production
   URL and confirm the ERP page is what is served.

## Measurement plan

Events the page emits. Each one is pushed straight into `window.dataLayer`; nothing leaves the
browser while the ids below stay empty, and the `gtag.js` loader is only injected once `ga4Id` or an
Ads id is set:

| Event | Fires when | Notes |
| --- | --- | --- |
| `lp_page_view` | page load | |
| `lp_scroll_depth` | 25 / 50 / 75 / 90 % | `percent` parameter |
| `main_cta_click` | a click on any CTA link carrying `data-cta-form` (nav, hero, fit, mid-page, final, sticky) | `cta_location` parameter; not a conversion |
| `email_click` | mailto link | `cta_location` parameter |
| `lp_form_submit` | form POST resolved | `method: google_forms`; the only lead signal besides `generate_lead` |
| `generate_lead` | form POST resolved | `form_name: erp_fit_review` |

The submit button is deliberately not marked with `data-cta-form`, so pressing it produces
`lp_form_submit` and `generate_lead` only.

Create matching custom dimensions in GA4 for `cta_location`, `percent` and `form_name`.

## Google Form migration

The six visible goal options in `index.html` are paired with six hidden `value` attributes that
still match the live Form's old option text. Those hidden values, the migration comment above them
and the module name **Sales & CRM** (once as a use-case card, once in `#modules`, where a CRM module
built inside the ERP is a genuinely accurate name for what is delivered) are the only CRM wording
left in the source; the page sells ERP, not CRM. The endpoint and the four `entry.*` ids must not
change during the migration.

1. In the live Google Form, replace the six options of the primary-goal question with the six
   visible labels used in `index.html`, in the same order.
2. Replace the six `value` attributes in `index.html` with those same six strings, keeping each
   `entry.*` id in `js/main.js` unchanged.
3. Submit one real test through the published page.
4. Confirm the test row in the linked Google Sheet, then delete it.

## Attribution

`js/main.js` captures `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`,
`gclid`, `gbraid` and `wbraid` into `sessionStorage`, plus landing page and referrer. Those values
are appended to the "current setup" answer as an `[Attribution]` text block.

**Limitation:** the Form has no dedicated attribution questions, so GCLID and UTM values are not
separately queryable columns in Google Sheets today. Adding them means creating those questions in
the Form first and copying their real `entry.*` ids into `SITE_CONFIG.googleFormEntries`. Do not
invent entry ids.

## Important limitation

Google Forms is submitted cross-origin with `mode: "no-cors"`. The browser receives an opaque
response: the code can tell that the request was sent, but it cannot read Google's answer and
therefore cannot prove that a row was stored. A resolved promise is not a confirmed lead. The page
says "submitted", never "received", and every launch test must be verified in the Google Sheet.
