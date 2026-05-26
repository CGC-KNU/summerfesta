const express = require('express');
const path = require('path');
const app = express();

// 정적 파일 제공
app.use(express.static('.'));

// 모든 경로를 index.html로 리다이렉트 (SPA 라우팅)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});