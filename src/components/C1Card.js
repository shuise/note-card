import { useMemo } from 'react';
import { seededRandom } from '../utils/content';
import './Card.css';

function Petal({ seed }) {
  const top = seededRandom(seed * 4 + 1) * 60 + 5;
  const left = seededRandom(seed * 4 + 2) * 80 + 5;
  const rotate = seededRandom(seed * 4 + 3) * 180 - 90;
  const width = seededRandom(seed * 4 + 4) * 15 + 12;
  const height = seededRandom(seed * 4 + 5) * 8 + 8;
  const opacity = seededRandom(seed * 4 + 6) * 0.3 + 0.3;

  return (
    <div
      className="petal"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: `rotate(${rotate}deg)`,
        width: `${width}px`,
        height: `${height}px`,
        opacity,
      }}
    />
  );
}

export default function C1Card({ content, index, style, date, backdropStyle }) {
  const petals = useMemo(
    () => [0, 1, 2, 3].map((petalIndex) => index * 10 + petalIndex),
    [index]
  );

  return (
    <div className={`card c1 ${style}`}>
      <div className="card-backdrop" style={backdropStyle} />
      {petals.map((seed) => (
        <Petal key={seed} seed={seed} />
      ))}
      <div className="card-content">{content}</div>
      <div className="card-date">{date}</div>
    </div>
  );
}
