import './Card.css';

export default function C2Card({ content, date, sealText, backdropStyle }) {
  return (
    <div className="card c2">
      <div className="card-backdrop" style={backdropStyle} />
      <div className="c2-seal">
        <span>{sealText}</span>
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
    </div>
  );
}
