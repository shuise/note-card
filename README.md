# Note Card

将文本拆分为卡片并导出 PNG 的单页应用。

## 技术栈

- [Create React App](https://create-react-app.dev/)（React 18）
- Express API（保存卡片图片）
- html2canvas（DOM 转 PNG）

## 项目结构

```
note-card/
├── public/              # 静态资源（index.html、字体）
├── src/
│   ├── components/      # UI 组件
│   ├── utils/           # 文本拆分、存储、导出
│   ├── App.js
│   └── index.js
├── server.js            # Express API
└── cards/               # 导出的 PNG（gitignore）
```

## 开发

本项目使用 [Create React App](https://create-react-app.dev/)，推荐用 **pnpm** 安装依赖（已配置 `node-linker=hoisted`，避免 React 解析错误）。

同时启动 CRA 开发服务器与 API：

```bash
pnpm install
pnpm run dev
```

- 前端：http://localhost:3000
- API：http://localhost:3001（通过 `package.json` 的 `proxy` 转发）

## 生产

```bash
npm run prod
```

构建 React 应用并由 Express 在 `PORT`（默认 3001）托管。

## 文本规则

- 用 `----` 分隔卡片，每个区块生成一张卡片，不做自动分页
