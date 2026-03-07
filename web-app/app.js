const API_BASE = "/api";
const API_PROXY_TARGET =
  "http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com/api";
const REQUEST_TIMEOUT_MS = 30000;
const CLIENT_ID = "4449615d-b5b2-4e16-a059-f6bda4486953";
const CLIENT_SECRET = "81ed3948-6ca5-4936-be0b-5db9aec1107b";

const STORAGE_KEYS = {
  username: "apptorney.username",
  accessToken: "apptorney.accessToken"
};

const INITIAL_ASSISTANT_MESSAGE =
  "Ask anything about Zambian case law or legislation to get started.";

console.info("Apptorney AI build 20260215-7", {
  apiBase: API_BASE,
  proxyTarget: API_PROXY_TARGET,
  timeoutMs: REQUEST_TIMEOUT_MS
});

const state = {
  view: "chat",
  sidebarOpen: false,
  currentThreadId: null,
  threads: [],
  messages: [{ role: "assistant", text: INITIAL_ASSISTANT_MESSAGE, references: [] }],
  awaitingResponse: false,
  streaming: {
    timer: null,
    messageIndex: null,
    characters: [],
    cursor: 0,
    references: []
  },
  search: {
    casesTerm: "",
    legislationsTerm: "",
    casesDebounce: null,
    legislationsDebounce: null
  },
  resources: {
    cases: [],
    legislations: []
  },
  home: {
    bookmarks: [],
    news: [],
    trends: []
  },
  activeDetail: null,
  username: "",
  accessToken: ""
};

const el = {
  body: document.body,
  navButtons: Array.from(document.querySelectorAll(".nav-btn")),
  views: {
    chat: document.getElementById("chatView"),
    home: document.getElementById("homeView"),
    cases: document.getElementById("casesView"),
    legislations: document.getElementById("legislationsView"),
    settings: document.getElementById("settingsView")
  },
  viewTitle: document.getElementById("viewTitle"),
  viewKicker: document.getElementById("viewKicker"),
  toggleSidebarBtn: document.getElementById("toggleSidebarBtn"),
  newChatBtn: document.getElementById("newChatBtn"),
  refreshThreadsBtn: document.getElementById("refreshThreadsBtn"),
  threadList: document.getElementById("threadList"),
  chatMessages: document.getElementById("chatMessages"),
  chatForm: document.getElementById("chatForm"),
  chatInput: document.getElementById("chatInput"),
  sendBtn: document.getElementById("sendBtn"),
  chips: Array.from(document.querySelectorAll(".chip")),
  caseSearchInput: document.getElementById("caseSearchInput"),
  caseResults: document.getElementById("caseResults"),
  legislationSearchInput: document.getElementById("legislationSearchInput"),
  legislationResults: document.getElementById("legislationResults"),
  bookmarksList: document.getElementById("bookmarksList"),
  newsList: document.getElementById("newsList"),
  trendsList: document.getElementById("trendsList"),
  reloadBookmarksBtn: document.getElementById("reloadBookmarksBtn"),
  reloadNewsBtn: document.getElementById("reloadNewsBtn"),
  reloadTrendsBtn: document.getElementById("reloadTrendsBtn"),
  usernameInput: document.getElementById("usernameInput"),
  tokenInput: document.getElementById("tokenInput"),
  loginUsernameInput: document.getElementById("loginUsernameInput"),
  loginPasswordInput: document.getElementById("loginPasswordInput"),
  saveSessionBtn: document.getElementById("saveSessionBtn"),
  loginBtn: document.getElementById("loginBtn"),
  statusText: document.getElementById("statusText"),
  detailDrawer: document.getElementById("detailDrawer"),
  detailType: document.getElementById("detailType"),
  detailTitle: document.getElementById("detailTitle"),
  detailMeta: document.getElementById("detailMeta"),
  detailBody: document.getElementById("detailBody"),
  closeDetailBtn: document.getElementById("closeDetailBtn"),
  bookmarkBtn: document.getElementById("bookmarkBtn"),
  feedbackInput: document.getElementById("feedbackInput"),
  feedbackBtn: document.getElementById("feedbackBtn")
};

function init() {
  hydrateSession();
  bindEvents();
  renderView();
  renderThreads();
  renderChat();
  renderCases();
  renderLegislations();
  renderHomeLists();
  renderDetailDrawer();
  checkProxyHealth();

  fetchChatThreads();
  loadHomeData();
}

async function checkProxyHealth() {
  try {
    const response = await fetch("/health", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`health ${response.status}`);
    }
  } catch {
    setStatus(
      "Local proxy not detected. Start with `node server.mjs` (not python http.server).",
      "error"
    );
  }
}

