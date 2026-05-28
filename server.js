const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// 确保 cards 文件夹存在
const cardsDir = path.join(__dirname, 'cards');
fs.ensureDirSync(cardsDir);

// 获取当前日期字符串
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 保存卡片图片
app.post('/api/save-card', async (req, res) => {
    try {
        const { imageData, index, total } = req.body;
        
        // 移除 data:image/png;base64, 前缀
        const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // 生成文件名
        const dateStr = getCurrentDate();
        const fileName = `card_${index + 1}_${dateStr}.png`;
        const filePath = path.join(cardsDir, fileName);
        
        // 保存文件
        await fs.writeFile(filePath, buffer);
        
        // 如果是最后一个文件，返回成功
        if (index === total - 1) {
            res.json({ success: true, message: `成功保存 ${total} 张卡片到 cards 文件夹` });
        } else {
            res.json({ success: true, message: `保存卡片 ${index + 1} 成功` });
        }
    } catch (error) {
        console.error('保存失败:', error);
        res.status(500).json({ success: false, message: '保存失败' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`卡片将保存到: ${cardsDir}`);
});