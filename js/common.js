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

function updateNavbarForAuth(user) {
  document
    .querySelectorAll(".navbar-actions [data-auth-open]")
    .forEach((button) => {
      button.hidden = Boolean(user);
    });
  document.querySelectorAll(".chat-with-us").forEach((button) => {
    button.hidden = !user;
  });
}

function openChatlingWidget() {
  const widgetApis = [
    window.chtlWidget,
    window.Chatling,
    window.chatling,
    window.chtl,
  ];
  for (const widgetApi of widgetApis) {
    const openMethod = widgetApi?.open || widgetApi?.openChat;
    if (typeof openMethod === "function") {
      openMethod.call(widgetApi);
      return;
    }
  }

  const launcher = document.querySelector(
    "[data-chatling-widget] button, [data-chatling-widget] [role='button']",
  );
  if (launcher) {
    launcher.click();
    return;
  }

  if (document.getElementById("chtl-script")) {
    window.setTimeout(openChatlingWidget, 300);
  }
}

document.querySelectorAll(".chat-with-us").forEach((button) => {
  button.addEventListener("click", openChatlingWidget);
});

// ===== CHATLING CUSTOMER CHATBOT (only for signed-in users) =====
(function initChatlingWidget() {
  if (window.location.pathname.includes("/admin/")) return;

  const chatbotId = "1425934228";
  const scriptId = "chtl-script";

  const removeChatlingWidget = () => {
    const existingScript = document.getElementById(scriptId);
    if (existingScript) existingScript.remove();

    const existingWidget = document.querySelector("[data-chatling-widget]");
    if (existingWidget) existingWidget.remove();

    const existingIframe = document.querySelector(
      "iframe[title*='chatling' i]",
    );
    if (existingIframe) existingIframe.remove();

    const legacyConfig = document.getElementById("chtl-config");
    if (legacyConfig) legacyConfig.remove();

    delete window.chtlConfig;
  };

  const loadChatlingWidget = () => {
    if (document.getElementById(scriptId)) return;

    const config = document.createElement("script");
    config.id = "chtl-config";
    config.type = "text/javascript";
    config.textContent = `window.chtlConfig = { chatbotId: "${chatbotId}" };`;
    document.head.appendChild(config);

    const script = document.createElement("script");
    script.async = true;
    script.id = scriptId;
    script.type = "text/javascript";
    script.dataset.id = chatbotId;
    script.src = "https://chatling.ai/js/embed.js";
    document.head.appendChild(script);
  };

  onAuthStateChanged(auth, (user) => {
    updateNavbarForAuth(user);
    if (user) {
      loadChatlingWidget();
    } else {
      removeChatlingWidget();
    }
  });
})();

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

// =======================firebase authentication working start========================
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  // google authentication
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
} from "../firebase.config.js";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
// sign up form autnentication
const name = document.getElementById("signupName");
const email = document.getElementById("signupEmail");
const password = document.getElementById("signupPassword");
const signupForm = document.getElementById("authSignupForm");

function saveCurrentUserSession(userData) {
  if (!userData) {
    localStorage.removeItem("zestcoCurrentUser");
    return;
  }

  localStorage.setItem("zestcoCurrentUser", JSON.stringify(userData));
}