function bindEvents() {
  el.navButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  el.toggleSidebarBtn.addEventListener("click", () => {
    state.sidebarOpen = !state.sidebarOpen;
    el.body.classList.toggle("sidebar-open", state.sidebarOpen);
  });

  el.newChatBtn.addEventListener("click", startNewChat);
  el.refreshThreadsBtn.addEventListener("click", fetchChatThreads);

  el.chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await sendMessage();
  });

  el.chatInput.addEventListener("input", () => {
    autoResize(el.chatInput, 110);
  });

  el.chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      el.chatInput.value = chip.dataset.prompt || "";
      autoResize(el.chatInput, 110);
      el.chatInput.focus();
    });
  });

  el.chatMessages.addEventListener("click", (event) => {
    const refButton = event.target.closest("[data-ref-source]");
    if (!refButton) {
      return;
    }
    const source = refButton.dataset.refSource;
    const reference = findReferenceBySource(source);
    if (reference) {
      openResourceFromReference(reference);
    }
  });

  el.threadList.addEventListener("click", (event) => {
    const target = event.target.closest("[data-thread-id]");
    if (!target) {
      return;
    }
    const threadId = target.dataset.threadId;
    if (threadId) {
      loadThread(threadId);
    }
  });

  el.caseSearchInput.addEventListener("input", () => {
    state.search.casesTerm = el.caseSearchInput.value.trim();
    window.clearTimeout(state.search.casesDebounce);
    state.search.casesDebounce = window.setTimeout(() => {
      searchCases(state.search.casesTerm);
    }, 350);
  });

  el.legislationSearchInput.addEventListener("input", () => {
    state.search.legislationsTerm = el.legislationSearchInput.value.trim();
    window.clearTimeout(state.search.legislationsDebounce);
    state.search.legislationsDebounce = window.setTimeout(() => {
      searchLegislations(state.search.legislationsTerm);
    }, 350);
  });

  el.caseResults.addEventListener("click", (event) => {
    const result = event.target.closest("[data-case-id]");
    if (!result) {
      return;
    }
    openCaseDetail(result.dataset.caseId);
  });

  el.legislationResults.addEventListener("click", (event) => {
    const result = event.target.closest("[data-legislation-id]");
    if (!result) {
      return;
    }
    openLegislationDetail(result.dataset.legislationId);
  });

  el.bookmarksList.addEventListener("click", (event) => {
    const item = event.target.closest("[data-bookmark-type]");
    if (!item) {
      return;
    }
    const type = item.dataset.bookmarkType;
    const sourceId = item.dataset.bookmarkId;
    if (type === "case") {
      openCaseDetail(sourceId);
      return;
    }
    if (type === "legislation") {
      openLegislationDetail(sourceId);
    }
  });

  el.reloadBookmarksBtn.addEventListener("click", loadBookmarks);
  el.reloadNewsBtn.addEventListener("click", loadNews);
  el.reloadTrendsBtn.addEventListener("click", loadTrends);

  el.saveSessionBtn.addEventListener("click", () => {
    state.username = el.usernameInput.value.trim();
    state.accessToken = el.tokenInput.value.trim();
    persistSession();
    setStatus("Session saved.");
    fetchChatThreads();
    loadBookmarks();
  });

  el.loginBtn.addEventListener("click", login);

  el.closeDetailBtn.addEventListener("click", () => {
    state.activeDetail = null;
    renderDetailDrawer();
  });

  el.bookmarkBtn.addEventListener("click", addBookmarkFromActiveDetail);
  el.feedbackBtn.addEventListener("click", sendFeedbackForActiveDetail);
}

function hydrateSession() {
  const savedUsername = localStorage.getItem(STORAGE_KEYS.username) || "";
  const savedToken = localStorage.getItem(STORAGE_KEYS.accessToken) || "";
  state.username = savedUsername;
  state.accessToken = savedToken;

  el.usernameInput.value = savedUsername;
  el.tokenInput.value = savedToken;
  el.loginUsernameInput.value = savedUsername;
}

function persistSession() {
  localStorage.setItem(STORAGE_KEYS.username, state.username);
  localStorage.setItem(STORAGE_KEYS.accessToken, state.accessToken);
}

function setView(view) {
  state.view = view;
  renderView();

  if (window.matchMedia("(max-width: 1160px)").matches) {
    state.sidebarOpen = false;
    el.body.classList.remove("sidebar-open");
  }

  if (view === "home") {
    loadHomeData();
  }
}

function renderView() {
  const titleMap = {
    chat: ["Workspace", "Assistant"],
    home: ["Workspace", "Home Feed"],
    cases: ["Library", "Cases"],
    legislations: ["Library", "Legislations"],
    settings: ["Config", "Settings"]
  };
  const [kicker, title] = titleMap[state.view] || ["Workspace", "Assistant"];
  el.viewKicker.textContent = kicker;
  el.viewTitle.textContent = title;

  el.navButtons.forEach((button) => {
    const active = button.dataset.view === state.view;
    button.classList.toggle("is-active", active);
  });

  Object.entries(el.views).forEach(([name, node]) => {
    node.classList.toggle("is-visible", name === state.view);
  });
}

function startNewChat() {
  stopStreaming();
  state.currentThreadId = null;
  state.awaitingResponse = false;
  state.messages = [{ role: "assistant", text: INITIAL_ASSISTANT_MESSAGE, references: [] }];
  el.chatInput.value = "";
  autoResize(el.chatInput, 110);
  renderThreads();
  renderChat();
  setView("chat");
}

async function sendMessage() {
  const prompt = el.chatInput.value.trim();
  if (!prompt || state.awaitingResponse || state.streaming.timer) {
    return;
  }

  if (isOnlyInitialAssistantMessage()) {
    state.messages = [];
  }

  state.messages.push({ role: "user", text: prompt, references: [] });
  state.awaitingResponse = true;
  el.chatInput.value = "";
  autoResize(el.chatInput, 110);
  renderChat();

  const result = await askAI(prompt);

  state.awaitingResponse = false;
  if (result.ok) {
    startStreaming(result.answer, result.references);
  } else {
    state.messages.push({
      role: "assistant",
      text:
        result.userMessage ||
        "Sorry, I could not get a response right now. Please try again.",
      references: []
    });
    setStatus(result.debugMessage || result.message || "Ask AI request failed.", "error");
  }

  renderChat();
}

