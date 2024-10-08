const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');
const cheerio = require('cheerio');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/reason', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500
    });
    res.json({ result: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Error calling OpenAI API' });
  }
});

app.get('/api/scrape', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ja&gl=JP&ceid=JP:ja`);
    const $ = cheerio.load(response.data, { xmlMode: true });
    const results = $('item').slice(0, 5).map((_, element) => ({
      title: $(element).find('title').text().trim(),
      snippet: $(element).find('description').text().trim(),
      url: $(element).find('link').text().trim(),
      pubDate: new Date($(element).find('pubDate').text().trim())
    })).get().sort((a, b) => b.pubDate - a.pubDate);
    res.json(results);
  } catch (error) {
    console.error('Error scraping information:', error);
    res.status(500).json({ error: 'Error scraping information' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));