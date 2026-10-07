const PUBLIC_FILES = new Set([
  "/index.html",
  "/love-blueprint.html",
  "/mentions-legales.html",
  "/politique-confidentialite.html",
  "/styles.css",
  "/script.js",
  "/favicon.svg",
]);

export default {
  fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      url.pathname = "/index.html";
      return env.ASSETS.fetch(new Request(url, request));
    }

    if (url.pathname === "/love-blueprint") {
      url.pathname = "/love-blueprint.html";
      return env.ASSETS.fetch(new Request(url, request));
    }

    if (url.pathname === "/mentions-legales") {
      url.pathname = "/mentions-legales.html";
      return env.ASSETS.fetch(new Request(url, request));
    }

    if (url.pathname === "/politique-confidentialite") {
      url.pathname = "/politique-confidentialite.html";
      return env.ASSETS.fetch(new Request(url, request));
    }

    if (!PUBLIC_FILES.has(url.pathname) && !url.pathname.startsWith("/assets/")) {
      return new Response("Not found", { status: 404 });
    }

    return env.ASSETS.fetch(request);
  },
};
