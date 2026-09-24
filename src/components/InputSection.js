import './InputSection.css';

const PLACEHOLDER = `第一张卡片内容

----

第二张卡片内容

----

.....`;

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
        placeholder={PLACEHOLDER}
      />
    </section>
  );
}