function isOnlyInitialAssistantMessage() {
  return (
    state.messages.length === 1 &&
    state.messages[0].role === "assistant" &&
    state.messages[0].text === INITIAL_ASSISTANT_MESSAGE
  );
}

async function askAI(prompt) {
  const query = { question: prompt };
  if (state.currentThreadId) {
    query.threadId = state.currentThreadId;
  }
  if (state.accessToken) {
    query.access_token = state.accessToken;
  }

  const payload = { prompt };
  if (state.currentThreadId) {
    payload.threadId = state.currentThreadId;
  }
  if (state.accessToken) {
    payload.access_token = state.accessToken;
  }

  const attempts = [
    { label: "GET question", request: { method: "GET", query } },
    { label: "POST json prompt", request: { method: "POST", body: payload } },
    { label: "POST form prompt", request: { method: "POST", body: payload, asForm: true } }
  ];

  const failures = [];

  for (const attempt of attempts) {
    const response = await apiRequest("/searches/ask-ai", attempt.request);
    if (!response.ok) {
      failures.push(describeFailure(attempt.label, response));
      continue;
    }

    const parsed = parseAskAIResponse(response.data, response.text);
    if (!parsed.answer) {
      failures.push(`${attempt.label}: empty answer payload`);
      continue;
    }

    if (parsed.threadId) {
      state.currentThreadId = parsed.threadId;
      fetchChatThreads();
    }

    return {
      ok: true,
      answer: parsed.answer,
      references: parsed.references
    };
  }

  return buildAskAIFailure(failures);
}

function parseAskAIResponse(data, textFallback) {
  if (typeof data === "string" && data.trim()) {
    return { answer: data.trim(), references: [], threadId: null };
  }

  if (data && typeof data === "object") {
    const top = data;
    const nested = top.data && typeof top.data === "object" ? top.data : null;

    const keys = ["answer", "response", "message", "text", "output"];
    let answer = "";

    for (const key of keys) {
      if (typeof top[key] === "string" && top[key].trim()) {
        answer = top[key].trim();
        break;
      }
    }

    if (!answer && nested) {
      for (const key of keys) {
        if (typeof nested[key] === "string" && nested[key].trim()) {
          answer = nested[key].trim();
          break;
        }
      }
    }

    const sourceDicts = Array.isArray(nested?.sources)
      ? nested.sources
      : Array.isArray(top.sources)
      ? top.sources
      : [];

    const references = sourceDicts
      .map((item) => {
        const source = toCleanString(item.source).toUpperCase();
        const id = toCleanString(item.id);
        const type = toCleanString(item.type).toLowerCase();
        const title = toCleanString(item.title) || source;
        if (!source || !id || !type) {
          return null;
        }
        return { source, id, type, title };
      })
      .filter(Boolean);

    const threadId = toCleanString(nested?.thread?.id || top?.thread?.id);

    return {
      answer: answer || toCleanString(textFallback),
      references,
      threadId: threadId || null
    };
  }

  return {
    answer: toCleanString(textFallback),
    references: [],
    threadId: null
  };
}

function startStreaming(text, references) {
  stopStreaming();

  const answer = toCleanString(text);
  if (!answer) {
    return;
  }

  state.messages.push({ role: "assistant", text: "", references: [] });
  state.streaming.messageIndex = state.messages.length - 1;
  state.streaming.characters = Array.from(answer);
  state.streaming.cursor = 0;
  state.streaming.references = Array.isArray(references) ? references : [];

  state.streaming.timer = window.setInterval(() => {
    const idx = state.streaming.messageIndex;
    const total = state.streaming.characters.length;
    if (idx == null || idx >= state.messages.length || total === 0) {
      stopStreaming();
      renderChat();
      return;
    }

    const chunkSize = total > 700 ? 6 : total > 300 ? 4 : 2;
    state.streaming.cursor = Math.min(total, state.streaming.cursor + chunkSize);
    state.messages[idx].text = state.streaming.characters
      .slice(0, state.streaming.cursor)
      .join("");

    if (state.streaming.cursor >= total) {
      state.messages[idx].references = state.streaming.references;
      stopStreaming();
      fetchChatThreads();
    }

    renderChat();
  }, 24);
}

function stopStreaming() {
  if (state.streaming.timer) {
    window.clearInterval(state.streaming.timer);
  }

  state.streaming.timer = null;
  state.streaming.messageIndex = null;
  state.streaming.characters = [];
  state.streaming.cursor = 0;
  state.streaming.references = [];
}

