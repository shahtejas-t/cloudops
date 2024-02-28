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
const modalBox = document.getElementById('exampleModal');
let num = 0;
let inputFile = "";
let credFile = "";
const spinDiv = document.getElementById('spinner');

const createChatLi = (message, className, flag,id,isButton) => {
    // Create a chat <li> element with passed message and className
    let chatContent = " ";
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    if (flag == 1) {
        if(isButton){
        chatLi.classList.add("finalIncoming");
        chatContent = className === "outgoing" ? `<p id="inpt"></p><span class="material-symbols-outlined edit" id="edit">
        edit
        </span>` : `<p></p><button class = "btn btn-primary" style="width:12rem;margin-left:3rem" id="${id}"></button>`;
    }
    else{
        chatLi.classList.add("finalIncomingWBtn");
        chatContent = className === "outgoing" ? `<p id="inpt"></p><span class="material-symbols-outlined edit" id="edit">
        edit
        </span>` : `<p></p>`;
    }
}
    else {
        // Generate a unique ID based on logic
        const uniqueId = `vmcmd_${new Date().getTime()}`;
        if (message.slice(0, 6) === 'gcloud' || message.slice(0, 3) === 'aws' || message.slice(0, 6) === 'gsutil') {
            chatContent = className === "outgoing"
                ? `<p data-id="${uniqueId}"></p><span class="material-symbols-outlined edit" data-edit-id="${uniqueId}">
          edit
          </span>`
                : `<p data-id='${uniqueId}'></p><div id="${uniqueId}" class="btnDiv">
          <button class="btn btn-primary" style="width=5rem" onclick="editCommand('${uniqueId}')">Edit</button>
          <button class="btn btn-success" onclick="clearAll('${uniqueId}')">Execute</button>
          </div>`;
        }
        else {
            chatContent = className === "outgoing"
                ? `<p data-id="${uniqueId}"></p><span class="material-symbols-outlined edit" data-edit-id="${uniqueId}">
          edit
          </span>`
                : `<p data-id='${uniqueId}'></p><div id="${uniqueId}" class="btnDiv">`
        }
        executeMessage = message;
        console.log(executeMessage);
    }
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}
const executeCommand = (filename, executeMessage) => {
    listCmd = executeMessage.split(' ');
    if(listCmd[0] === 'aws'){
        filename = 'cloudops_user_accessKeys.csv';
    }
    if(document.querySelector('.btnDiv')){
        btnDiv = document.querySelector('.btnDiv');
        setTimeout(()=>{
            btnDiv.remove();
        }, 2000);
        
    }
    
    const requestData = {
        filename: filename,
        executeMessage: executeMessage
    };
    let isListCmd = false;
    let isStopCmd = false;
    let isBucketCmd = false;
    let isAWSCmd = false;
    if (listCmd.length > 3 && listCmd[3] == 'list') {
        isListCmd = true;
    }
    if(listCmd.length > 3 && listCmd[4] == 'stop'){
        isStopCmd = true;
    }
    if (listCmd.length > 3 && listCmd[1] == 'storage'){
        isBucketCmd = true;
    }
    if(listCmd[0] === 'aws'){
        isAWSCmd = true;
    }
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
        .then(response => {
            if (response.status == 500) {
                setTimeout(() => {
                    chatbox.appendChild(createChatLi("OOPS! something went wrong, Upload correct auth file", "incoming"));
                    chatbox.scrollTo(0, chatbox.scrollHeight);
                    sendChatBtn.style.pointerEvents = 'auto';
                    chatbox.removeChild(spinDiv);
                }, 3000);
            }
            else return response.json();
        })
        .then(data => handleExecuteCommandResponse(data, isListCmd,isBucketCmd,isStopCmd,isAWSCmd))
        .catch(error => console.error('Error:', error));
    //make empty the button div
    inputFile = " ";
}
function downloadJSON(data, fileName, id) {
    // Convert JSON to a string
    const jsonString = JSON.stringify(data, null, 2);
    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName || 'data.json';
    downloadLink.textContent = 'Download Report'; // Added text content for the link
    // Append the link to the body
    document.getElementById(id).appendChild(downloadLink);
}
//return downloadLink; // Return the created link
// You can add a function to handle the response if needed
const handleExecuteCommandResponse = (data, isListCmd,isBucketCmd, isStopCmd, isAWSCmd) => {
    sendChatBtn.style.pointerEvents = 'auto';
    chatbox.removeChild(spinDiv);
    num = num + 1;
    id = 'DwnldBtn_' + num;
    let isButton = false;
    console.log("Response from executeCommands:", data);
    if(data.status === 200 && isAWSCmd){
            const chatLi = document.createElement('li');
            chatLi.classList.add('chat', 'finalIncoming');
            const vmListElement = `<h6><center>AWS command executed successfully, for more details download report on below link.</center></h6>
            <button class = "btn btn-primary" style="margin-top: -1rem;
            margin-bottom: 1rem;
            list-style: auto;width: 12rem;
            margin-left: 12rem;" id="${id}"></button>`
            chatLi.innerHTML = vmListElement;
            chatbox.appendChild(chatLi);
            const downloadLink = downloadJSON(data, 'exam\ple.json', id);
    }
    if(data.status === 500){
        chatbox.appendChild(createChatLi("Facing Error while executing command.", "incoming", 1, id,isButton));
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
    if (data.status === 200 && typeof (data.response) === "string") {
        chatbox.appendChild(createChatLi(data.response, "incoming", 1, id,isButton));
        let chatLi = document.createElement('li');
        chatLi.classList.add('chat', 'incoming');
        resp = `<p>${data.response}</p>`;
        chatbox.scrollTo(0, chatbox.scrollHeight);
        chatLi.innerHTML = vmListElement;
        chatbox.appendChild(chatLi);
        
    }
    else if(data.status === 200 && data.response.length == 0){
        if(isBucketCmd){
            chatbox.appendChild(createChatLi("storage bucket is created successfully", "incoming", 1, id,isButton));
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
        else if(isListCmd){
            chatbox.appendChild(createChatLi("No VM is created.", "incoming", 1, id,isButton));
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
        else {
            chatbox.appendChild(createChatLi("VM is stopped successfully", "incoming", 1, id,isButton));
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
    }
    else if (data.status === 200 && data.response[0].hasOwnProperty('name')) {
        let respo = data.response[0];
        let vmList = "";
        if (data.response.length > 1 || isListCmd) {
            for (i = 0; i < data.response.length; i++) {
                vmList += `<li style="list-style: auto;
                margin-bottom: -2rem;margin-top:2rem">${data.response[i].name}</li>
                <ul>
                <li>Machine Type : ${data.response[i].machineType}</li>
                <li>Disk Size : ${data.response[i].disks[0].diskSizeGb}gb</li>
                <li>Zone : ${data.response[i].zone}</li></ul>`;

            }
            const chatLi = document.createElement('li');
            chatLi.classList.add('chat', 'finalIncoming');
            const vmListElement = `<h6><center>VM's list.</center></h6>
            <ul style="margin-top: -1rem;margin-bottom: 1rem;list-style: disc !important;white-space: pre-line !important;">
            ${vmList}
            </ul><button class = "btn btn-primary" style="margin-top: -1rem;
            margin-bottom: 1rem;
            list-style: auto;width: 12rem;
            margin-left: 12rem;" id="${id}"></button>`
            chatLi.innerHTML = vmListElement;
            chatbox.appendChild(chatLi);
            const downloadLink = downloadJSON(data, 'exam\ple.json', id);
        }
        else {
            const chatLi = document.createElement('li');
            chatLi.classList.add('chat', 'finalIncoming');
            const respElement = `<p style='margin-left: -16px;'>VM is created successfully with below configurations.</p><h6>Configurations</h6>
        <ul style="margin-top: -1rem;margin-bottom: 1rem;list-style: disc !important;white-space: pre-line !important;">
        <li>Name : ${respo.name}</li>
        <li>Machine Type : ${respo.machineType}</li>
        <li>Disk Size : ${respo.disks[0].diskSizeGb}gb</li>
        <li>Zone : ${respo.zone}</li>
        </ul><button class = "btn btn-primary" style="margin-top: -1rem;
        margin-bottom: 1rem;
        list-style: auto;width: 12rem;
        margin-left: 15rem;" id="${id}"></button>`
            chatLi.innerHTML = respElement;
            chatbox.appendChild(chatLi);
            const downloadLink = downloadJSON(data, 'exam\ple.json', id);
        }
        vmList = "";
        
    }
    else if(data.status === 200){
        arr = data.response;
        let li = ""
        if (arr.length > 0) {
            for (i = 0; i < arr.length; i++) {
                li = `<li>${arr[i]}</li>`;
            }
        }
        const chatLi = document.createElement('li');
        chatLi.classList.add('chat', 'finalIncoming');
        const respElement = `<p>VM is not avialable to delete, for your reference please see the list of availabe VM's</p><ul style="margin-top: -1rem;
        margin-bottom: 1rem;
        list-style: auto !important;">${li}</ul><button class = "btn btn-primary" style="margin-top: -1rem;
        margin-bottom: 1rem;
        list-style: auto;width: 12rem;
        margin-left: 15rem;" id="${id}"></button>`
        chatLi.innerHTML = respElement;
        chatbox.appendChild(chatLi);
        //chatbox.appendChild(createChatLi("VM is not avialable to delete, for your reference please see the list of availabe VM's", 1,id,arr));
        chatbox.scrollTo(0, chatbox.scrollHeight);
        const downloadLink = downloadJSON(data, 'exam\ple.json', id);
    }

    // Download JSON file
}
const handleChat = () => {
    const form = document.getElementById('myForm');
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;
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
        .then(response => {
            if (response.status == 500) {
                setTimeout(() => {
                    const incomingChatLi = createChatLi("we are processing your request! please wait or check your internet connection.", "incoming");
                    chatbox.appendChild(incomingChatLi);
                    chatbox.scrollTo(0, chatbox.scrollHeight);
                    sendChatBtn.style.pointerEvents = 'auto';
                    chatbox.removeChild(spinDiv);
                }, 3000);
            }
            else return response.json();
        })
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
    if (sendChatBtn.style.pointerEvents != 'none') {
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleChat();
        }
    }
});
sendChatBtn.addEventListener("click", handleChat);
const clearAll = (id) => {
    const endpoint = "http://127.0.0.1:5000/checkFileExists"
    fetch(endpoint, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            if (data.status == 200) {
                btnDiv = document.querySelector('.btnDiv')
                setTimeout(() => { btnDiv.remove(); }, 1000)
                executeCommand(data.fileName, executeMessage)
            }
            else {
                modalBox.classList.add('show');
                modalBox.style.display = 'block';
            }
        })
}
const saveFile = () => {
    const inputFiles = document.getElementById("myFile");
    inputFile = inputFiles.files[0].name;
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
    // function for execute CLI cmd

}
const checkResp = (data) => {
    if ('error' in data) {
        alert("Please upload your credentials file, It's required!")
    }
    else {
        btnDiv = document.querySelector('.btnDiv')
        btnDiv.remove();
        executeCommand(inputFile, executeMessage);
    }
}

const closeModal = () => {
    modalBox.classList.remove('show');
    modalBox.style.display = 'none';
    document.getElementById("myFile").value = '';
}
const crossModal = () => {
    modalBox.classList.remove('show');
    modalBox.style.display = 'none';
    document.getElementById("myFile").value = '';
}
