// ===== STICKY NAVBAR SHRINK ON SCROLL (every page) =====
(function initStickyNavbar() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// ===== AUTO BACK-TO-TOP BUTTON (every page) =====
(function initBackToTop() {
  if (document.querySelector(".zest-back-top")) return;

  const btn = document.createElement("button");
  btn.className = "zest-back-top";
  btn.id = "zestBackTop";
  btn.type = "button";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  document.body.appendChild(btn);

  const onScroll = () => {
    btn.classList.toggle("show", window.scrollY > 300);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

// ===== GLOBAL GOLDEN GLOW CURSOR (every page) =====
(function initGlobalCursorGlow() {
  // Skip if it already exists (e.g. pages that manually include one)
  if (document.getElementById("cursorGlow")) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.id = "cursorGlow";
  document.body.appendChild(glow);

  let visible = false;
  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
    if (!visible) {
      glow.classList.add("visible");
      visible = true;
    }
  });
  document.addEventListener("mouseleave", () => {
    glow.classList.remove("visible");
    visible = false;
  });
})();

// ===== MOBILE MENU =====
function openMobileMenu() {
  document.querySelector(".mobile-nav-toggle")?.classList.add("active");
  document.getElementById("mobileMenuPanel")?.classList.add("open");
  document.getElementById("mobileMenuOverlay")?.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  document.querySelector(".mobile-nav-toggle")?.classList.remove("active");
  document.getElementById("mobileMenuPanel")?.classList.remove("open");
  document.getElementById("mobileMenuOverlay")?.classList.remove("show");
  document.body.style.overflow = "";
}

document
  .querySelector(".mobile-nav-toggle")
  ?.addEventListener("click", openMobileMenu);
document
  .querySelector(".mobile-close")
  ?.addEventListener("click", closeMobileMenu);
document
  .getElementById("mobileMenuOverlay")
  ?.addEventListener("click", closeMobileMenu);
// Close the mobile menu when clicking a real navigation link,
// but NOT the dropdown toggle (so the PAGES submenu can open).
document
  .querySelectorAll(".mobile-nav-links a:not(.dropdown-toggle)")
  .forEach((a) => a.addEventListener("click", closeMobileMenu));

// ===== MOBILE MENU DROPDOWN (PAGES) =====
document
  .querySelectorAll(".mobile-nav-links .dropdown-toggle")
  .forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const menu = toggle.parentElement.querySelector(".dropdown-menu");
      if (!menu) return;
      const isOpen = menu.classList.contains("show");
      // Close any other open dropdowns in the mobile menu
      document
        .querySelectorAll(".mobile-nav-links .dropdown-menu.show")
        .forEach((m) => {
          if (m !== menu) m.classList.remove("show");
        });
      document
        .querySelectorAll(".mobile-nav-links .dropdown-toggle.show")
        .forEach((t) => {
          if (t !== toggle) t.classList.remove("show");
        });
      menu.classList.toggle("show", !isOpen);
      toggle.classList.toggle("show", !isOpen);
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });
  });

// ===== AUTH MODAL (LOGIN / SIGNUP) =====
const authModal = document.getElementById("authModal");

function openAuthModal(tab) {
  if (!authModal) return;
  authModal.classList.add("open");
  authModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.body.style.marginRight = `${getScrollbarWidth()}px`;
  if (tab) switchAuthTab(tab);
}

function closeAuthModal() {
  if (!authModal) return;
  authModal.classList.remove("open");
  authModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.body.style.marginRight = "";
}

function getScrollbarWidth() {
  const w = window.innerWidth - document.documentElement.clientWidth;
  return w > 0 ? w : 0;
}

function switchAuthTab(tab) {
  if (!authModal) return;
  const tabs = authModal.querySelectorAll(".auth-tab");
  const forms = authModal.querySelectorAll(".auth-form");
  const target = tab === "signup" ? "signup" : "login";

  tabs.forEach((t) =>
    t.classList.toggle("active", t.dataset.authTab === target),
  );
  forms.forEach((f) =>
    f.classList.toggle("active", f.dataset.authForm === target),
  );
}

