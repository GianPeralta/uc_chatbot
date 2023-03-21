
const chatOutput = document.querySelector('#chat-output');
const userInput = document.querySelector('#user-input');
const inputButton = document.querySelector('#chat-submit');

function getTime(){
  const now = new Date();
  const currentTime = now.getTime();
  const date = new Date(currentTime);
  const time = date.toLocaleTimeString();
  return time;
}

function thinking(uDisable, uPlaceholder, uBcolor, iBcolor, iDisable){
  userInput.disabled = uDisable;
  userInput.placeholder= uPlaceholder;
  userInput.style.backgroundColor = uBcolor;
  inputButton.style.backgroundColor = iBcolor;
  inputButton.disabled = iDisable;
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
    thinking(true, 'Jaguar is thinking...', '#a9a9a9', 'rgb(132 133 132)', true);
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
    
          // check if message contains a link
          const linkRegex = /((http|https):\/\/[^\s]+)/g;
          const linkMatch = message.match(linkRegex);
          if (linkMatch) {
            const link = linkMatch[0];
            const linkElement = document.createElement('a');
            linkElement.href = link;
            linkElement.textContent = link;
            linkElement.target = '_blank';
            messageText.textContent = message;
            messageText.append(document.createElement("br"), document.createElement("br"), "Click here: ", linkElement);
          }
    
          thinking(false, 'Ask Jaguar...', '#b0d1b0', '#135c13', false);
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

let conversationHistory = `System: The AI Assistant, Jaguar, would speak with the user using this language: \n`;
async function sendMessage(event) {
  event.preventDefault();
  console.log(conversationHistory);
  const userMessage = userInput.value.trim();
  if (!userMessage) {
    return;
  }
  userInput.value = '';
  thinking(true, 'Jaguar is thinking...', '#a9a9a9', 'rgb(132 133 132)', true);


  addMessageToChat(userMessage, false);
  const prompt = `${conversationHistory}User: ${userMessage}\nAssistant: `;
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
      conversationHistory = `${conversationHistory}User: ${userMessage}\nAssistant: ${botMessage}\n`;
      addMessageToChat(botMessage);
    } else {
      console.error(data);
      $('#chat-output').children().last().remove();
      let error = "I'm sorry. Something happened. Please try to reload the website. " + data.error.message;
      addMessageToChat(error);
    }
    
  } catch (error) {
    console.error(error);
    $('#chat-output').children().last().remove();
    addMessageToChat("I'm sorry. Something happened. Please try to reload the website. " + error);
  }
  
}

const currentTime = getTime();
const newTime = currentTime.replace(':', ' ');
let hour = parseInt(newTime.split(' ')[0]);
const meridian = newTime.split(' ')[2];
if(hour == 12){
  hour = 0;
}
const greeting = `Good ${meridian =='AM' ? 'morning' : hour >= 0 && hour < 7 ? 'afternoon' : 'evening'}. Thank you for visiting the University of the Cordilleras website. Which language would you like me to use?`;
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