const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(cors());
app.use(express.json({limit: '10mb'})); // 이미지 base64 전송 지원
require('dotenv').config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/ocr', async (req, res) => {
  const { base64img } = req.body;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `이 이미지는 Shadowverse 카드 목록입니다. 카드의 "이름"과 "개수"만 [카드이름 : 개수] 형태로만 정리해서 보여줘. 예시: "용의신 : 3" 이런 식으로 카드당 한 줄로, 오로지 그 리스트만 반환.`
              },
              {
                type: "image_url",
                image_url: { url: `data:image/png;base64,${base64img}` }
              }
            ]
          }
        ],
        max_tokens: 1024,
        temperature: 0
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    res.json(response.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('서버 시작, 포트:', PORT));
