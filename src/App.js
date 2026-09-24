import { useCallback, useEffect, useMemo, useState } from 'react';
import InputSection from './components/InputSection';
import CardPreview from './components/CardPreview';
import SaveSection from './components/SaveSection';
import { splitContent } from './utils/content';
import {
  loadSavedContent,
  loadSavedStyle,
  loadSavedTemplate,
  saveContent,
} from './utils/storage';
import { saveCards } from './utils/saveCards';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [currentStyle, setCurrentStyle] = useState('blue');
  const [currentTemplate, setCurrentTemplate] = useState('c2');
  const [saveMessage, setSaveMessage] = useState('');
  // 底图起始取景框，每次生成时随机推进，让每次的前几张卡片底图都不一样
  const [backdropSeed, setBackdropSeed] = useState(() =>
    Math.floor(Math.random() * 100)
  );

  useEffect(() => {
    setText(loadSavedContent());
    setCurrentStyle(loadSavedStyle());
    setCurrentTemplate(loadSavedTemplate());
  }, []);

  const chunks = useMemo(() => {
    if (!text.trim()) {
      return [];
    }

    return splitContent(text);
  }, [text]);

  const handleTextChange = useCallback((value) => {
    setText(value);
    saveContent(value);
  }, []);

  const handleSave = useCallback(async () => {
    const trimmed = text.trim();

    if (!trimmed) {
      window.alert('请先输入要生成卡片的文本');
      return;
    }

    if (document.querySelectorAll('.card').length === 0) {
      window.alert('没有卡片可保存');
      return;
    }

    try {
      // 每次生成换一个随机起始取景框（步进 ≥1，保证与上一次不同），等渲染完再导出
      setBackdropSeed((seed) => seed + 1 + Math.floor(Math.random() * 15));
      await new Promise((resolve) => {
        window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
      });

      const cards = document.querySelectorAll('.card');
      const { total, directoryName } = await saveCards(cards, currentTemplate);
      const target = directoryName ? `「${directoryName}」文件夹` : '浏览器下载目录';
      const message = `成功保存 ${total} 张卡片到${target}`;

      setSaveMessage(message);
      window.setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('保存失败:', error);
      window.alert(error.message || '保存失败，请重试');
    }
  }, [text, currentTemplate]);

  return (
    <div className="container">
      <h1>卡片生成器</h1>
      {saveMessage ? <p className="save-message">{saveMessage}</p> : null}

      <div className="workspace">
        <InputSection value={text} onChange={handleTextChange} />
        <CardPreview
          chunks={chunks}
          currentTemplate={currentTemplate}
          currentStyle={currentStyle}
          backdropSeed={backdropSeed}
        />
      </div>

      <SaveSection onSave={handleSave} disabled={!text.trim()} />
    </div>
  );
}

export default App;