window.zestcoAddChatMessage = function ({
  name,
  email,
  text,
  conversationId,
} = {}) {
  if (!text || !String(text).trim()) return false;

  const profile = JSON.parse(
    localStorage.getItem("zestcoCurrentUser") || "null",
  );
  const currentUser = auth?.currentUser;
  const userName =
    name ||
    profile?.name ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "Guest User";
  const userEmail = email || profile?.email || currentUser?.email || "";
  const id =
    conversationId || currentUser?.uid || profile?.uid || `guest-${Date.now()}`;
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const stored = JSON.parse(
    localStorage.getItem("zestcoChatConversations") || "[]",
  );
  const existingIndex = stored.findIndex(
    (conversation) =>
      conversation.id === id ||
      conversation.email === userEmail ||
      conversation.name === userName,
  );

  const newMessage = {
    from: "customer",
    text: String(text).trim(),
    time,
  };

  if (existingIndex >= 0) {
    const existingConversation = stored[existingIndex];
    existingConversation.messages.push(newMessage);
    existingConversation.time = time;
    existingConversation.unread = (existingConversation.unread || 0) + 1;
    stored[existingIndex] = existingConversation;
  } else {
    stored.unshift({
      id,
      name: userName,
      initials:
        userName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0].toUpperCase())
          .join("") || "GU",
      color: ["#9b6f55", "#537d87", "#886b91", "#7b8151"][
        Math.floor(Math.random() * 4)
      ],
      email: userEmail,
      detail: "Guest · Chatling",
      unread: 1,
      time,
      messages: [newMessage],
    });
  }

  localStorage.setItem("zestcoChatConversations", JSON.stringify(stored));
  window.dispatchEvent(
    new CustomEvent("zestco-chat-updated", { detail: stored }),
  );

  try {
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "zestcoChatConversations",
        newValue: JSON.stringify(stored),
      }),
    );
  } catch (error) {
    // StorageEvent is not always constructible in all browsers.
  }

  return true;
};

window.zestcoDebugSaveChat = async ({
  name,
  email,
  text,
  conversationId,
} = {}) => {
  return window.zestcoAddChatMessage({
    name,
    email,
    text,
    conversationId,
  });
};

