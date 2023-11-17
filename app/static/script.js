const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const sendBtn = document.getElementById("sendBtn");
const inputs = document.querySelector("#inpt");
let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;
executeMessage = null;
const spinDiv = document.getElementById('spinner');

const createChatLi = (message, className,flag) => {
    // Create a chat <li> element with passed message and className
    let chatContent = " ";
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    if (flag == 1){
        chatLi.classList.add("finalIncoming");
        chatContent = className === "outgoing" ? `<p id="inpt"></p><span class="material-symbols-outlined edit" id="edit">
        edit
        </span>` : `<p></p><button class="btn btn-primary" style="width:8rem;margin-left:3rem" id="dwnldBtn">Download</button>`;
    }
    else{

        // Generate a unique ID based on logic
        const uniqueId = `vmcmd_${new Date().getTime()}`;

        chatContent = className === "outgoing"
        ? `<p data-id="${uniqueId}"></p><span class="material-symbols-outlined edit" data-edit-id="${uniqueId}">
          edit
          </span>`
        : `<p data-id='${uniqueId}'></p><div id="${uniqueId}" class="btnDiv">
          <button class="btn btn-primary" style="width=5rem" onclick="editCommand('${uniqueId}')">Edit</button>
          <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="clearAll('${uniqueId}')">Execute</button>
          </div>`;

        // chatContent = className === "outgoing" ? `<p id="inpt"></p><span class="material-symbols-outlined edit" id="edit">
        // edit
        // </span>` : `<p id='vmcmd'></p><div id="btnDiv" class="btnDiv"><button class="btn btn-primary" style="width=5rem" onclick="editCommand()">Edit</button><button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="clear()">Execute</button></div>`;
        executeMessage = message;
        console.log(executeMessage);
    } 
    
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const messageElement = chatElement.querySelector("p");    
    messageElement.textContent = "gcloud compute instances create demo-instance  --custom-cpu=8 --custom-memory=32GB --machine-type=e2-standard-10 ";
}

const executeCommand = (filename, executeMessage) => {
    const requestData = {
        filename: filename,
        executeMessage: executeMessage
    };
     //disable the multiple send click
     sendChatBtn.style.pointerEvents = 'none'; 
     //displaying the spinner whenever response is ready.
     spinDiv.style.display = 'block';
     chatbox.appendChild(spinDiv);
    fetch("/executecommands", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => handleExecuteCommandResponse(data))
    .catch(error => console.error('Error:', error));
    //make empty the button div
    
}

function downloadJSON(data, fileName) {
    // Convert JSON to a string
    const jsonString = JSON.stringify(data, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName || 'data.json';
    downloadLink.textContent = 'Download JSON'; // Added text content for the link

    // Append the link to the body
    document.body.appendChild(downloadLink);

    return downloadLink; // Return the created link
}


// You can add a function to handle the response if needed
const handleExecuteCommandResponse = (data) => {
    console.log("Response from executeCommands:", data);
    if(data.status === 200) {
        chatbox.appendChild(createChatLi("Executed Successfully.. For your reference download json file from link.","incoming",1));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        sendChatBtn.style.pointerEvents = 'auto';
        chatbox.removeChild(spinDiv);
    } 
    else {
        chatbox.appendChild(createChatLi("Error in execution.. for know more about error,please download json file from link.","incoming",1));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        sendChatBtn.style.pointerEvents = 'auto';
        chatbox.removeChild(spinDiv);
    }
    // Download JSON file
    const downloadLink = downloadJSON(data, 'example.json');

    // Trigger the click event to start the download
    downloadLink.click();

    // Remove the link from the DOM
    document.body.removeChild(downloadLink);
}

const handleChat = () => {


    const form = document.getElementById('myForm');
    // const chatMessage = document.getElementById('chat_message').value;

    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    const formData = new FormData();
    formData.append('chat_message', userMessage);
    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    //disable the multiple send click
    sendChatBtn.style.pointerEvents = 'none'; 
    //displaying the spinner whenever response is ready.
    spinDiv.style.display = 'block';
    chatbox.appendChild(spinDiv);
    fetch("/predict", {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response data as needed
        setTimeout(() => {
            // Display "Thinking..." message while waiting for the response
            const incomingChatLi = createChatLi(data, "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            sendChatBtn.style.pointerEvents = 'auto';
            chatbox.removeChild(spinDiv);
            // generateResponse(incomingChatLi);
        }, 3000);
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

}

const editCommand = (uniqueId) => {
    const element = document.querySelector(`[data-id="${uniqueId}"]`);
    if (element) {
        element.setAttribute('contenteditable', 'true');
        element.style.backgroundColor = 'antiquewhite'
        // Add an event listener for blur to capture the edited content
        element.addEventListener('blur', () => {
            executeMessage = element.textContent.trim();
        });
    }
}


chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});
sendChatBtn.addEventListener("click", handleChat);

function editMessage(){    
        sendBtnDiv.innerHTML = "";
        let div =  `<button class="btn btn-primary" style="width=5rem" onclick="editCommand()">Edit</button><button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="clear()">Execute</button>`;
        sendBtnDiv.innerHTML=div;
        document.getElementById('vmcmd').setAttribute('contenteditable','false');
}
const clearAll = (id)=>{
    btnDv = document.getElementById(id);
    btnDv.innerHTML = " ";
    document.getElementById("userInput").value = "";
    document.getElementById("myFile").value = '';
}

const saveFile = () =>{
    
    const inputFiles = document.getElementById("myFile");
    const endpoint = "http://127.0.0.1:5000/upload"
    const formData = new FormData();
    formData.append('file',inputFiles.files[0]);

    fetch(endpoint,{
        method:'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => checkResp(data))
    .catch(error => console.error('Error:',error))
    document.querySelector('.btn-close').click();

    // function for execute CLI cmd
    executeCommand(inputFiles.files[0].name, executeMessage);
}
const checkResp = (data) =>{
    // cliCmd = document.getElementById('vmcmd').textContent;
    console.log(data);
    if ('error' in data){
        alert("Please upload your credentials file, It's required!")
    }
    else{
        btnDiv = document.getElementById('btnDiv')
        btnDiv.remove();
        // cliCmd = document.getElementById('vmcmd').textContent;
        chatbox.appendChild(createChatLi("Server response of executing CLI command","incoming",1));
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
}
 