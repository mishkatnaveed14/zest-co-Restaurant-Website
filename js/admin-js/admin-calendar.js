import { 
    auth,
    db, 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc 
} from "../../firebase.config.js";



// Fallback Mock Events Array
const mockEvents = [
    {
        id: "EVT-101",
        title: "Table for 6 - Mr. Farhan",
        type: "Reservation",
        start: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
        end: new Date(Date.now() + 10800000).toISOString().slice(0, 16),
        notes: "Anniversary celebration, prefers corner booth."
    },
    {
        id: "EVT-102",
        title: "Evening Chef Shift - Chef Ali",
        type: "Shift",
        start: new Date(Date.now() + 18000000).toISOString().slice(0, 16),
        end: new Date(Date.now() + 46800000).toISOString().slice(0, 16),
        notes: "Main Kitchen duty."
    },
    {
        id: "EVT-103",
        title: "Corporate Birthday Dinner",
        type: "Special",
        start: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        end: new Date(Date.now() + 97200000).toISOString().slice(0, 16),
        notes: "Full hall reservation."
    }
];

// State Variables
let globalEvents = [];
let calendar = null;
const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));

// Color Mapping
function getEventColor(type) {
    switch (type) {
        case 'Reservation': return '#d4af37';
        case 'Shift': return '#0284c7';
        case 'Special': return '#7e22ce';
        case 'Maintenance': return '#dc2626';
        default: return '#6b7280';
    }
}

// Initialize FullCalendar
document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,
        selectable: true,
        select: (info) => {
            openEventModal(null, info.startStr, info.endStr);
        },
        eventClick: (info) => {
            const evt = globalEvents.find(e => e.id === info.event.id);
            if (evt) openEventModal(evt);
        },
        eventDrop: async (info) => {
            await handleEventChange(info.event);
        },
        eventResize: async (info) => {
            await handleEventChange(info.event);
        }
    });

    calendar.render();
    listenToEvents();
    attachFilterListeners();
});

// Sync Firestore Events Realtime
function listenToEvents() {
    const eventsRef = collection(db, "calendar_events");

    onSnapshot(eventsRef, (snapshot) => {
        globalEvents = [];
        snapshot.forEach((docSnap) => {
            globalEvents.push({
                id: docSnap.id,
                ...docSnap.data()
            });
        });

        if (globalEvents.length === 0) {
            globalEvents = [...mockEvents];
        }

        renderCalendarEvents();
        updateUpcomingList();
    }, (error) => {
        console.warn("Firestore offline/empty. Rendering mock events.", error);
        globalEvents = [...mockEvents];
        renderCalendarEvents();
        updateUpcomingList();
    });
}

// Render Events on FullCalendar with Filter Check
function renderCalendarEvents() {
    if (!calendar) return;

    calendar.removeAllEvents();

    const selectedTypes = Array.from(document.querySelectorAll('.filter-check:checked')).map(c => c.value);

    const filtered = globalEvents.filter(evt => selectedTypes.includes(evt.type));

    filtered.forEach(evt => {
        calendar.addEvent({
            id: evt.id,
            title: evt.title,
            start: evt.start,
            end: evt.end,
            backgroundColor: getEventColor(evt.type),
            borderColor: getEventColor(evt.type)
        });
    });
}

// Render Upcoming Schedule Sidebar List
function updateUpcomingList() {
    const listContainer = document.getElementById('upcomingEventsList');
    if (globalEvents.length === 0) {
        listContainer.innerHTML = `<p class="text-muted small">No scheduled events.</p>`;
        return;
    }

    listContainer.innerHTML = globalEvents.slice(0, 4).map(evt => `
        <div class="upcoming-item" style="border-left-color: ${getEventColor(evt.type)}">
            <h6 class="mb-0 fs-6 fw-semibold">${evt.title}</h6>
            <small class="text-muted d-block">${new Date(evt.start).toLocaleString()}</small>
            <span class="badge bg-light text-dark border mt-1">${evt.type}</span>
        </div>
    `).join('');
}

// Open Event Modal (Create or Edit)
function openEventModal(event = null, defaultStart = '', defaultEnd = '') {
    const form = document.getElementById('eventForm');
    form.reset();

    const deleteBtn = document.getElementById('deleteEventBtn');

    if (event) {
        document.getElementById('eventModalTitle').textContent = "Edit Event";
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventType').value = event.type;
        document.getElementById('eventStart').value = event.start.slice(0, 16);
        document.getElementById('eventEnd').value = event.end ? event.end.slice(0, 16) : event.start.slice(0, 16);
        document.getElementById('eventNotes').value = event.notes || '';
        deleteBtn.classList.remove('d-none');
    } else {
        document.getElementById('eventModalTitle').textContent = "Add New Event";
        document.getElementById('eventId').value = "";
        if (defaultStart) document.getElementById('eventStart').value = defaultStart.slice(0, 16);
        if (defaultEnd) document.getElementById('eventEnd').value = defaultEnd.slice(0, 16);
        deleteBtn.classList.add('d-none');
    }

    eventModal.show();
}

// Trigger New Event Modal from Header Button
document.getElementById('createEventBtn').addEventListener('click', () => openEventModal());

// Form Submit Handler (Add / Update)
document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('eventId').value;
    const eventData = {
        title: document.getElementById('eventTitle').value,
        type: document.getElementById('eventType').value,
        start: document.getElementById('eventStart').value,
        end: document.getElementById('eventEnd').value,
        notes: document.getElementById('eventNotes').value
    };

    if (id) {
        // Update Local
        const idx = globalEvents.findIndex(e => e.id === id);
        if (idx !== -1) globalEvents[idx] = { id, ...eventData };

        try {
            await updateDoc(doc(db, "calendar_events", id), eventData);
        } catch (err) { console.log("Updated locally in mock state."); }
    } else {
        // Create Local
        const newId = "EVT-" + Date.now();
        globalEvents.push({ id: newId, ...eventData });

        try {
            await addDoc(collection(db, "calendar_events"), eventData);
        } catch (err) { console.log("Added locally in mock state."); }
    }

    renderCalendarEvents();
    updateUpcomingList();
    eventModal.hide();
});

// Delete Event Handler
document.getElementById('deleteEventBtn').addEventListener('click', async () => {
    const id = document.getElementById('eventId').value;
    if (!id) return;

    if (confirm("Are you sure you want to delete this event?")) {
        globalEvents = globalEvents.filter(e => e.id !== id);

        try {
            await deleteDoc(doc(db, "calendar_events", id));
        } catch (err) { console.log("Deleted locally from mock state."); }

        renderCalendarEvents();
        updateUpcomingList();
        eventModal.hide();
    }
});

// Drag & Drop Date Change Handler
async function handleEventChange(fcEvent) {
    const id = fcEvent.id;
    const updatedStart = fcEvent.start.toISOString();
    const updatedEnd = fcEvent.end ? fcEvent.end.toISOString() : updatedStart;

    const idx = globalEvents.findIndex(e => e.id === id);
    if (idx !== -1) {
        globalEvents[idx].start = updatedStart;
        globalEvents[idx].end = updatedEnd;
    }

    try {
        await updateDoc(doc(db, "calendar_events", id), {
            start: updatedStart,
            end: updatedEnd
        });
    } catch (err) { console.log("Drag-updated locally."); }
}

// Category Checkbox Filters
function attachFilterListeners() {
    document.querySelectorAll('.filter-check').forEach(chk => {
        chk.addEventListener('change', renderCalendarEvents);
    });
}