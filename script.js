const WEBHOOK_URL = "https://automate.carolineverdier.com/webhook/love-blueprint-waitlist";

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
  };
}

function buildPayload(form) {
  const formData = new FormData(form);
  return {
    prenom: String(formData.get("prenom") || "").trim(),
    email: String(formData.get("email") || "").trim().toLowerCase(),
    consentement: formData.get("consentement") === "on",
    source: "love-blueprint-waitlist",
    page_url: window.location.href,
    form_location: form.dataset.formLocation || "unknown",
    contact_timeframe: String(formData.get("contact_timeframe") || "").trim(),
    ...getUtmParams(),
  };
}

function setMessage(form, text, isError = false) {
  const message = form.querySelector(".form-message");
  if (!message) return;
  message.textContent = text;
  message.classList.toggle("is-error", isError);
}

async function submitWaitlist(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const originalText = button.textContent;

  setMessage(form, "");
  button.disabled = true;
  button.textContent = "Inscription en cours...";

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildPayload(form)),
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }

    const data = await response.json().catch(() => ({ ok: true }));
    if (data.ok === false) {
      throw new Error(data.message || "L'inscription n'a pas pu être enregistrée.");
    }

    form.reset();
    button.textContent = "Inscription confirmée";
    setMessage(form, "Merci. Tu es bien inscrite sur la liste d'attente Love Blueprint.");
  } catch (error) {
    console.error(error);
    button.disabled = false;
    button.textContent = originalText;
    setMessage(form, "Quelque chose a coincé. Réessaie dans un instant ou écris-moi directement.", true);
  }
}

document.querySelectorAll(".waitlist-form").forEach((form) => {
  form.addEventListener("submit", submitWaitlist);
});

const stepCards = Array.from(document.querySelectorAll(".steps-grid article"));

if (stepCards.length) {
  const revealCards = () => {
    stepCards.forEach((card, index) => {
      window.setTimeout(() => {
        card.classList.add("is-visible");
      }, index * 180);
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          revealCards();
          observer.disconnect();
        }
      },
      { threshold: 0.22 },
    );

    observer.observe(document.querySelector(".steps-grid"));
  } else {
    revealCards();
  }
}