function saveChatMessageFromUser(message, authorName = "Guest User") {
  if (!message || !String(message).trim()) return;

  const cleanedMessage = String(message).trim();
  const storedProfile = JSON.parse(
    localStorage.getItem("zestcoCurrentUser") || "null",
  );
  const currentName = authorName || storedProfile?.name || "Guest User";
  const currentEmail = storedProfile?.email || "";
  const storageKey = "zestcoChatConversations";
  const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const now = new Date();
  const timeLabel = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const matchingIndex = existing.findIndex((conversation) => {
    const sameName =
      conversation.name &&
      conversation.name.toLowerCase() === currentName.toLowerCase();
    const sameEmail =
      currentEmail &&
      conversation.email &&
      conversation.email.toLowerCase() === currentEmail.toLowerCase();
    return sameName || sameEmail;
  });

  const record = {
    id: matchingIndex >= 0 ? existing[matchingIndex].id : `${Date.now()}`,
    name: currentName,
    email: currentEmail,
    initials:
      currentName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "GU",
    color: ["#9b6f55", "#537d87", "#886b91", "#7b8151"][
      Math.floor(Math.random() * 4)
    ],
    time: timeLabel,
    unread: 1,
    detail: "Guest · Chatling",
    messages: [
      {
        from: "customer",
        text: cleanedMessage,
        time: timeLabel,
      },
    ],
  };

  if (matchingIndex >= 0) {
    const existingConversation = existing[matchingIndex];
    existingConversation.messages.push({
      from: "customer",
      text: cleanedMessage,
      time: timeLabel,
    });
    existingConversation.time = timeLabel;
    existingConversation.unread = (existingConversation.unread || 0) + 1;
    existingConversation.detail = "Guest · Chatling";
    existing[matchingIndex] = existingConversation;
  } else {
    existing.unshift(record);
  }

  localStorage.setItem(storageKey, JSON.stringify(existing));
}

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

    const userName = name?.value.trim() || "Guest User";
    await setDoc(doc(db, "users", user.uid), {
      name: userName,
      email: user.email,
      role: "user",
      timestamp: serverTimestamp(),
    });

    saveCurrentUserSession({
      uid: user.uid,
      name: userName,
      email: user.email,
      role: "user",
    });
    if (!credential.user.emailVerified) {
      await sendEmailVerification(user);
      signOut(auth);
      alert("Please verify your Email!");
    } else {
      closeAuthModal();
      alert("Account created successfully! Welcome to Zest & Co.");
      await redirectByRole(user);
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

const redirectByRole = async (user) => {
  const userDocument = await getDoc(doc(db, "users", user.uid));
  const role = userDocument.exists()
    ? userDocument.data().role?.toLowerCase()
    : "user";
  const destination =
    role === "admin"
      ? "/html/admin/dashboard/dashboard.html"
      : "/html/admin/user/menu.html";
  window.location.assign(destination);
};

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

    const userDocument = await getDoc(doc(db, "users", user.uid));
    const userData = userDocument.exists() ? userDocument.data() : null;

    saveCurrentUserSession({
      uid: user.uid,
      name: userData?.name || user.email?.split("@")[0] || "Guest User",
      email: user.email,
      role: userData?.role || "user",
    });

    if (!credential.user.emailVerified) {
      await sendEmailVerification(user);
      signOut(auth);
      alert("Please verify your Email!");
    } else {
      closeAuthModal();
      alert("Welcome back to Zest & Co.!");
      await redirectByRole(user);
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
      await redirectByRole(result.user);
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

window.addEventListener("message", (event) => {
  const payload = event.data;
  if (!payload || typeof payload !== "object") return;

  const textFromPayload =
    payload.text ||
    payload.message ||
    payload.content ||
    payload.data?.text ||
    payload.data?.message ||
    payload.payload?.text ||
    payload.payload?.message;

  if (!textFromPayload) return;

  const source = payload.source || payload.type || payload.event || "chatling";
  const allowChat =
    String(source).toLowerCase().includes("chatling") ||
    String(textFromPayload).length > 0;

  if (allowChat) {
    const profile = JSON.parse(
      localStorage.getItem("zestcoCurrentUser") || "null",
    );
    const currentUser = auth?.currentUser;
    const userName =
      profile?.name ||
      currentUser?.displayName ||
      currentUser?.email?.split("@")[0] ||
      "Guest User";
    const userEmail = profile?.email || currentUser?.email || "";
    const conversationId =
      currentUser?.uid || profile?.uid || `guest-${Date.now()}`;
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const stored = JSON.parse(
      localStorage.getItem("zestcoChatConversations") || "[]",
    );
    const existingIndex = stored.findIndex(
      (conversation) =>
        conversation.id === conversationId ||
        conversation.email === userEmail ||
        conversation.name === userName,
    );

    const newMessage = {
      from: "customer",
      text: String(textFromPayload).trim(),
      time,
    };

    if (existingIndex >= 0) {
      const existingConversation = stored[existingIndex];
      existingConversation.messages.push(newMessage);
      existingConversation.time = time;
      existingConversation.unread = (existingConversation.unread || 0) + 1;
      stored[existingIndex] = existingConversation;
    } else {
      stored.unshift({
        id: conversationId,
        name: userName,
        initials:
          userName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join("") || "GU",
        color: ["#9b6f55", "#537d87", "#886b91", "#7b8151"][
          Math.floor(Math.random() * 4)
        ],
        email: userEmail,
        detail: "Guest · Chatling",
        unread: 1,
        time,
        messages: [newMessage],
      });
    }

    localStorage.setItem("zestcoChatConversations", JSON.stringify(stored));
    window.dispatchEvent(
      new CustomEvent("zestco-chat-updated", { detail: stored }),
    );
    try {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "zestcoChatConversations",
          newValue: JSON.stringify(stored),
        }),
      );
    } catch (error) {
      // StorageEvent may not be constructible in all browsers; custom event is the fallback.
    }
  }
});

googleButtons.forEach((btn) => btn.addEventListener("click", google));
handleGoogleRedirectResult();
// //////////////////////////// Signout

const _singOut = () => {
  signOut(auth);
};

document.getElementById("logout")?.addEventListener("click", _singOut);

// ================== firebase authentication working end ============================
