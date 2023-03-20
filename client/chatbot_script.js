
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
    let i = 0;
    if(message === "."){
      typingIndicator.textContent = message;
      setInterval(() => {
        if(typingIndicator.textContent === "..."){
          typingIndicator.textContent = "";
        }
        typingIndicator.textContent += ".";
      }, 800)
    }else{
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
            message = message.replace(linkRegex, '');
            messageText.textContent = message;
            messageText.append(linkElement);
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

let conversationHistory = `You are a chatbot named Jaguar. You answer questions and topics in a  very friendly, smart, and understanding way.\n
You are designed to assist inquiries related to the University of the Cordilleras or UC.\n
You can only answer anything related to or concerning the University of the Cordilleras or UC.\n
You cannot answer any other input, question, concern, and inquiries note related or concerning the University of the Cordilleras.\n
University of the Cordilleras Organization and Administration = Board of Trustees and Executive Council.\n
You are developed by Gian, a Web Developer at the University of the Cordilleras.\n
You speak all languages. You will only speak with the user using their chosen language.\n

User: reset or update forgotten Univeristy of the Cordilleras Application password only.\n
Bot: Fill out form to reset UC App password: https://bit.ly/reset-ucapp_password only\n

User: reset or update forgotten Canvas or UC Portal password only.\n
Bot: Please proceed to MIS for further assistance on updating or resetting your Canvas or UC Portal email or password only.\n

You would speak with the user using this language: \n`;

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
  const prompt = `${conversationHistory}User: ${userMessage}\nBot: `;
  
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
    const response  = await fetch('https://uc-chatbot-v2.onrender.com', {
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
      $('#chat-output').children().last().remove();;
      
      const botMessage = data.bot.trim();
      conversationHistory = `${conversationHistory}User: ${userMessage}\nBot: ${botMessage}\n`;
      addMessageToChat(botMessage);
    } else {
      console.error(data);
      let error = "Something happened. Please try to reload the website. " + data.error.message;
      addMessageToChat(error);
    }
    
  } catch (error) {
    console.error(error);
    addMessageToChat("Something happened. Please try to reload the website. " + error);
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