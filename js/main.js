(function () {
  "use strict";

  var SITE_CONFIG = {
    googleFormEndpoint: "https://docs.google.com/forms/d/e/1FAIpQLSe98q9LdffZJThYr-Le6N9Yy1fGnYGBNlsxHgqKSUmL7QFijA/formResponse",
    googleFormEntries: {
      goal: "entry.1467467639",
      bottleneck: "entry.1006754821",
      email: "entry.2026813663",
      name: "entry.293749142"
    },
    contactEmail: "administration@cuoretechllc.com",
    ga4Id: "",
    adsConversionId: "",
    adsConversionLabel: ""
  };

  var ATTRIBUTION_KEYS = [
    "utm_source", "utm_medium", "utm_campaign", "utm_term",
    "utm_content", "gclid", "gbraid", "wbraid"
  ];
  var SCROLL_THRESHOLDS = [25, 50, 75, 90];

  function $all(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function track(event, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params || {});
    }
  }

  function bootstrapGtag() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    var tagId = SITE_CONFIG.ga4Id || SITE_CONFIG.adsConversionId;
    if (!tagId) return;

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(tagId);
    document.head.appendChild(script);
    window.gtag("js", new Date());
    if (SITE_CONFIG.ga4Id) window.gtag("config", SITE_CONFIG.ga4Id, { send_page_view: true });
    if (SITE_CONFIG.adsConversionId && SITE_CONFIG.adsConversionId !== SITE_CONFIG.ga4Id) {
      window.gtag("config", SITE_CONFIG.adsConversionId);
    }
  }

  function captureAttribution() {
    var params = new URLSearchParams(window.location.search);
    ATTRIBUTION_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) sessionStorage.setItem("cuore_" + key, value.slice(0, 500));
    });

    if (!sessionStorage.getItem("cuore_landing_page")) {
      sessionStorage.setItem("cuore_landing_page", window.location.href.slice(0, 1500));
    }
    if (!sessionStorage.getItem("cuore_referrer") && document.referrer) {
      sessionStorage.setItem("cuore_referrer", document.referrer.slice(0, 1500));
    }
  }

  function getAttributionLines() {
    var lines = [];
    ATTRIBUTION_KEYS.forEach(function (key) {
      var value = sessionStorage.getItem("cuore_" + key);
      if (value) lines.push(key + ": " + value);
    });

    var landingPage = sessionStorage.getItem("cuore_landing_page");
    var referrer = sessionStorage.getItem("cuore_referrer");
    if (landingPage) lines.push("landing_page: " + landingPage);
    if (referrer) lines.push("referrer: " + referrer);
    return lines;
  }

  function sendConversion(email, name) {
    if (!SITE_CONFIG.adsConversionId || !SITE_CONFIG.adsConversionLabel || typeof window.gtag !== "function") return;

    window.gtag("set", "user_data", {
      email: email.trim().toLowerCase(),
      first_name: name.trim()
    });
    window.gtag("event", "conversion", {
      send_to: SITE_CONFIG.adsConversionId + "/" + SITE_CONFIG.adsConversionLabel
    });
  }

  function wireCTAs() {
    document.addEventListener("click", function (event) {
      var cta = event.target.closest("[data-cta-form], [data-cta-email]");
      if (!cta) return;
      var section = cta.getAttribute("data-cta-section") || "unknown";
      if (cta.hasAttribute("data-cta-form")) {
        track("crm_cta_click", { cta_location: section });
      } else {
        track("crm_email_click", { cta_location: section });
      }
    });
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var statusEl = document.getElementById("cf-status");
    var submitButton = form.querySelector("button[type='submit']");
    var submitting = false;

    function setStatus(message, isError) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.toggle("is-error", Boolean(isError));
      statusEl.hidden = !message;
    }

    function setSubmitting(value) {
      submitting = value;
      if (!submitButton) return;
      submitButton.disabled = value;
      submitButton.setAttribute("aria-busy", value ? "true" : "false");
      submitButton.textContent = value ? "Sending..." : "Request My Free CRM Fit Review";
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (submitting) return;

      var formData = new FormData(form);
      var goal = String(formData.get("goal") || "Not sure yet").trim();
      var bottleneck = String(formData.get("bottleneck") || "").trim();
      var email = String(formData.get("email") || "").trim();
      var name = String(formData.get("name") || "").trim();
      var attribution = getAttributionLines();
      var context = bottleneck;

      if (attribution.length) {
        context += (context ? "\n\n" : "") + "[Attribution]\n" + attribution.join("\n");
      }

      var googlePayload = new FormData();
      googlePayload.append(SITE_CONFIG.googleFormEntries.goal, goal);
      googlePayload.append(SITE_CONFIG.googleFormEntries.bottleneck, context || "No additional context provided");
      googlePayload.append(SITE_CONFIG.googleFormEntries.email, email);
      googlePayload.append(SITE_CONFIG.googleFormEntries.name, name);
      googlePayload.append("fvv", "1");
      googlePayload.append("pageHistory", "0");

      setStatus("", false);
      setSubmitting(true);

      fetch(SITE_CONFIG.googleFormEndpoint, {
        method: "POST",
        mode: "no-cors",
        body: googlePayload,
        keepalive: true
      })
        .then(function () {
          track("generate_lead", { form_name: "crm_fit_review" });
          track("crm_form_submit", { method: "google_forms" });
          sendConversion(email, name);
          form.reset();
          setStatus("Thank you. We received your request and will contact you to arrange your free CRM Fit Review.", false);
        })
        .catch(function () {
          setStatus("We could not send your request. Please try again or email " + SITE_CONFIG.contactEmail + ".", true);
        })
        .finally(function () { setSubmitting(false); });
    });
  }

  function initMobileNav() {
    var nav = document.getElementById("site-nav");
    var toggle = document.querySelector(".nav-toggle");
    if (!nav || !toggle) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
    document.addEventListener("click", function (event) {
      if (nav.classList.contains("is-open") && !nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
    });
    $all("#site-nav .nav-link").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
  }

  function initScrollDepth() {
    var reached = {};
    var ticking = false;
    function check() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0) {
        var percent = Math.round((window.scrollY / max) * 100);
        SCROLL_THRESHOLDS.forEach(function (threshold) {
          if (!reached[threshold] && percent >= threshold) {
            reached[threshold] = true;
            track("crm_scroll_depth", { percent: threshold });
          }
        });
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(check);
      }
    }, { passive: true });
  }

  function initReveals() {
    var items = $all("[data-reveal]");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (item) { observer.observe(item); });
  }

  function initStickyCta() {
    var sticky = document.getElementById("sticky-cta");
    var hero = document.getElementById("hero");
    var finalCta = document.getElementById("final-cta");
    if (!sticky || !hero || !finalCta || !("IntersectionObserver" in window)) return;

    var mobile = window.matchMedia("(max-width: 768px)");
    var heroVisible = true;
    var finalVisible = false;
    function update() {
      var show = mobile.matches && !heroVisible && !finalVisible;
      sticky.classList.toggle("is-visible", show);
      sticky.setAttribute("aria-hidden", show ? "false" : "true");
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === finalCta) finalVisible = entry.isIntersecting;
      });
      update();
    }, { threshold: 0.1 });
    observer.observe(hero);
    observer.observe(finalCta);
    if (typeof mobile.addEventListener === "function") mobile.addEventListener("change", update);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.classList.remove("no-js");
    captureAttribution();
    bootstrapGtag();
    track("crm_page_view", {});
    wireCTAs();
    initContactForm();
    initMobileNav();
    initScrollDepth();
    initReveals();
    initStickyCta();

    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();