function renderChat() {
  const container = el.chatMessages;
  container.innerHTML = "";

  state.messages.forEach((message) => {
    const row = document.createElement("article");
    row.className = `message ${message.role === "user" ? "message--user" : "message--assistant"}`;

    const bubble = document.createElement("div");
    bubble.className = "message__bubble";

    bubble.innerHTML = renderMessageBodyHTML(message.text, message.references);

    if (message.role === "assistant" && Array.isArray(message.references) && message.references.length) {
      bubble.appendChild(renderReferences(message.references));
    }

    row.appendChild(bubble);
    container.appendChild(row);
  });

  if (state.awaitingResponse) {
    const typingRow = document.createElement("article");
    typingRow.className = "message message--assistant";

    const typingBubble = document.createElement("div");
    typingBubble.className = "message__bubble";
    typingBubble.innerHTML =
      '<div class="typing" aria-label="Assistant is typing"><span></span><span></span><span></span></div>';

    typingRow.appendChild(typingBubble);
    container.appendChild(typingRow);
  }

  requestAnimationFrame(() => {
    container.scrollTop = container.scrollHeight;
  });
}

function renderMessageBodyHTML(text, references) {
  const sourceMap = new Map();
  (references || []).forEach((ref) => sourceMap.set(ref.source.toUpperCase(), ref));

  let html = escapeHtml(text || "");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\n/g, "<br>");
  html = html.replace(/\[S(\d+)\]/gi, (_full, number) => {
    const source = `S${number}`.toUpperCase();
    if (!sourceMap.has(source)) {
      return `<span>[${source}]</span>`;
    }
    return `<button class="ref-chip" data-ref-source="${source}" title="Open reference ${number}">${number}</button>`;
  });

  return `<p>${html || ""}</p>`;
}

function renderReferences(references) {
  const block = document.createElement("div");
  block.className = "references";

  const heading = document.createElement("h4");
  heading.textContent = "References";
  block.appendChild(heading);

  references.forEach((reference, idx) => {
    const btn = document.createElement("button");
    btn.dataset.refSource = reference.source;
    btn.textContent = `${idx + 1}. ${titleCase(reference.title || reference.source)}`;
    block.appendChild(btn);
  });

  return block;
}

function findReferenceBySource(source) {
  const normalized = toCleanString(source).toUpperCase();
  if (!normalized) {
    return null;
  }

  for (let i = state.messages.length - 1; i >= 0; i -= 1) {
    const message = state.messages[i];
    const found = (message.references || []).find(
      (ref) => ref.source.toUpperCase() === normalized
    );
    if (found) {
      return found;
    }
  }

  return null;
}

function openResourceFromReference(reference) {
  if (reference.type === "case") {
    openCaseDetail(reference.id);
    return;
  }

  if (reference.type === "legislation") {
    openLegislationDetail(reference.id);
    return;
  }

  setStatus(`Unknown reference type: ${reference.type}`, "error");
}

async function fetchChatThreads() {
  const query = { limit: "30" };
  if (state.accessToken) {
    query.access_token = state.accessToken;
  }

  const response = await apiRequest("/searches/chat-threads", {
    method: "GET",
    query
  });

  if (!response.ok) {
    state.threads = [];
    renderThreads();
    return;
  }

  state.threads = parseThreadSummaries(response.data);
  renderThreads();
}

function parseThreadSummaries(data) {
  function decodeThread(entry) {
    const id = toCleanString(entry?.id);
    if (!id) {
      return null;
    }
    return {
      id,
      title: toCleanString(entry.title) || "New chat",
      lastQuestion: toCleanString(entry.lastQuestion),
      updatedAt: toCleanString(entry.updatedAt)
    };
  }

  if (Array.isArray(data)) {
    return data.map(decodeThread).filter(Boolean);
  }

  if (data && typeof data === "object") {
    const dataNode = data.data && typeof data.data === "object" ? data.data : data;
    let threadList = Array.isArray(dataNode.threads) ? dataNode.threads : [];

    if (!threadList.length && dataNode.threads && typeof dataNode.threads === "object") {
      threadList = Array.isArray(dataNode.threads.threads) ? dataNode.threads.threads : [];
    }

    return threadList.map(decodeThread).filter(Boolean);
  }

  return [];
}

function renderThreads() {
  el.threadList.innerHTML = "";

  if (!state.threads.length) {
    const empty = document.createElement("li");
    empty.className = "list-item";
    empty.textContent = state.accessToken
      ? "No conversations yet"
      : "Save an access token in Settings to load conversations.";
    el.threadList.appendChild(empty);
    return;
  }

  state.threads.forEach((thread) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    const title = normalizeThreadTitle(thread);
    btn.className = "thread-item";
    btn.dataset.threadId = thread.id;
    btn.classList.toggle("is-active", thread.id === state.currentThreadId);
    btn.textContent = title;
    li.appendChild(btn);
    el.threadList.appendChild(li);
  });
}

function normalizeThreadTitle(thread) {
  const title = toCleanString(thread.title);
  if (title && title.toLowerCase() !== "new chat") {
    return title;
  }
  return toCleanString(thread.lastQuestion) || "New chat";
}

async function loadThread(threadId) {
  stopStreaming();
  state.awaitingResponse = false;

  const query = {};
  if (state.accessToken) {
    query.access_token = state.accessToken;
  }

  const response = await apiRequest(`/searches/chat-threads/${threadId}`, {
    method: "GET",
    query
  });

  if (!response.ok) {
    setStatus("Failed to load selected thread.", "error");
    return;
  }

  const history = parseThreadHistory(response.data);
  state.currentThreadId = threadId;
  state.messages = history.length
    ? history
    : [{ role: "assistant", text: INITIAL_ASSISTANT_MESSAGE, references: [] }];

  renderThreads();
  renderChat();
  setView("chat");
}

