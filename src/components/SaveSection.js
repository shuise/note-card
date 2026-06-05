import { useState } from 'react';
import './SaveSection.css';

export default function SaveSection({ onSave, disabled }) {
  const [saving, setSaving] = useState(false);

  async function handleClick() {
    if (disabled || saving) {
      return;
    }

    setSaving(true);

    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="save-section">
      <button
        type="button"
        className="save-button"
        onClick={handleClick}
        disabled={disabled || saving}
      >
        {saving ? '正在保存…' : '生成并保存卡片'}
      </button>
    </div>
  );
}
