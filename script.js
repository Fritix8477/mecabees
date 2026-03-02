const revealItems = document.querySelectorAll(".section, .hero, .site-footer");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");
const contactForm = document.querySelector(".contact-form");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => {
  item.classList.add("reveal");
  observer.observe(item);
});

if (navToggle && nav) {
  const closeNav = () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 840) {
      closeNav();
    }
  });
}

if (lightbox && lightboxImage && lightboxClose) {
  const openLightbox = (src, alt) => {
    lightboxImage.src = src;
    lightboxImage.alt = alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
  };

  document.querySelectorAll(".gallery-button").forEach((button) => {
    button.addEventListener("click", () => {
      const img = button.querySelector("img");
      const fullSrc = button.getAttribute("data-full");
      openLightbox(fullSrc, img ? img.alt : "");
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}

if (contactForm) {
  const statusMessage = contactForm.querySelector(".form-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    if (statusMessage) {
      statusMessage.textContent = "Envoi en cours...";
      statusMessage.classList.remove("is-success", "is-error");
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      contactForm.reset();

      if (statusMessage) {
        statusMessage.textContent = "Votre demande a ete envoyee, nous vous recontacterons par mail bientot.";
        statusMessage.classList.add("is-success");
      }
    } catch (error) {
      if (statusMessage) {
        statusMessage.textContent = "L'envoi a echoue. Merci de reessayer dans un instant.";
        statusMessage.classList.add("is-error");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
