/**
 * Cookie Consent Manager
 * Handles user consent for analytics tracking (Google Analytics, LinkedIn Pixel)
 */

(function() {
  'use strict';

  const CONSENT_KEY = 'danubius_cookie_consent';
  const GA_ID = 'G-BBMLVLVENP';
  const LINKEDIN_PARTNER_ID = '8104441';

  /**
   * Get stored consent value
   * @returns {string|null} 'accepted', 'rejected', or null
   */
  function getConsent() {
    return localStorage.getItem(CONSENT_KEY);
  }

  /**
   * Store consent value
   * @param {string} value - 'accepted' or 'rejected'
   */
  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
  }

  /**
   * Load Google Analytics
   */
  function loadGoogleAnalytics() {
    // Create and inject the gtag script
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  /**
   * Load LinkedIn Insight Tag
   */
  function loadLinkedInPixel() {
    window._linkedin_partner_id = LINKEDIN_PARTNER_ID;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(LINKEDIN_PARTNER_ID);

    (function(l) {
      if (!l) {
        window.lintrk = function(a, b) {
          window.lintrk.q.push([a, b]);
        };
        window.lintrk.q = [];
      }
      var s = document.getElementsByTagName('script')[0];
      var b = document.createElement('script');
      b.type = 'text/javascript';
      b.async = true;
      b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
      s.parentNode.insertBefore(b, s);
    })(window.lintrk);
  }

  /**
   * Load all tracking scripts
   */
  function loadTracking() {
    loadGoogleAnalytics();
    loadLinkedInPixel();
  }

  /**
   * Show the cookie consent banner
   */
  function showBanner() {
    const banner = document.getElementById('cookie-consent');
    if (banner) {
      banner.classList.add('cookie-banner--visible');
    }
  }

  /**
   * Hide the cookie consent banner
   */
  function hideBanner() {
    const banner = document.getElementById('cookie-consent');
    if (banner) {
      banner.classList.remove('cookie-banner--visible');
    }
  }

  /**
   * Handle accept button click
   */
  function handleAccept() {
    setConsent('accepted');
    hideBanner();
    loadTracking();
  }

  /**
   * Handle reject button click
   */
  function handleReject() {
    setConsent('rejected');
    hideBanner();
  }

  /**
   * Initialize cookie consent
   */
  function init() {
    const consent = getConsent();

    if (consent === 'accepted') {
      // User already accepted, load tracking
      loadTracking();
    } else if (consent === 'rejected') {
      // User already rejected, do nothing
    } else {
      // No consent yet, show banner
      showBanner();
    }

    // Attach event listeners
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', handleAccept);
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', handleReject);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
