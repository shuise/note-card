import './Controls.css';

const TEMPLATES = [
  { id: 'c1', label: 'C1 现有款' },
  { id: 'c2', label: 'C2 禅意款' },
];

const STYLES = ['blue', 'green', 'orange', 'purple'];

export default function ControlsHeader({
  currentTemplate,
  currentStyle,
  onTemplateChange,
  onStyleChange,
}) {
  return (
    <div className="controls-header">
      <div className="control-group">
        <div className="control-label">卡片模板</div>
        <div className="template-selector">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              className={`template-option${
                currentTemplate === template.id ? ' active' : ''
              }`}
              onClick={() => onTemplateChange(template.id)}
            >
              {template.label}
            </button>
          ))}
        </div>
      </div>
      <div className="control-group">
        <div className="control-label">颜色</div>
        <div
          className={`style-selector${
            currentTemplate !== 'c1' ? ' hidden' : ''
          }`}
        >
          {STYLES.map((style) => (
            <button
              key={style}
              type="button"
              className={`style-option ${style}${
                currentStyle === style ? ' active' : ''
              }`}
              aria-label={`${style} 主题`}
              onClick={() => onStyleChange(style)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