function parseThreadHistory(data) {
  if (!data || typeof data !== "object") {
    return [];
  }

  const base = data.data && typeof data.data === "object" ? data.data : data;
  const thread = base.thread && typeof base.thread === "object" ? base.thread : base;
  const history = Array.isArray(thread.history) ? thread.history : [];

  return history
    .map((entry) => {
      const role = toCleanString(entry.role).toLowerCase();
      const content = toCleanString(entry.content);
      if (!content) {
        return null;
      }
      return {
        role: role === "user" ? "user" : "assistant",
        text: content,
        references: []
      };
    })
    .filter(Boolean);
}

async function searchCases(term) {
  if (!term || term.length < 2) {
    state.resources.cases = [];
    renderCases();
    return;
  }

  setStatus("Searching cases...");

  const response = await apiRequest("/cases/mobilesearch", {
    method: "GET",
    query: { term }
  });

  if (!response.ok) {
    state.resources.cases = [];
    renderCases();
    setStatus("Case search failed.", "error");
    return;
  }

  state.resources.cases = Array.isArray(response.data) ? response.data : [];
  renderCases();
  setStatus(`Found ${state.resources.cases.length} case result(s).`);
}

function renderCases() {
  const list = el.caseResults;
  list.innerHTML = "";

  if (!state.search.casesTerm || state.search.casesTerm.length < 2) {
    const hint = document.createElement("div");
    hint.className = "list-item";
    hint.innerHTML =
      "<h4>Case discovery</h4><p>Start typing to search cases by name, citation, or keyword.</p>";
    list.appendChild(hint);
    return;
  }

  if (!state.resources.cases.length) {
    const empty = document.createElement("div");
    empty.className = "list-item";
    empty.innerHTML = `<h4>No results</h4><p>No cases matched "${escapeHtml(
      state.search.casesTerm
    )}".</p>`;
    list.appendChild(empty);
    return;
  }

  state.resources.cases.forEach((item) => {
    const caseId = toCleanString(item._id || item.id);
    const card = document.createElement("article");
    card.className = "result-item";
    card.dataset.caseId = caseId;

    const title = cleanHTMLToText(item.name) || "Untitled case";
    const excerpt = cleanHTMLToText(item.highlight || item.summaryOfRuling || "") ||
      "Open to view case details.";
    const area = toCleanString(item?.areaOfLaw?.name);
    const citation = buildCaseCitation(item);

    card.innerHTML = `
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(excerpt)}</p>
      <p>${escapeHtml([area, citation].filter(Boolean).join(" | "))}</p>
    `;

    list.appendChild(card);
  });
}

function buildCaseCitation(item) {
  if (toCleanString(item.caseNumber)) {
    return item.caseNumber;
  }

  const year = item?.citation?.year;
  const code = toCleanString(item?.citation?.code);
  const page = item?.citation?.pageNumber;
  const parts = [year, code, page].filter(Boolean);
  return parts.join(" / ");
}

async function searchLegislations(term) {
  if (!term || term.length < 2) {
    state.resources.legislations = [];
    renderLegislations();
    return;
  }

  setStatus("Searching legislations...");

  const response = await apiRequest("/legislations/mobilesearch", {
    method: "GET",
    query: { term }
  });

  if (!response.ok) {
    state.resources.legislations = [];
    renderLegislations();
    setStatus("Legislation search failed.", "error");
    return;
  }

  state.resources.legislations = Array.isArray(response.data) ? response.data : [];
  renderLegislations();
  setStatus(`Found ${state.resources.legislations.length} legislation result(s).`);
}

function renderLegislations() {
  const list = el.legislationResults;
  list.innerHTML = "";

  if (!state.search.legislationsTerm || state.search.legislationsTerm.length < 2) {
    const hint = document.createElement("div");
    hint.className = "list-item";
    hint.innerHTML =
      "<h4>Legislation discovery</h4><p>Start typing to search acts, volumes, and statutory instruments.</p>";
    list.appendChild(hint);
    return;
  }

  if (!state.resources.legislations.length) {
    const empty = document.createElement("div");
    empty.className = "list-item";
    empty.innerHTML = `<h4>No results</h4><p>No legislations matched "${escapeHtml(
      state.search.legislationsTerm
    )}".</p>`;
    list.appendChild(empty);
    return;
  }

  state.resources.legislations.forEach((item) => {
    const id = toCleanString(item._id || item.id);
    const title = cleanHTMLToText(item.legislationName || "Untitled legislation");
    const excerpt = cleanHTMLToText(item.highlight || item.preamble || "") ||
      "Open to view legislation details.";
    const type = toCleanString(item.legislationType);
    const amend = item.yearOfAmendment ? `Amended ${item.yearOfAmendment}` : "";

    const card = document.createElement("article");
    card.className = "result-item";
    card.dataset.legislationId = id;
    card.innerHTML = `
      <h4>${escapeHtml(title)}</h4>
      <p>${escapeHtml(excerpt)}</p>
      <p>${escapeHtml([type, amend].filter(Boolean).join(" | "))}</p>
    `;
    list.appendChild(card);
  });
}

