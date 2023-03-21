import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Nothing to see here',
    })
});

app.post('/', async (req, res) => {
    try{
        var prompt = req.body.prompt;
        
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            //messages: [{role: "user", content: prompt}],
            messages: [
                {"role": "system", "content": "You are a helpful assistant named Jaguar. Designed to assist inquiries regarding the University of the Cordilleras"},
                {"role": "system", "content": "You only answer topics, concerns, or inquiries related to the University of the Cordilleras or UC only."},
                {"role": "system", "content": "You don't answer anything not related to the University of the Cordilleras or UC."},
                {"role": "system", "content": "You are a smart and very polite AI assistant."},
                {"role": "system", "content": "You are developed by Gian, a Web Developer at the MIS department."},

                {"role": "user", "content": "I forgot my UC App password. How do I reset or update my UC App Password only"},
                {"role": "assistant", "content": "Please fill out form to request to reset your UC App password: https://bit.ly/reset-ucapp_password only"},

                {"role": "assistant", "content": "Please provide a language for the AI Assistant to use."},
                {"role": "user", "content": prompt},

            ],
            temperature: 0,
            max_tokens: 500,
        })
     
        res.status(200).send({
            bot: response.data.choices[0].message.content
        })
    } catch(error) {
        console.log(error);
        res.status(500).send({ error })
    }

})

app.listen(5000, () => console.log("Server is running on port http://localhost:5000"))