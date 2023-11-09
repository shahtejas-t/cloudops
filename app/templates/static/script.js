const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const sendBtn = document.getElementById("sendBtn");
const inputs = document.querySelector("#inpt");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p id="inpt"></p><span class="material-symbols-outlined edit" id="edit">
    edit
    </span>` : `<p id='vmcmd'></p><div id="btnDiv" class="btnDiv"><button class="btn btn-primary" style="width=5rem" onclick="editCommand()">Edit</button><button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="clear()">Execute</button></div>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const messageElement = chatElement.querySelector("p");
    messageElement.textContent = "I'm interesetd in purchasing the laptop ";
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

const editCommand = () => {
    document.getElementById('vmcmd').setAttribute('contenteditable', 'true');
    /*sendBtnDiv = document.getElementById("btnDiv");
    sendBtnDiv.innerHTML = " ";
    saveBtn = document.createElement('button');
    saveBtn.id = "saveBtn";
    saveBtn.classList.add("btn");
    saveBtn.classList.add("btn-success");
    saveBtn.textContent = "Save";
    saveBtn.onclick = function() {editMessage()};
    cancelBtn = document.createElement('button');
    cancelBtn.id = "saveBtn";
    cancelBtn.classList.add("btn");
    cancelBtn.classList.add("btn-secondary");
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = function() {editMessage()};
    sendBtnDiv.appendChild(saveBtn);
    sendBtnDiv.appendChild(cancelBtn);*/
}
chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});
sendChatBtn.addEventListener("click", handleChat);

function editMessage() {
    sendBtnDiv.innerHTML = "";
    let div = `<button class="btn btn-primary" style="width=5rem" onclick="editCommand()">Edit</button><button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="clear()">Execute</button>`;
    sendBtnDiv.innerHTML = div;
    document.getElementById('vmcmd').setAttribute('contenteditable', 'false');
}
const clearAll = () => {
    document.getElementById("userInput").value = "";
    document.getElementById("myFile").value = '';
}

const saveFile = () => {

    const inputFiles = document.getElementById("myFile");
    const endpoint = "http://127.0.0.1:5000/"
    const formData = new FormData();

    formData.append('inputFiles', inputFiles.files[0])
}