import { auth, db } from "../firebase.config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
	addDoc,
	collection,
	serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const reservationForm = document.getElementById("reservationForm");
const reservationNotice = document.getElementById("reservationNotice");
let currentUser = null;

function showReservationMessage(message, type) {
	if (!reservationNotice) return;
	reservationNotice.textContent = message;
	reservationNotice.className = `reservation-notice ${type}`;
}

function formatLocalDateTime(date) {
	const pad = (value) => String(value).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

onAuthStateChanged(auth, (user) => {
	currentUser = user;
});

reservationForm?.addEventListener("submit", async (event) => {
	event.preventDefault();

	if (!currentUser) {
		showReservationMessage("Please log in or sign up before booking a table.", "error");
		return;
	}

	const name = document.getElementById("reservationName").value.trim();
	const email = document.getElementById("reservationEmail").value.trim();
	const phone = document.getElementById("reservationPhone").value.trim();
	const guests = document.getElementById("reservationGuests").value;
	const date = document.getElementById("reservation-date").value;
	const time = document.getElementById("reservationTime").value;
	const submitButton = reservationForm.querySelector("button[type='submit']");

	const start = `${date}T${time}`;
	const endDate = new Date(`${start}:00`);
	endDate.setHours(endDate.getHours() + 2);

	submitButton.disabled = true;
	showReservationMessage("Booking your table...", "pending");

	try {
		await addDoc(collection(db, "calendar_events"), {
			title: `Table for ${guests} - ${name}`,
			type: "Reservation",
			start,
			end: formatLocalDateTime(endDate),
			notes: `Guest: ${name}; Email: ${email}; Phone: ${phone}; Guests: ${guests}`,
			customerId: currentUser.uid,
			customerEmail: currentUser.email || email,
			createdAt: serverTimestamp(),
		});

		reservationForm.reset();
		showReservationMessage("Your table has been booked successfully.", "success");
	} catch (error) {
		console.error("Unable to save reservation to Firebase:", error);
		showReservationMessage("Your table could not be booked. Please try again.", "error");
	} finally {
		submitButton.disabled = false;
	}
});
