import './InputSection.css';

export default function InputSection({ value, onChange }) {
  return (
    <section className="input-section">
      <label className="sr-only" htmlFor="inputText">
        卡片文本
      </label>
      <textarea
        id="inputText"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="请输入文本……"
      />
    </section>
  );
}
