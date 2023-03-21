
const chatOutput = document.querySelector('#chat-output');
const userInput = document.querySelector('#user-input');
const inputButton = document.querySelector('#chat-submit');
const suggestionContainer = document.getElementById("suggestion-container");

function getTime(){
  const now = new Date();
  const currentTime = now.getTime();
  const date = new Date(currentTime);
  const time = date.toLocaleTimeString();
  return time;
}

function thinking(uDisable, uPlaceholder, uBcolor, iBcolor, iDisable, sDisplay){
  userInput.disabled = uDisable;
  userInput.placeholder= uPlaceholder;
  userInput.style.backgroundColor = uBcolor;
  inputButton.style.backgroundColor = iBcolor;
  inputButton.disabled = iDisable;
  suggestionContainer.style.display = sDisplay;
}

function addMessageToChat(message, isBot = true) {
  
  const timestamp = getTime();
  const messageClass = isBot ? 'bot-message' : 'user-message';
  const messageName = isBot ? 'Jaguar' : 'Me';
  const imagee = isBot ? 'img_/jaguar_bot.png' : 'img_/boy.png';
  const altee = isBot ? 'jaguar' : 'boy';
  const messageBubble = `<div class="${messageClass}" >
                            <div class="timestamp"> ${messageName} | ${timestamp}</div>
                            <div class="message">
                              <img src="${imagee}" alt="${altee}" height="30px" width="30px" style="float:left; margin-right: 7px; padding: 3px; background-color: white; border-radius: 50%;"/>
                              <span class="typing-indicator"></span>
                            </div>
                          </div>
                        `;
  chatOutput.insertAdjacentHTML('beforeend', messageBubble);
  chatOutput.scrollTop = chatOutput.scrollHeight;
 

  if (isBot) {
    thinking(true, 'Jaguar is thinking...', '#a9a9a9', 'rgb(132 133 132)', true, 'none');
    const messageText = chatOutput.lastElementChild.querySelector('.message');
    const typingIndicator = messageText.querySelector('.typing-indicator');
    const characters = message.split('');
    if(message === "."){
      typingIndicator.textContent = message;
      setInterval(() => {
        if(typingIndicator.textContent === "..."){
          typingIndicator.textContent = "";
        }
        typingIndicator.textContent += ".";
      }, 800)
    }else{
      let i = 0;
      const intervalId = setInterval(() => {
        typingIndicator.textContent += characters[i];
        i++;
        if (i === characters.length) {
          clearInterval(intervalId);
          thinking(false, 'Ask Jaguar...', '#b0d1b0', '#135c13', false, 'flex');
          userInput.focus();
        }
        chatOutput.scrollTop = chatOutput.scrollHeight;
      }, 30)
    }
  }else {
    const messageText = chatOutput.lastElementChild.querySelector('.message');
    const typingIndicator = messageText.querySelector('.typing-indicator');
    typingIndicator.textContent += message;
  }

}

let conversationHistory = `You are a chatbot named Jaguar. You answer questions and topics in a  very friendly, smart, and understanding way.\n
You are designed to assist inquiries related to the University of the Cordilleras or UC.\n
You can only answer anything related to or concerning the University of the Cordilleras or UC.\n
You cannot answer any other input, question, concern, and inquiries note related or concerning the University of the Cordilleras.\n
You are developed by Gian, a Web Developer at the University of the Cordilleras.\n
You speak all languages.\n
If the user chose to change your language, continue to answer the user using the different chosen language and not English or any other language.
The current president is Dr. Nancy Flores.\n

Updating the UC Portal or Canvas password can only be done by proceeding to the MIS department.\n

Updating the UC App password can only be done filling out a form to reset UC App password: https://bit.ly/reset-ucapp_password only. \n`;

async function sendMessage(event) {
  event.preventDefault();
  console.log(conversationHistory);
  const userMessage = userInput.value.trim();
  if (!userMessage) {
    return;
  }
  userInput.value = '';
  thinking(true, 'Jaguar is thinking...', '#a9a9a9', 'rgb(132 133 132)', true, 'none');


  addMessageToChat(userMessage, false);
  const prompt = `${conversationHistory}user: ${userMessage}\nbot: `;
  
  //const prompt = `${init}\nUser:${userMessage}\nBot:`;
  addMessageToChat(".");
  try {
    /*
    const response = await fetch(COMPLETIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL_ENGINE,
        messages: [{role: "user", content: prompt}],
        //prompt: prompt,
        max_tokens: 500, 
        temperature: 0
      })
      
    });
    */
    const response  = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt
        })
      })

    const data = await response.json();

    if (response.ok) {
      //const botMessage = data.choices[0].message.content.trim();
      $('#chat-output').children().last().remove();
      
      const botMessage = data.bot.trim();
      conversationHistory = `${conversationHistory}user: ${userMessage}\nbot: ${botMessage}\n`;
      addMessageToChat(botMessage);
    } else {
      console.error(data);
      $('#chat-output').children().last().remove();
      let error = "Something happened. Please try to reload the website. " + data.error.message;
      addMessageToChat(error);
    }
    
  } catch (error) {
    console.error(error);
    $('#chat-output').children().last().remove();
    addMessageToChat("Something happened. Please try to reload the website. " + error);
  }
  
}
const suggestions = [
  "Change Jaguar's language",
  "Reset Password",
  "What is the tuition fee at UC?",
  "What are the requirements for applying to UC?",
];

suggestionContainer.innerHTML = "";
suggestions.forEach((suggestion) => {
  const suggestionButton = document.createElement("button");
  suggestionButton.textContent = suggestion;
  suggestionButton.addEventListener("click", () => {
    userInput.value = suggestion;
    sendMessage(event);
  });
  suggestionContainer.appendChild(suggestionButton);
});

const currentTime = getTime();
const newTime = currentTime.replace(':', ' ');
let hour = parseInt(newTime.split(' ')[0]);
const meridian = newTime.split(' ')[2];
if(hour == 12){
  hour = 0;
}
const greeting = `Good ${meridian =='AM' ? 'morning' : hour >= 0 && hour < 7 ? 'afternoon' : 'evening'}. Thank you for visiting the University of the Cordilleras website. How may I help you?`;
addMessageToChat(greeting);

const chatbot = document.querySelector('#chatbot');
const chatbotToggle = document.querySelector('#chatbot-toggle');
$(chatbotToggle).click(function(){
  $(chatbot).show(750);
  $(chatbotToggle).hide(100);
});
$('.header').click(function(){
  $(chatbot).hide(750);
  $(chatbotToggle).show(950);
  $(chatbotToggle).find('span').show();
});

