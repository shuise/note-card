import './Card.css';

export default function C2Card({ content, index, date }) {
  return (
    <div className="card c2">
      <div className="c2-seal">
        <span>逃禅</span>
      </div>
      <div className="c2-top-ripples">
        <span />
        <span />
      </div>
      <div className="c2-branch">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="c2-content-wrap">
        <div className="card-content">{content}</div>
      </div>
      <div className="c2-bamboo">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="c2-mid-ripples">
        <span />
        <span />
        <span />
      </div>
      <div className="c2-bottom-ripples">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="card-date">{date}</div>
      <div className="card-number">{String(index + 1).padStart(2, '0')}</div>
    </div>
  );
}
