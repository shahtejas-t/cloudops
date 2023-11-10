const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const sendBtn = document.getElementById("sendBtn");
const inputs = document.querySelector("#inpt");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className, flag) => {
    // Create a chat <li> element with passed message and className
    let chatContent = " ";
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    if (flag == 1) {
        chatContent = className === "outgoing" ? `<p id="inpt"></p><span class="material-symbols-outlined edit" id="edit">
        edit
        </span>` : `<p></p>`;
    }
    else {
        chatContent = className === "outgoing" ? `<p id="inpt"></p><span class="material-symbols-outlined edit" id="edit">
        edit
        </span>` : `<p id='vmcmd'></p><div id="btnDiv" class="btnDiv"><button class="btn btn-primary" style="width=5rem" onclick="editCommand()">Edit</button><button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="clear()">Execute</button></div>`;
    }

    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const messageElement = chatElement.querySelector("p");
    messageElement.textContent = "gcloud compute instances create demo-instance  --custom-cpu=8 --custom-memory=32GB --machine-type=e2-standard-8 ";
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
    const endpoint = "http://127.0.0.1:5000/upload"
    const formData = new FormData();
    formData.append('file', inputFiles.files[0]);

    fetch(endpoint, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => checkResp(data))
        .catch(error => console.error('Error:', error))
    document.querySelector('.btn-close').click();
    //function for execute CLI cmd
    // execute();
}
const checkResp = (data) => {
    cliCmd = document.getElementById('vmcmd').textContent;
    console.log(data);
    if ('error' in data) {
        alert("Please upload your credentials file, It's required!")
    }
    else {
        btnDiv = document.getElementById('btnDiv')
        btnDiv.remove();
        cliCmd = document.getElementById('vmcmd').textContent;
        console.log(cliCmd)
        chatbox.appendChild(createChatLi("Server response of executing CLI command", "incoming", 1));
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
}
