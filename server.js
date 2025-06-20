const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));  // public 폴더 정적 제공

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/website.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
