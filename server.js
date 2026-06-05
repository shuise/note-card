const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const cardsDir = path.join(__dirname, 'cards');
fs.ensureDirSync(cardsDir);

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

app.post('/api/save-card', async (req, res) => {
  try {
    const { imageData, index, total } = req.body;

    if (index === 0) {
      await fs.emptyDir(cardsDir);
    }

    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const dateStr = getCurrentDate();
    const fileName = `card_${index + 1}_${dateStr}.png`;
    const filePath = path.join(cardsDir, fileName);

    await fs.writeFile(filePath, buffer);

    if (index === total - 1) {
      res.json({
        success: true,
        message: `成功保存 ${total} 张卡片到 cards 文件夹`,
      });
    } else {
      res.json({
        success: true,
        message: `保存卡片 ${index + 1} 成功`,
      });
    }
  } catch (error) {
    console.error('保存失败:', error);
    res.status(500).json({ success: false, message: '保存失败' });
  }
});

if (isProduction) {
  const buildDir = path.join(__dirname, 'build');
  app.use(express.static(buildDir));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`API 服务器运行在 http://localhost:${PORT}`);
  console.log(`卡片将保存到: ${cardsDir}`);

  if (isProduction) {
    console.log(`生产模式：同时托管 React 构建产物`);
  } else {
    console.log('开发模式：请配合 npm start 使用，API 请求通过 CRA proxy 转发');
  }
});
