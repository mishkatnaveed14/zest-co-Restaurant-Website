import { auth, db } from "../../firebase.config.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const profileFields = {
  name: document.getElementById("profileName"),
  email: document.getElementById("profileEmail"),
  role: document.getElementById("profileRole"),
  uid: document.getElementById("profileUid"),
  joined: document.getElementById("profileJoined"),
};
const profileAvatar = document.getElementById("profileAvatar");
const profileIdentityName = document.getElementById("profileIdentityName");
const profileIdentityRole = document.getElementById("profileIdentityRole");

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "AD";
}

function formatDate(value) {
  if (!value) return "Not available";
  const date = value.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function renderProfile(user, data = {}) {
  const name = data.name || user.displayName || user.email?.split("@")[0] || "Administrator";
  const role = data.role || "admin";
  const values = {
    name,
    email: data.email || user.email || "Not available",
    role,
    uid: user.uid,
    joined: formatDate(data.timestamp || user.metadata?.creationTime),
  };

  Object.entries(values).forEach(([key, value]) => {
    if (profileFields[key]) profileFields[key].textContent = value;
  });
  profileIdentityName.textContent = values.name;
  profileIdentityRole.textContent = values.role;
  profileAvatar.textContent = getInitials(values.name);
  if (user.photoURL) {
    profileAvatar.innerHTML = `<img src="${user.photoURL}" alt="${values.name} profile photo">`;
  }
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.assign("../../../index.html");
    return;
  }

  try {
    const profileSnapshot = await getDoc(doc(db, "users", user.uid));
    renderProfile(user, profileSnapshot.exists() ? profileSnapshot.data() : {});
  } catch (error) {
    console.error("Unable to load admin profile:", error);
    renderProfile(user);
  }
});
