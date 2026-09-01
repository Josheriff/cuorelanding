# Cuore Tech — pre-launch checklist

The landing is connected to Google Forms and records campaign attribution in the lead's context field.

## Required before paid traffic

1. In `js/main.js`, set `ga4Id`, `adsConversionId` and `adsConversionLabel` inside `SITE_CONFIG`.
2. Configure the Google Ads conversion action for **submitted CRM Fit Review**, not CTA clicks.
3. Enable Enhanced Conversions for Leads for that conversion action.
4. Submit a real test lead from a URL containing test UTMs and confirm:
   - one response appears in Google Forms;
   - the context includes UTMs, landing page and any click ID;
   - exactly one `generate_lead` event is recorded;
   - exactly one Google Ads conversion is recorded.
5. Add the domain to Google Search Console and submit `/sitemap.xml`.
6. Confirm HTTPS, the canonical URL and the privacy page work on production.

## Recommended first campaign

- Google Search only; disable Search Partners initially.
- Exact and phrase match commercial-intent terms only.
- Target people present in the chosen locations, not people merely interested in them.
- Review search terms daily during the first week.
- Use a shared negative list covering free, template, tutorial, jobs, salary, course, certification, open source and student intent.
- Optimise for qualified opportunities once there is enough downstream data, not raw form volume alone.

## Important limitation

Google Forms accepts the request through a cross-origin `no-cors` submission. The browser can confirm that the request was sent, but cannot read Google's response body. Always run a real end-to-end test after deployment.
