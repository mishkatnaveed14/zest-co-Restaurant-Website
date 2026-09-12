const STORAGE_KEY = "zestcoChatConversations";

let conversations = [];
let selectedConversationId = null;
let activeFilter = "all";

function getStoredConversations() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(stored) ? stored : [];
    } catch (error) {
        return [];
    }
}

function renderFromStorage() {
    conversations = getStoredConversations();
    renderConversationList();
    if (!selectedConversationId && conversations.length) {
        selectedConversationId = conversations[0].id;
        selectConversation(selectedConversationId);
    }
}

window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
        renderFromStorage();
    }
});

window.addEventListener("zestco-chat-updated", () => {
    renderFromStorage();
});

const listElement = document.getElementById("conversationList");
const workspaceElement = document.getElementById("chatWorkspace");
const panelElement = document.getElementById("chatPanel");

function renderConversationList() {
    const queryTerm = document.getElementById("conversationSearch").value.trim().toLowerCase();
    const visibleConversations = conversations.filter((conversation) => {
        const matchesSearch = `${conversation.name} ${conversation.messages.at(-1)?.text || ""}`.toLowerCase().includes(queryTerm);
        const matchesFilter = activeFilter === "all" || conversation.unread > 0;
        return matchesSearch && matchesFilter;
    });

    listElement.innerHTML = visibleConversations.length
        ? visibleConversations.map((conversation) => {
            const lastMessage = conversation.messages.at(-1) || { text: "No message yet" };
            return `<button class="conversation-item ${conversation.id === selectedConversationId ? "active" : ""}" data-conversation-id="${conversation.id}">
                <span class="conversation-avatar" style="--avatar-color: ${conversation.color}">${conversation.initials}</span>
                <span class="conversation-copy"><span class="conversation-name">${conversation.name}</span><span class="conversation-preview">${lastMessage.text}</span></span>
                <span class="conversation-meta"><span class="conversation-time">${conversation.time}</span>${conversation.unread ? `<span class="unread-count">${conversation.unread}</span>` : ""}</span>
            </button>`;
        }).join("")
        : '<div class="empty-chat"><i class="bi bi-search"></i><p>No conversations found.</p></div>';

    listElement.querySelectorAll("[data-conversation-id]").forEach((button) => {
        button.addEventListener("click", () => selectConversation(button.dataset.conversationId));
    });
}

function selectConversation(conversationId) {
    const conversation = conversations.find((item) => item.id === conversationId);
    if (!conversation) return;
    selectedConversationId = conversationId;
    conversation.unread = 0;
    panelElement.innerHTML = `<div class="chat-header"><div class="chat-contact"><button class="back-to-inbox" id="backToInbox" aria-label="Back to inbox"><i class="bi bi-arrow-left"></i></button><span class="conversation-avatar chat-avatar" style="--avatar-color: ${conversation.color}">${conversation.initials}</span><div><h3>${conversation.name}</h3><p>${conversation.detail}</p></div></div></div><div class="chat-history" id="chatHistory">${conversation.messages.map(renderMessage).join("")}</div>`;
    document.getElementById("backToInbox")?.addEventListener("click", () => workspaceElement.classList.remove("show-chat"));
    workspaceElement.classList.add("show-chat");
    renderConversationList();
    document.getElementById("chatHistory").scrollTop = document.getElementById("chatHistory").scrollHeight;
}

function renderMessage(message) {
    return `<div class="message-bubble ${message.from}">${message.text}<time>${message.time}</time></div>`;
}

window.zestcoDebugSeedConversation = () => {
    const existing = getStoredConversations();
    const newConversation = {
        id: `debug-${Date.now()}`,
        name: "New Guest User",
        initials: "NG",
        color: "#9b6f55",
        email: "guest@example.com",
        detail: "Guest · Chatling",
        unread: 1,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        messages: [
            {
                from: "customer",
                text: "Hi, I would like to know if you have vegan options for dinner.",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
        ],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([newConversation, ...existing]));
    renderFromStorage();
    return true;
};

document.addEventListener("DOMContentLoaded", () => {
    renderFromStorage();
    document.getElementById("conversationSearch").addEventListener("input", renderConversationList);
    document.querySelectorAll(".filter-button").forEach((button) => button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        document.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
        renderConversationList();
    }));
});
