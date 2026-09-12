const conversations = [
    {
        id: "maya-chen", name: "Maya Chen", initials: "MC", color: "#9b6f55", time: "09:42", unread: 2,
        detail: "Guest · Chatling", messages: [
            { from: "customer", text: "Hi! Do you have a table for two tonight?", time: "09:35" },
            { from: "admin", text: "Hello Maya, I can help with that. What time would you prefer?", time: "09:38" },
            { from: "customer", text: "Around 8:30 would be perfect.", time: "09:42" }
        ]
    },
    {
        id: "daniel-wong", name: "Daniel Wong", initials: "DW", color: "#537d87", time: "Yesterday", unread: 0,
        detail: "Guest · Chatling", messages: [
            { from: "customer", text: "Is the chef's tasting menu available this weekend?", time: "Yesterday" },
            { from: "admin", text: "Yes, Daniel. We serve it Friday through Sunday from 6pm.", time: "Yesterday" }
        ]
    },
    {
        id: "sophia-reed", name: "Sophia Reed", initials: "SR", color: "#886b91", time: "Mon", unread: 1,
        detail: "Guest · Chatling", messages: [
            { from: "customer", text: "Can I change my reservation from 4 to 6 guests?", time: "Mon" }
        ]
    },
    {
        id: "omar-hassan", name: "Omar Hassan", initials: "OH", color: "#7b8151", time: "Sun", unread: 0,
        detail: "Guest · Chatling", messages: [
            { from: "customer", text: "Thank you for the recommendation. The brisket was excellent!", time: "Sun" },
            { from: "admin", text: "We are delighted you enjoyed it, Omar.", time: "Sun" }
        ]
    }
];

let selectedConversationId = null;
let activeFilter = "all";

const listElement = document.getElementById("conversationList");
const workspaceElement = document.getElementById("chatWorkspace");
const panelElement = document.getElementById("chatPanel");

function renderConversationList() {
    const query = document.getElementById("conversationSearch").value.trim().toLowerCase();
    const visibleConversations = conversations.filter((conversation) => {
        const matchesSearch = `${conversation.name} ${conversation.messages.at(-1)?.text || ""}`.toLowerCase().includes(query);
        const matchesFilter = activeFilter === "all" || conversation.unread > 0;
        return matchesSearch && matchesFilter;
    });

    listElement.innerHTML = visibleConversations.length
        ? visibleConversations.map((conversation) => {
            const lastMessage = conversation.messages.at(-1);
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
    panelElement.innerHTML = `<div class="chat-header"><div class="chat-contact"><button class="back-to-inbox" id="backToInbox" aria-label="Back to inbox"><i class="bi bi-arrow-left"></i></button><span class="conversation-avatar chat-avatar" style="--avatar-color: ${conversation.color}">${conversation.initials}</span><div><h3>${conversation.name}</h3><p>${conversation.detail}</p></div></div><div class="chat-actions"><button title="Start call"><i class="bi bi-telephone"></i></button><button title="More options"><i class="bi bi-three-dots-vertical"></i></button></div></div><div class="chat-history" id="chatHistory">${conversation.messages.map(renderMessage).join("")}</div><form class="reply-box" id="replyForm"><textarea id="replyInput" rows="1" placeholder="Write a reply..." aria-label="Write a reply"></textarea><button class="send-button" type="submit" aria-label="Send reply"><i class="bi bi-send-fill"></i></button></form>`;
    document.getElementById("backToInbox")?.addEventListener("click", () => workspaceElement.classList.remove("show-chat"));
    document.getElementById("replyForm").addEventListener("submit", sendReply);
    workspaceElement.classList.add("show-chat");
    renderConversationList();
    document.getElementById("chatHistory").scrollTop = document.getElementById("chatHistory").scrollHeight;
}

function renderMessage(message) {
    return `<div class="message-bubble ${message.from}">${message.text}<time>${message.time}</time></div>`;
}

function sendReply(event) {
    event.preventDefault();
    const input = document.getElementById("replyInput");
    const text = input.value.trim();
    const conversation = conversations.find((item) => item.id === selectedConversationId);
    if (!text || !conversation) return;
    conversation.messages.push({ from: "admin", text, time: "Now" });
    conversation.time = "Now";
    input.value = "";
    selectConversation(conversation.id);
}

document.addEventListener("DOMContentLoaded", () => {
    renderConversationList();
    document.getElementById("conversationSearch").addEventListener("input", renderConversationList);
    document.querySelectorAll(".filter-button").forEach((button) => button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        document.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
        renderConversationList();
    }));
});
