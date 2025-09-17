// ChatGPT USER INTERFACE
const chatHistoryElem = document.getElementById('chat-history');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const loadingIndicator = document.getElementById('loading-indicator');
const clearChatBtn = document.getElementById('clear-chat');
const newChatBtn = document.getElementById('new-chat');
const modelSelect = document.getElementById('model-select');

const LS_KEY = 'chatgpt_local_history';
const LS_MODEL = 'chatgpt_local_model';

function saveHistory(history) {
  localStorage.setItem(LS_KEY, JSON.stringify(history));
}
function loadHistory() {
  return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
}
function saveModel(model) {
  localStorage.setItem(LS_MODEL, model);
}
function loadModel() {
  return localStorage.getItem(LS_MODEL) || 'gpt-5.0';  //  TELL WHICH MODEL YOU CURRENTLY USING
}

function renderHistory(history) {
  chatHistoryElem.innerHTML = '';
  history.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'bubble ' + msg.role;
    div.textContent = msg.content;
    chatHistoryElem.appendChild(div);
  });
  chatHistoryElem.scrollTop = chatHistoryElem.scrollHeight;
}

function addMessage(role, content) {
  const history = loadHistory();
  history.push({ role, content });
  saveHistory(history);
  renderHistory(history);
}

function clearHistory() {
  localStorage.removeItem(LS_KEY);
  renderHistory([]);
}

function startNewChat() {
  clearHistory();
  addMessage('bot', 'Hello! How can I help you today?'); //  IT WILL SHOW ON THE BACKGROUND 
}

function setModel(model) {
  saveModel(model);
}

function getModel() {
  return loadModel();
}

// Simulate API call
function getBotResponse(userMsg, model) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`(${model.toUpperCase()})  "${userMsg}"`);
    }, 1200);
  });
}

chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = userInput.value.trim();
  if (!msg) return;
  addMessage('user', msg);
  userInput.value = '';
  loadingIndicator.style.display = 'block';
  const model = getModel();
  const botReply = await getBotResponse(msg, model);
  loadingIndicator.style.display = 'none';
  addMessage('bot', botReply);
});

clearChatBtn.addEventListener('click', () => {
  clearHistory();
});

newChatBtn.addEventListener('click', () => {
  startNewChat();
});

modelSelect.addEventListener('change', e => {
  setModel(e.target.value);
});

// Restore state on load
window.addEventListener('DOMContentLoaded', () => {
  modelSelect.value = getModel();
  const history = loadHistory();
  if (history.length === 0) {
    addMessage('bot', 'Hello! How can I help you today?');
  } else {
    renderHistory(history);
  }

});
