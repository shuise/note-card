import C1Card from './C1Card';
import C2Card from './C2Card';
import { getChineseDate, getCurrentDate } from '../utils/content';
import './CardPreview.css';

export default function CardPreview({ chunks, currentTemplate, currentStyle }) {
  const chineseDate = getChineseDate();
  const currentDate = getCurrentDate();

  return (
    <section className="card-preview">
      <div className="album-container">
        <div className="card-container">
          {chunks.map((chunk, index) =>
            currentTemplate === 'c1' ? (
              <C1Card
                key={index}
                content={chunk}
                index={index}
                style={currentStyle}
                date={chineseDate}
              />
            ) : (
              <C2Card
                key={index}
                content={chunk}
                index={index}
                date={currentDate}
              />
            )
          )}
        </div>
      </div>
      <div className="card-summary">
        {chunks.length === 0 ? '暂无卡片' : `共 ${chunks.length} 张卡片`}
      </div>
    </section>
  );
}