async function openCaseDetail(caseId) {
  if (!caseId) {
    return;
  }

  setStatus("Loading case details...");

  const response = await apiRequest("/cases/viewCase", {
    method: "GET",
    query: { id: caseId }
  });

  if (!response.ok) {
    setStatus("Could not load case details.", "error");
    return;
  }

  const caseData = response.data?.data?.cases || response.data?.cases || response.data;
  if (!caseData || typeof caseData !== "object") {
    setStatus("Case payload was invalid.", "error");
    return;
  }

  state.activeDetail = {
    type: "case",
    id: toCleanString(caseData.id || caseData._id || caseId),
    data: caseData
  };

  renderDetailDrawer();
  setStatus("Case details loaded.");
}

async function openLegislationDetail(legislationId) {
  if (!legislationId) {
    return;
  }

  setStatus("Loading legislation details...");

  const response = await apiRequest("/legislations/viewLegislation", {
    method: "GET",
    query: { id: legislationId }
  });

  if (!response.ok) {
    setStatus("Could not load legislation details.", "error");
    return;
  }

  const legislationData =
    response.data?.data?.legislation || response.data?.legislation || response.data;

  if (!legislationData || typeof legislationData !== "object") {
    setStatus("Legislation payload was invalid.", "error");
    return;
  }

  state.activeDetail = {
    type: "legislation",
    id: toCleanString(legislationData.id || legislationData._id || legislationId),
    data: legislationData
  };

  renderDetailDrawer();
  setStatus("Legislation details loaded.");
}

function renderDetailDrawer() {
  const active = state.activeDetail;
  if (!active) {
    el.detailType.textContent = "Resource";
    el.detailTitle.textContent = "Select a resource";
    el.detailMeta.textContent = "Open a case or legislation from search results or references.";
    el.detailBody.innerHTML = "";
    el.bookmarkBtn.disabled = true;
    el.feedbackBtn.disabled = true;
    return;
  }

  el.bookmarkBtn.disabled = false;
  el.feedbackBtn.disabled = false;

  if (active.type === "case") {
    renderCaseDetail(active.data);
    return;
  }

  if (active.type === "legislation") {
    renderLegislationDetail(active.data);
    return;
  }
}

function renderCaseDetail(caseData) {
  el.detailType.textContent = "Case";
  el.detailTitle.textContent = cleanHTMLToText(caseData.name) || "Untitled case";

  const metaBits = [
    toCleanString(caseData?.areaOfLaw?.name),
    buildCaseCitation(caseData),
    toCleanString(caseData?.court?.name)
  ].filter(Boolean);

  el.detailMeta.textContent = metaBits.join(" | ");

  const sections = [
    ["Summary of Facts", cleanHTMLToText(caseData.summaryOfFacts)],
    ["Holding", cleanHTMLToText(caseData.summaryOfRuling)],
    ["Judgement", cleanHTMLToText(caseData.judgement)]
  ].filter((section) => section[1]);

  const references = [];
  if (Array.isArray(caseData.casesReferedTo) && caseData.casesReferedTo.length) {
    references.push(
      `<p><strong>Cases Referenced:</strong> ${escapeHtml(
        caseData.casesReferedTo
          .map((item) => cleanHTMLToText(item.name))
          .filter(Boolean)
          .join(", ")
      )}</p>`
    );
  }

  if (
    Array.isArray(caseData.legislationsReferedTo) &&
    caseData.legislationsReferedTo.length
  ) {
    references.push(
      `<p><strong>Legislations Referenced:</strong> ${escapeHtml(
        caseData.legislationsReferedTo
          .map((item) => cleanHTMLToText(item.legislationName))
          .filter(Boolean)
          .join(", ")
      )}</p>`
    );
  }

  el.detailBody.innerHTML = [
    ...sections.map(
      ([title, content]) =>
        `<section><h4>${escapeHtml(title)}</h4><p>${escapeHtml(content).replace(/\n/g, "<br>")}</p></section>`
    ),
    ...references
  ].join("");
}

function renderLegislationDetail(legislation) {
  el.detailType.textContent = "Legislation";
  el.detailTitle.textContent = cleanHTMLToText(legislation.legislationName) || "Untitled legislation";

  const volume = toCleanString(legislation.volumeNumber);
  const chapter = toCleanString(legislation.chapterNumber);
  const year = toCleanString(legislation.dateOfAssent).slice(0, 4);
  const amended = legislation.yearOfAmendment ? `Amended ${legislation.yearOfAmendment}` : "";

  el.detailMeta.textContent = [
    toCleanString(legislation.legislationType),
    volume && chapter ? `Volume ${volume}, Chapter ${chapter}` : "",
    year ? `Assent ${year}` : "",
    amended
  ]
    .filter(Boolean)
    .join(" | ");

  const preamble = cleanHTMLToText(legislation.preamble);
  const enactment = cleanHTMLToText(legislation.enactment);
  const partTitles = flattenLegislationTitles(legislation.legislationParts || []);

  const sections = [
    preamble ? `<section><h4>Preamble</h4><p>${escapeHtml(preamble).replace(/\n/g, "<br>")}</p></section>` : "",
    enactment ? `<section><h4>Enactment</h4><p>${escapeHtml(enactment).replace(/\n/g, "<br>")}</p></section>` : "",
    partTitles.length
      ? `<section><h4>Parts</h4><p>${escapeHtml(partTitles.join(" | "))}</p></section>`
      : ""
  ].filter(Boolean);

  el.detailBody.innerHTML = sections.join("");
}

