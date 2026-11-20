(() => {
  const measurementId = "G-S6H3X86TX3";
  const consentKey = "cv-analytics-consent";
  const ignoreKey = "cv-analytics-ignore";
  let storageAvailable = true;

  function read(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      storageAvailable = false;
      return null;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      storageAvailable = false;
    }
  }

  const url = new URL(location.href);
  const exclusion = url.searchParams.get("analytics");
  if (exclusion === "off" || exclusion === "on") {
    write(ignoreKey, exclusion === "off" ? "true" : "false");
    url.searchParams.delete("analytics");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }

  const ignored = read(ignoreKey) === "true";
  const consent = read(consentKey);
  const production = ["carolineverdier.com", "www.carolineverdier.com"].includes(location.hostname);
  window[`ga-disable-${measurementId}`] = ignored || consent !== "accepted" || !production;

  function startAnalytics() {
    if (ignored || !production || !storageAvailable || document.getElementById("cv-google-analytics")) return;
    window[`ga-disable-${measurementId}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    // Strip query strings and fragments, which can contain personal data.
    window.gtag("config", measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    window.gtag("event", "page_view", {
      page_location: location.origin + location.pathname,
      page_referrer: document.referrer ? document.referrer.split(/[?#]/)[0] : "",
    });
    const script = document.createElement("script");
    script.id = "cv-google-analytics";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
  }

  function clearCookies() {
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.trim().split("=")[0];
      if (name !== "_ga" && !name.startsWith("_ga_")) continue;
      for (const domain of ["", location.hostname, ".carolineverdier.com"]) {
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
      }
    }
  }

  const style = document.createElement("style");
  style.textContent = `
    #cv-analytics-panel { position:fixed; bottom:16px; left:16px; right:16px; max-width:520px; z-index:10000; padding:20px; background:#fffaf6; color:#35232a; border:1px solid #80616a; border-radius:12px; box-shadow:0 6px 30px #0002; font:14px/1.5 system-ui,sans-serif; }
    #cv-analytics-panel[hidden] { display:none; }
    #cv-analytics-panel p { margin:0 0 12px; }
    #cv-analytics-panel a { color:inherit; text-decoration:underline; }
    #cv-analytics-panel .cv-analytics-actions { display:flex; flex-wrap:wrap; gap:10px; }
    #cv-analytics-panel button, #cv-analytics-settings { font:inherit; cursor:pointer; padding:9px 14px; border:1px solid #80616a; border-radius:6px; background:#fffaf6; color:#35232a; }
    #cv-analytics-settings { display:block; margin:16px auto; font:12px/1.5 system-ui,sans-serif; }
  `;
  document.head.append(style);
  const panel = document.createElement("section");
  panel.id = "cv-analytics-panel";
  panel.setAttribute("aria-label", "Mesure d’audience et confidentialité");
  panel.innerHTML = `<p>Autorises-tu Google Analytics à mesurer les visites de ce site à l’aide de cookies ? Ton choix est facultatif et modifiable à tout moment. <a href="/politique-confidentialite">Confidentialité</a></p><div class="cv-analytics-actions"><button type="button" data-choice="accepted">Accepter</button><button type="button" data-choice="refused">Refuser</button></div>`;
  panel.hidden = ignored || consent === "accepted" || consent === "refused";
  const settings = document.createElement("button");
  settings.id = "cv-analytics-settings";
  settings.type = "button";
  settings.textContent = ignored ? "Statistiques : mes visites sont exclues" : "Préférences de confidentialité";
  settings.addEventListener("click", () => {
    panel.hidden = false;
    panel.querySelector("button").focus();
  });
  panel.addEventListener("click", (event) => {
    const choice = event.target.dataset.choice;
    if (!choice) return;
    write(consentKey, choice);
    if (choice === "accepted") {
      startAnalytics();
    } else {
      window[`ga-disable-${measurementId}`] = true;
      clearCookies();
      // Reload to stop an already-loaded Google script and its event listeners.
      if (document.getElementById("cv-google-analytics")) location.reload();
    }
    panel.hidden = true;
    settings.focus();
  });
  document.body.append(panel, settings);
  if (ignored || consent === "refused") clearCookies();
  if (consent === "accepted") startAnalytics();
})();
