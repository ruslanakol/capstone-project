"use strict";
var _a, _b;
const questions = [
    {
        text: "How often do you travel? ✈️",
        options: ["1-2 times a year", "3-5 times a year", "More than 6 times"]
    },
    {
        text: "What kind of trips do you take? 🌍",
        options: ["Weekend trips", "Business travel", "Long vacations"]
    },
    {
        text: "Do you prefer carry-on or checked baggage? 🧳",
        options: ["Carry-on only", "Checked bag", "Both"]
    },
    {
        text: "What is your budget? 💰",
        options: ["Under $200", "$200–$350", "$350+"]
    },
    {
        text: "What matters most to you? ⭐",
        options: ["Lightweight", "Durability", "Style"]
    }
];
let quizAnswers = [];
let quizStep = 0;
let inQuiz = false;
let isOpen = false;
const chatBtn = document.createElement('button');
chatBtn.id = 'chat-btn';
chatBtn.textContent = '💬';
const chatWindow = document.createElement('div');
chatWindow.id = 'chat-window';
chatWindow.innerHTML = `
    <div id="chat-header">
        <span>🧳 Suitcase Assistant</span>
        <button id="chat-close">✕</button>
    </div>
    <div id="chat-messages"></div>
    <div id="chat-options"></div>
    <div id="chat-input-row">
        <input id="chat-input" type="text" placeholder="Type your question..." />
        <button id="chat-send">➤</button>
    </div>
`;
document.body.appendChild(chatBtn);
document.body.appendChild(chatWindow);
const style = document.createElement('style');
style.textContent = `
    #chat-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        background: #B92770;
        color: white;
        border: none;
        font-size: 22px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(185,39,112,0.4);
        z-index: 9999;
    }

    #chat-window {
        display: none;
        position: fixed;
        bottom: 95px;
        right: 30px;
        width: 320px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        z-index: 9998;
        font-family: 'Montserrat', sans-serif;
        overflow: hidden;
    }

    #chat-header {
        background: #B92770;
        color: white;
        padding: 14px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
        font-size: 14px;
    }

    #chat-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
    }

    #chat-messages {
        padding: 14px;
        max-height: 260px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .chat-msg {
        max-width: 80%;
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 13px;
        line-height: 1.5;
    }

    .chat-msg.bot {
        background: #f5f5f5;
        color: #333;
        align-self: flex-start;
    }

    .chat-msg.user {
        background: #B92770;
        color: white;
        align-self: flex-end;
    }

    #chat-options {
        padding: 6px 14px 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .chat-opt {
        border: 1.5px solid #B92770;
        color: #B92770;
        background: white;
        border-radius: 20px;
        padding: 5px 12px;
        font-size: 12px;
        cursor: pointer;
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
    }

    .chat-opt:hover {
        background: #B92770;
        color: white;
    }

    #chat-input-row {
        display: flex;
        gap: 8px;
        padding: 10px 14px;
        border-top: 1px solid #eee;
    }

    #chat-input {
        flex: 1;
        border: 1.5px solid #eee;
        border-radius: 20px;
        padding: 7px 12px;
        font-size: 13px;
        font-family: 'Montserrat', sans-serif;
        outline: none;
    }

    #chat-input:focus { border-color: #B92770; }

    #chat-send {
        background: #B92770;
        color: white;
        border: none;
        border-radius: 50%;
        width: 34px;
        height: 34px;
        cursor: pointer;
        font-size: 14px;
    }
`;
document.head.appendChild(style);
const messagesEl = document.getElementById('chat-messages');
const optionsEl = document.getElementById('chat-options');
const inputEl = document.getElementById('chat-input');
function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}
function setOptions(opts, onClick) {
    optionsEl.innerHTML = '';
    opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'chat-opt';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
            addMessage(opt, 'user');
            optionsEl.innerHTML = '';
            onClick(opt);
        });
        optionsEl.appendChild(btn);
    });
}
chatBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'block' : 'none';
    if (isOpen && messagesEl.children.length === 0)
        startChat();
});
(_a = document.getElementById('chat-close')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    isOpen = false;
    chatWindow.style.display = 'none';
});
function startChat() {
    addMessage("Hi! I can help you find the perfect suitcase or answer your questions 😊", 'bot');
    setTimeout(() => {
        setOptions(["🎯 Find my suitcase", "❓ Ask a question"], (opt) => {
            if (opt.includes('Find')) {
                startQuiz();
            }
            else {
                addMessage("Go ahead, type your question below!", 'bot');
            }
        });
    }, 400);
}
function startQuiz() {
    inQuiz = true;
    quizStep = 0;
    quizAnswers = [];
    addMessage("Great! Just 5 quick questions 🎯", 'bot');
    setTimeout(askQuestion, 500);
}
function askQuestion() {
    const q = questions[quizStep];
    addMessage(q.text, 'bot');
    setOptions(q.options, (answer) => {
        quizAnswers.push(answer);
        quizStep++;
        if (quizStep < questions.length) {
            setTimeout(askQuestion, 400);
        }
        else {
            setTimeout(showResult, 500);
        }
    });
}
function showResult() {
    const result = getRecommendation(quizAnswers);
    addMessage(result, 'bot');
    setTimeout(() => {
        setOptions(["🔄 Try again", "❓ Ask a question"], (opt) => {
            if (opt.includes('Try')) {
                startQuiz();
            }
            else {
                addMessage("Sure! Type your question below.", 'bot');
            }
        });
    }, 500);
}
function getRecommendation(answers) {
    const budget = answers[3];
    const priority = answers[4];
    const trip = answers[1];
    if (budget.includes('Under')) {
        return "I recommend our Lightweight Compact Carry-On — affordable, light and great for short trips! Starting at $230 🧳";
    }
    if (budget.includes('350')) {
        return "With your budget, our Premium Explorer Luggage Set is perfect — covers all your trips in style! $750 👑";
    }
    if (priority.includes('Lightweight')) {
        return "You'll love our Luxury Lightweight Travel Suitcase — elegant and easy to carry. ~$280 ✨";
    }
    if (priority.includes('Durable')) {
        return "Check out the Explorer Pro Durable Suitcase — built tough for frequent travelers. ~$270 💪";
    }
    return `For ${trip.toLowerCase()}, our Urban Compact Travel Suitcase is a great choice — stylish and practical. ~$310 🎨`;
}
(_b = document.getElementById('chat-send')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', sendFreeText);
inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')
        sendFreeText();
});
function sendFreeText() {
    const text = inputEl.value.trim();
    if (!text)
        return;
    addMessage(text, 'user');
    inputEl.value = '';
    const lower = text.toLowerCase();
    let reply = "Great question! Feel free to browse our catalog or contact our team for more help 😊";
    if (lower.includes('price') || lower.includes('cost') || lower.includes('cheap')) {
        reply = "Our suitcases range from $220 to $800. We have options for every budget! 💰";
    }
    else if (lower.includes('size')) {
        reply = "We offer S, M, L and XL sizes. S is great for carry-on, XL for long trips! 📦";
    }
    else if (lower.includes('color')) {
        reply = "We have red, blue, green, black, grey, pink and yellow options. Lots to choose from! 🎨";
    }
    else if (lower.includes('ship') || lower.includes('deliver')) {
        reply = "We ship worldwide! Standard delivery takes 5-7 business days 🌍";
    }
    else if (lower.includes('return') || lower.includes('refund')) {
        reply = "We have a 30-day return policy. Contact us at best@shop.com for help! 📧";
    }
    else if (lower.includes('sale') || lower.includes('discount')) {
        reply = "Check out our SALE items in the catalog — up to 25% off selected models! 🏷️";
    }
    setTimeout(() => addMessage(reply, 'bot'), 500);
}
