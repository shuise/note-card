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
import { saveCardsToServer } from './utils/saveCards';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [currentStyle, setCurrentStyle] = useState('blue');
  const [currentTemplate, setCurrentTemplate] = useState('c2');
  const [saveMessage, setSaveMessage] = useState('');

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

    const cards = document.querySelectorAll('.card');

    if (cards.length === 0) {
      window.alert('没有卡片可保存');
      return;
    }

    try {
      const total = await saveCardsToServer(cards, currentTemplate);
      const message = `成功保存 ${total} 张卡片到 cards 文件夹`;
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
        />
      </div>

      <SaveSection onSave={handleSave} disabled={!text.trim()} />
    </div>
  );
}

export default App;