function flattenLegislationTitles(parts) {
  const output = [];

  function walk(nodes) {
    nodes.forEach((node) => {
      const number = toCleanString(node.number);
      const title = cleanHTMLToText(node.title);
      const label = [number, title].filter(Boolean).join(" ");
      if (label) {
        output.push(label);
      }
      if (Array.isArray(node.subParts) && node.subParts.length) {
        walk(node.subParts);
      }
    });
  }

  if (Array.isArray(parts)) {
    walk(parts);
  }

  return output;
}

async function addBookmarkFromActiveDetail() {
  if (!state.activeDetail) {
    return;
  }

  if (!state.username) {
    setStatus("Set a username in Settings before bookmarking.", "error");
    return;
  }

  const payload = {
    username: state.username,
    sourceId: state.activeDetail.id,
    type: state.activeDetail.type
  };

  let response = await apiRequest("/Customers/bookmark", {
    method: "POST",
    body: payload
  });

  if (!response.ok) {
    response = await apiRequest("/Customers/bookmark", {
      method: "POST",
      body: payload,
      asForm: true
    });
  }

  if (!response.ok) {
    setStatus("Could not add bookmark.", "error");
    return;
  }

  setStatus("Bookmark saved.");
  loadBookmarks();
}

async function sendFeedbackForActiveDetail() {
  if (!state.activeDetail) {
    return;
  }

  if (!state.username) {
    setStatus("Set a username in Settings before sending feedback.", "error");
    return;
  }

  const feedback = el.feedbackInput.value.trim();
  if (!feedback) {
    setStatus("Please enter feedback first.", "error");
    return;
  }

  const payload = {
    appVersion: "1.0.0",
    platform: "Web",
    username: state.username,
    feedback,
    scope: state.activeDetail.id,
    resourceType: state.activeDetail.type
  };

  let response = await apiRequest("/feedback", {
    method: "POST",
    body: payload
  });

  if (!response.ok) {
    response = await apiRequest("/feedback", {
      method: "POST",
      body: payload,
      asForm: true
    });
  }

  if (!response.ok) {
    setStatus("Could not send feedback.", "error");
    return;
  }

  el.feedbackInput.value = "";
  setStatus("Feedback sent.");
}

async function loadHomeData() {
  await Promise.all([loadBookmarks(), loadNews(), loadTrends()]);
}

async function loadBookmarks() {
  if (!state.username) {
    state.home.bookmarks = [];
    renderHomeLists();
    return;
  }

  const response = await apiRequest("/Customers/bookmarks", {
    method: "GET",
    query: { username: state.username }
  });

  state.home.bookmarks = response.ok && Array.isArray(response.data) ? response.data : [];
  renderHomeLists();
}

async function loadNews() {
  const response = await apiRequest("/news/viewNews", { method: "GET" });
  state.home.news = response.ok && Array.isArray(response.data) ? response.data : [];
  renderHomeLists();
}

async function loadTrends() {
  const response = await apiRequest("/trendings/viewTrends", { method: "GET" });
  state.home.trends = response.ok && Array.isArray(response.data) ? response.data : [];
  renderHomeLists();
}

function renderHomeLists() {
  renderListItems(el.bookmarksList, state.home.bookmarks, "No bookmarks yet", true);
  renderListItems(el.newsList, state.home.news, "No news yet");
  renderListItems(el.trendsList, state.home.trends, "No trends yet");
}

function renderListItems(container, items, emptyText, clickable = false) {
  container.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("article");
    empty.className = "list-item";
    empty.innerHTML = `<h4>${escapeHtml(emptyText)}</h4>`;
    container.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const title = cleanHTMLToText(item.title || item.name || "Untitled");
    const summary = cleanHTMLToText(item.summary || item.highlight || "");

    const card = document.createElement("article");
    card.className = "list-item";
    card.innerHTML = `<h4>${escapeHtml(title)}</h4><p>${escapeHtml(summary)}</p>`;

    if (clickable) {
      card.style.cursor = "pointer";
      card.dataset.bookmarkType = toCleanString(item.type).toLowerCase();
      card.dataset.bookmarkId = toCleanString(item.sourceId || item.id || item._id);
    }

    container.appendChild(card);
  });
}

async function login() {
  const username = el.loginUsernameInput.value.trim();
  const password = el.loginPasswordInput.value;

  if (!username || !password) {
    setStatus("Enter username and password to login.", "error");
    return;
  }

  setStatus("Logging in...");

  let response = await apiRequest("/appusers/login", {
    method: "POST",
    body: { username, password },
    skipAuthHeader: true
  });

  if (!response.ok) {
    response = await apiRequest("/appusers/login", {
      method: "POST",
      body: { username, password },
      asForm: true,
      skipAuthHeader: true
    });
  }

  if (!response.ok) {
    setStatus("Login failed.", "error");
    return;
  }

  const token =
    toCleanString(response.data?.id) ||
    toCleanString(response.data?.token) ||
    toCleanString(response.data?.access_token) ||
    toCleanString(response.data?.data?.id) ||
    "";

  state.username = username;
  state.accessToken = token;
  persistSession();

  el.usernameInput.value = state.username;
  el.tokenInput.value = state.accessToken;

  setStatus(token ? "Login succeeded and token saved." : "Login succeeded.");
  fetchChatThreads();
  loadBookmarks();
}

