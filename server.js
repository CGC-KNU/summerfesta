const express = require("express");
const path = require("path");

const app = express();

const SITE_DIR = path.join(__dirname, "GitHub_업로드용");

app.use(express.static(SITE_DIR));

// SPA 라우팅/직접 접근 모두 index.html로 처리
app.get("*", (req, res) => {
  res.sendFile(path.join(SITE_DIR, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

