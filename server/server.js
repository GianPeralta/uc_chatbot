import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';


const MODEL_ENGINE = 'gpt-3.5-turbo';
//const COMPLETIONS_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

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
        message: 'Hello from Codex',
    })
});

app.post('/', async (req, res) => {
    try{
        var prompt = req.body.prompt;
        
        const response = await openai.createChatCompletion({
            model: MODEL_ENGINE,
            messages: [{role: "user", content: prompt}],
            temperature: 0,
            max_tokens: 500,
        })
     
        res.status(200).send({
            bot: response.config
        })
    } catch(error) {
        console.log(error);
        res.status(500).send({ error })
    }

})

app.listen(5000, () => console.log("Server is running on port http://localhost:5000"))