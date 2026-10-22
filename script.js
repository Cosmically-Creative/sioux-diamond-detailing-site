"use strict";

// Page transitions
const pageTransition = document.querySelector(".page-transition");

if (pageTransition) {
  // Fade out overlay to reveal page
  requestAnimationFrame(() => {
    pageTransition.classList.add("fade-out");
  });

  // Intercept internal link clicks
  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("http") &&
      !href.startsWith("mailto") &&
      !href.startsWith("tel")
    ) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        pageTransition.classList.remove("fade-out");
        pageTransition.addEventListener(
          "transitionend",
          () => {
            window.location.href = href;
          },
          { once: true },
        );
      });
    }
  });
}

// Navbar scroll overlay
const navEl = document.querySelector(".nav");

if (navEl) {
  const onScroll = () => {
    navEl.classList.toggle(
      "scrolled",
      window.scrollY > window.innerHeight * 0.2,
    );
  };
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Mobile navigation
const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
  if (!headerEl.classList.contains("nav-open")) {
    document
      .querySelectorAll(".nav-item")
      .forEach((item) => item.classList.remove("dropdown-open"));
  }
});

const navLinks = document.querySelectorAll(".main-nav-link");

navLinks.forEach((link) => {
  link.addEventListener(
    "click",
    (e) => {
      const navItem = link.closest(".nav-item");
      if (navItem && window.getComputedStyle(btnNavEl).display !== "none") {
        e.preventDefault();
        e.stopImmediatePropagation();
        navItem.classList.toggle("dropdown-open");
      } else {
        headerEl.classList.remove("nav-open");
      }
    },
    { capture: true },
  );
});

// Scroll Animations
document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = { root: null, rootMargin: "0px", threshold: 0.4 };
  const onIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  };
  const observer = new IntersectionObserver(onIntersection, observerOptions);
  const elementsToAnimate = document.querySelectorAll(
    ".animate-on-scroll, .animate-on-scroll-delay",
  );
  elementsToAnimate.forEach((el) => observer.observe(el));
});

// Slider Animation
document.querySelectorAll(".slider-container").forEach((sliderContainer) => {
  const containers = sliderContainer.querySelectorAll(".container");
  const sliders = sliderContainer.querySelectorAll(".slider");

  sliders.forEach((slider, index) => {
    const container = containers[index];

    slider.addEventListener("input", (e) => {
      container.style.setProperty("--position", `${e.target.value}%`);
    });
  });
});

// Car Animation
document.addEventListener("DOMContentLoaded", () => {
  const car = document.querySelector(".animated-car");
  if (!car) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        car.classList.add("is-active");
        observer.disconnect(); // run once
      }
    },
    {
      threshold: 0.3,
    },
  );

  observer.observe(car);
});

// Dirtiness Slider
document.querySelectorAll(".weight").forEach((weight) => {
  const input = weight.querySelector("input[type='range']");
  const val = weight.querySelector(".weight-val");
  input.addEventListener("input", () => {
    val.textContent = input.value;
  });
});

// Gallery Animation
const galleries = document.querySelectorAll(".gallery");

galleries.forEach((gallery) => {
  let startScroll = 0;
  let isActive = false;

  const direction = gallery.classList.contains("gallery--left")
    ? -1 // moves left
    : 1; // moves right

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        startScroll = window.scrollY;
        isActive = true;
      } else {
        isActive = false;
      }
    },
    { threshold: 0.1 },
  );

  observer.observe(gallery);

  window.addEventListener("scroll", () => {
    if (!isActive) return;
    if (window.matchMedia("(max-width: 37.5em)").matches) return;

    const scrollDistance = window.scrollY - startScroll;
    const speed = 0.2;

    gallery.style.transform = `translateX(${
      scrollDistance * speed * direction
    }px)`;
  });
});

// Giveaway closes at the end of November 1, 2026 (Central Time).
const GIVEAWAY_CLOSE = new Date("2026-11-02T06:00:00Z");

function updateGiveawayTimers() {
  const timers = document.querySelectorAll("[data-giveaway-timer]");
  if (!timers.length) return;

  const remaining = GIVEAWAY_CLOSE.getTime() - Date.now();
  const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const closed = remaining <= 0;

  timers.forEach((timer) => {
    const units = timer.querySelector(
      ".giveaway-timer-units, .giveaway-countdown-units",
    );
    const closedMessage = timer.querySelector(".giveaway-timer-closed");

    if (closed) {
      timer.classList.add("is-closed");
      if (units) units.hidden = true;
      if (closedMessage) closedMessage.hidden = false;
      timer.setAttribute("aria-label", "Giveaway closed");
      return;
    }

    const daysEl = timer.querySelector("[data-days]");
    const hoursEl = timer.querySelector("[data-hours]");
    const minutesEl = timer.querySelector("[data-minutes]");
    const secondsEl = timer.querySelector("[data-seconds]");
    if (daysEl) daysEl.textContent = String(days);
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
    timer.setAttribute(
      "aria-label",
      `${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds remaining`,
    );
  });
}

updateGiveawayTimers();
setInterval(updateGiveawayTimers, 1000);
