
const chatOutput = document.querySelector('#chat-output');
const userInput = document.querySelector('#user-input');
const inputButton = document.querySelector('#chat-submit');

//let conversationHistory = '';

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

  if(isBot == true){
    thinking(true, 'Jaguar is thinking...', '#a9a9a9', 'rgb(132 133 132)', true);

    const messageText = chatOutput.lastElementChild.querySelector('.message');
    const typingIndicator = messageText.querySelector('.typing-indicator');
    const characters = message.split('');
    let i = 0;
    const intervalId = setInterval(() => {
      typingIndicator.textContent += characters[i];
      i++;
      if (i === characters.length) {
        clearInterval(intervalId);
        thinking(false, 'Ask Jaguar...', '#b0d1b0', '#135c13', false);
        userInput.focus();
        
      }
      chatOutput.scrollTop = chatOutput.scrollHeight;
    }, 30);
  }else {
    const messageText = chatOutput.lastElementChild.querySelector('.message');
    const typingIndicator = messageText.querySelector('.typing-indicator');
    typingIndicator.textContent += message;
  }

}


async function sendMessage(event) {
  event.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) {
    return;
  }
  userInput.value = '';
  thinking(true, 'Jaguar is thinking...', '#a9a9a9', 'rgb(132 133 132)', true);

  addMessageToChat(userMessage, false);
  //const prompt = `${init}${conversationHistory}${userMessage}\nBot:`;
  const init = `You are a chatbot named Jaguar. You answer questions and topics in a  very friendly, smart, and understanding way.\n
                You are designed to assist inquiries related to the University of the Cordilleras.\n
                You can only answer anything related to or concerning the University of the Cordilleras.
                You cannot answer any other input, question, concern, and inquiries note related or concerning the University of the Cordilleras.\
                University of the Cordilleras Organization and Administration = Board of Trustees and Executive Council.\n
                You are developed by Gian, a Web Developer at the University of the Cordilleras.\n

                User: How do I reset my password on the UCordilleras Application or UC App.\n
                Bot: You can send a form to reset your UC App password in this form: https://bit.ly/reset-ucapp_password. \n
                
                User: I forgot my canvas password or email. How do I update or reset my Canvas or UC Portal password and email?\n
                Bot: Please proceed to MIS for further assistance on updating your Canvas or UC Portal email or password.\n`;
  const prompt = `${init}\nUser:${userMessage}\nBot:`;

  
  
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
      const botMessage = data.bot.trim();
      addMessageToChat(botMessage);
      //conversationHistory = `${conversationHistory}${userMessage}\nBot:${botMessage}\n`;
    } else {
      console.error(data);
    }
  } catch (error) {
    console.error(error);
  }
  
}

const currentTime = getTime();
const newTime = currentTime.replace(':', ' ');
let hour = parseInt(newTime.split(' ')[0]);
const meridian = newTime.split(' ')[2];
if(hour == 12){
  hour = 0;
}
const greeting = `Good ${meridian =='AM' ? 'morning' : hour >= 0 && hour < 6 ? 'afternoon' : 'evening'}. Thank you for visiting the University of the Cordilleras website. My name is Jaguar, how may I help you?`;
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