async function apiRequest(path, options = {}) {
  const method = options.method || "GET";
  const query = options.query || {};
  const body = options.body;
  const asForm = options.asForm || false;
  const skipAuthHeader = options.skipAuthHeader || false;
  const runtimeOrigin =
    typeof window !== "undefined" &&
    window.location &&
    window.location.origin &&
    window.location.origin !== "null"
      ? window.location.origin
      : "http://localhost:5173";

  let url;
  try {
    url = new URL(`${API_BASE}${path}`, runtimeOrigin);
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      text: "",
      error,
      errorMessage: "Invalid API URL configuration. Start with `node server.mjs`."
    };
  }

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}`.length) {
      url.searchParams.set(key, String(value));
    }
  });

  const headers = {
    Accept: "application/json",
    "X-IBM-Client-ID": CLIENT_ID,
    "X-IBM-Client-Secret": CLIENT_SECRET
  };

  if (!skipAuthHeader && state.accessToken) {
    headers.Authorization = `Bearer ${state.accessToken}`;
  }

  const requestInit = {
    method,
    headers
  };

  if (body !== undefined) {
    if (asForm) {
      headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
      requestInit.body = new URLSearchParams(body).toString();
    } else {
      headers["Content-Type"] = "application/json";
      requestInit.body = JSON.stringify(body);
    }
  }

  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  requestInit.signal = controller.signal;

  try {
    const response = await fetch(url.toString(), requestInit);
    globalThis.clearTimeout(timeoutId);
    const text = await response.text();
    const parsed = parseMaybeJSON(text, response.headers.get("content-type"));

    return {
      ok: response.ok,
      status: response.status,
      data: parsed,
      text
    };
  } catch (error) {
    globalThis.clearTimeout(timeoutId);
    const aborted = error?.name === "AbortError";
    const message = aborted
      ? `request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`
      : toCleanString(error?.message || "network error");

    return {
      ok: false,
      status: 0,
      data: null,
      text: "",
      error,
      errorMessage: message,
      isLikelyTimeout: aborted,
      isLikelyCORS:
        message.toLowerCase().includes("failed to fetch") ||
        message.toLowerCase().includes("networkerror")
    };
  }
}

function describeFailure(label, response) {
  if (response.status === 401) {
    return `${label}: 401 unauthorized`;
  }
  if (response.status === 403) {
    return `${label}: 403 forbidden`;
  }
  if (response.status === 404) {
    return `${label}: 404 not found`;
  }
  if (response.status === 0) {
    const reason = response.errorMessage || "network blocked";
    return `${label}: network error (${reason})`;
  }

  const summary =
    extractErrorSummary(response.data) ||
    toCleanString(response.text).slice(0, 140) ||
    "request failed";
  return `${label}: HTTP ${response.status} (${summary})`;
}

function extractErrorSummary(data) {
  if (!data) {
    return "";
  }
  if (typeof data === "string") {
    return toCleanString(data);
  }
  if (typeof data === "object") {
    return (
      toCleanString(data.error?.message) ||
      toCleanString(data.error) ||
      toCleanString(data.message) ||
      toCleanString(data.details) ||
      ""
    );
  }
  return "";
}

function buildAskAIFailure(failures) {
  const joined = failures.filter(Boolean).join(" | ");
  const lower = joined.toLowerCase();
  const hasAuthIssue =
    lower.includes("401") || lower.includes("403") || lower.includes("token");
  const hasNetworkIssue =
    lower.includes("network error") ||
    lower.includes("failed to fetch") ||
    lower.includes("cors");

  let userMessage = "Sorry, I could not get a response right now. Please try again.";
  if (hasAuthIssue) {
    userMessage = "Authentication failed. Open Settings and save a valid access token, then try again.";
  } else if (hasNetworkIssue) {
    userMessage =
      "Network/CORS blocked the request. Make sure this app is served over HTTP from localhost and API access is allowed.";
  }

  return {
    ok: false,
    message: "Ask AI request failed.",
    debugMessage: joined || "Ask AI failed for unknown reason.",
    userMessage
  };
}

function parseMaybeJSON(text, contentType) {
  const body = toCleanString(text);
  if (!body) {
    return null;
  }

  const maybeJSON =
    (contentType && contentType.toLowerCase().includes("json")) ||
    body.startsWith("{") ||
    body.startsWith("[");

  if (!maybeJSON) {
    return body;
  }

  try {
    return JSON.parse(body);
  } catch (_error) {
    return body;
  }
}

function setStatus(text, type = "info") {
  el.statusText.textContent = text;
  el.statusText.style.color = type === "error" ? "#111111" : "#4d4d4d";
}

function escapeHtml(value) {
  const str = value == null ? "" : String(value);
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function cleanHTMLToText(value) {
  const source = toCleanString(value);
  if (!source) {
    return "";
  }
  const temp = document.createElement("div");
  temp.innerHTML = source;
  return toCleanString(temp.textContent || temp.innerText);
}

function toCleanString(value) {
  return value == null ? "" : String(value).trim();
}

function titleCase(value) {
  return toCleanString(value)
    .toLowerCase()
    .replace(/(^|\s)\S/g, (char) => char.toUpperCase());
}

function autoResize(textarea, maxHeight) {
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
}

init();
