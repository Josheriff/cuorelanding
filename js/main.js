(function () {
  "use strict";

  var SITE_CONFIG = {
    formUrl: "https:/forms.gle/g24y2LvLB8JVS35z7",
    ga4Id: "",
    gtmId: "",
    adsConversionId: "",
    adsConversionLabel: ""
  };

  function $(selector) {
    return document.querySelector(selector);
  }

  function $all(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  var SCROLL_THRESHOLDS = [25, 50, 75, 90];

  function track(event, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params || {});
    }
  }

  function bootstrapGtag() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    if (SITE_CONFIG.ga4Id) {
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + SITE_CONFIG.ga4Id;
      document.head.appendChild(s);
      window.gtag("js", new Date());
      window.gtag("config", SITE_CONFIG.ga4Id);
    }
  }

  function initAnalytics() {
    bootstrapGtag();
    track("crm_page_view", {});
  }

  function sendConversion() {
    if (SITE_CONFIG.adsConversionId && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: SITE_CONFIG.adsConversionId + "/" + SITE_CONFIG.adsConversionLabel
      });
    }
  }

  function wireCTAs() {
    $all("[data-cta-form]").forEach(function (el) {
      el.setAttribute("href", SITE_CONFIG.formUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
    document.addEventListener("click", function (e) {
      var cta = e.target.closest("[data-cta-form], [data-cta-email]");
      if (!cta) return;
      var section = cta.getAttribute("data-cta-section") || "";
      if (cta.hasAttribute("data-cta-form")) {
        track("crm_cta_click", { cta: section });
        track("crm_form_outbound", { cta: section });
        sendConversion();
      } else if (cta.hasAttribute("data-cta-email")) {
        track("crm_email_click", { cta: section });
      }
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

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });

    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) {
        setOpen(false);
      }
    });

    $all("#site-nav .nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }

  function initScrollDepth() {
    var reached = {};
    var ticking = false;

    function check() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) {
        ticking = false;
        return;
      }
      var percent = Math.round((window.scrollY / max) * 100);
      SCROLL_THRESHOLDS.forEach(function (t) {
        if (!reached[t] && percent >= t) {
          reached[t] = true;
          track("crm_scroll_depth", { percent: t });
        }
      });
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
    if (!items.length) return;

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(function (el) {
      io.observe(el);
    });
  }

  function initStickyCta() {
    var sticky = document.getElementById("sticky-cta");
    if (!sticky) return;

    var hero = document.getElementById("hero") || document.querySelector(".hero");
    var finalCta = document.getElementById("final-cta");
    if (!hero || !finalCta) return;

    var mobile = window.matchMedia("(max-width: 768px)");
    var heroVisible = false;
    var finalVisible = false;

    function update() {
      var show = mobile.matches && !heroVisible && !finalVisible;
      sticky.classList.toggle("is-visible", show);
      sticky.setAttribute("aria-hidden", show ? "false" : "true");
    }

    if (!("IntersectionObserver" in window)) {
      sticky.setAttribute("aria-hidden", "true");
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === finalCta) finalVisible = entry.isIntersecting;
      });
      update();
    }, { threshold: 0.1 });

    io.observe(hero);
    io.observe(finalCta);

    if (typeof mobile.addEventListener === "function") {
      mobile.addEventListener("change", update);
    } else if (typeof mobile.addListener === "function") {
      mobile.addListener(update);
    }
  }

  function initYear() {
    var el = document.getElementById("year");
    if (el) {
      el.textContent = String(new Date().getFullYear());
    }
  }

  function bindEvents() {
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var nav = document.getElementById("site-nav");
      var toggle = document.querySelector(".nav-toggle");
      if (nav && toggle && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initAnalytics();
    wireCTAs();
    bindEvents();
    initMobileNav();
    initScrollDepth();
    initReveals();
    initStickyCta();
    initYear();
  });
})();