// Openers: [data-auth-open]
document.querySelectorAll("[data-auth-open]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    openAuthModal(el.dataset.authOpen);
  });
});

// Tab switching
authModal?.querySelectorAll("[data-auth-tab]").forEach((tab) => {
  tab.addEventListener("click", () => switchAuthTab(tab.dataset.authTab));
});

// Switch links inside forms
authModal?.querySelectorAll("[data-auth-switch]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    switchAuthTab(link.dataset.authSwitch);
  });
});

// Close: overlay, close button, Escape key
authModal?.querySelectorAll("[data-auth-close]").forEach((el) => {
  el.addEventListener("click", closeAuthModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAuthModal();
});

// Toggle password visibility
authModal?.querySelectorAll("[data-auth-eye]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = btn.parentElement.querySelector("input");
    const icon = btn.querySelector("i");
    if (!input) return;
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    icon.className = isPassword ? "bi bi-eye-slash" : "bi bi-eye";
  });
});

// Prevent closing when clicking inside the modal box
authModal?.addEventListener("click", (e) => {
  if (e.target === authModal) closeAuthModal();
});
authModal
  ?.querySelector(".auth-modal-box")
  ?.addEventListener("click", (e) => e.stopPropagation());

// Form submit placeholder
authModal?.querySelectorAll(".auth-form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });
});

// ---------firebase authentication working start ---------------
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // goo  gle authentication
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
} from "../firebase.config.js";
// sign up form autnentication
const email = document.getElementById("signupEmail");
const password = document.getElementById("signupPassword");
const signupForm = document.getElementById("authSignupForm");

const signup = async (e) => {
  e.preventDefault();

  if (!email || !password || !signupForm) return;
  if (!email.value || !password.value) {
    alert("All fields are required!");
    return;
  }

  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value,
    );
    const user = credential.user;
    console.log("User created successfully:", user);
    if (!credential.user.emailVerified) {
      signOut(auth);
      await sendEmailVerification(auth.currentUser);
      alert("Please verify your Email!");
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  }
};

signupForm?.addEventListener("submit", signup);

// sign in form autnentication
const signinEmail = document.getElementById("loginEmail");
const signinPassword = document.getElementById("loginPassword");
const signinForm = document.getElementById("authLoginForm");

const signin = async (e) => {
  e.preventDefault();
  if (!signinEmail || !signinPassword || !signinForm) return;
  if (!signinEmail.value || !signinPassword.value) {
    alert("All fields are required!");
    return;
  }
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      signinEmail.value,
      signinPassword.value,
    );
    const user = credential.user;
    console.log("User signed in successfully:", user);
    if (!credential.user.emailVerified) {
      signOut(auth);
      await sendEmailVerification(auth.currentUser);
      alert("Please verify your Email!");
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  }
};

signinForm?.addEventListener("submit", signin);

// google authentication
const googleButtons = document.querySelectorAll(".google");
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      console.log("Google sign-in successful:", result.user);
      const redirectTo = new URL("/", window.location.origin);
      window.location.assign(redirectTo.href);
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(errorCode, errorMessage, email, credential);

    if (errorCode === "auth/unauthorized-domain") {
      alert(
        "This domain is not authorized in Firebase. Please add localhost or 127.0.0.1 in Firebase Authentication > Settings > Authorized domains.",
      );
    }
  }
};

const google = async (e) => {
  e.preventDefault();
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  }
};

googleButtons.forEach((btn) => btn.addEventListener("click", google));
handleGoogleRedirectResult();
// //////////////////////////// Signout

const _singOut = () => {
  signOut(auth);
};

document.getElementById("logout")?.addEventListener("click", _singOut);

// -------- firebase authentication working end-------------------
