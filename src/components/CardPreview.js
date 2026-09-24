import C1Card from './C1Card';
import C2Card from './C2Card';
import { getChineseDate, getCurrentDate, getSolarTerm } from '../utils/content';
import './CardPreview.css';

// 底图取景：原图按 BACKDROP_SCALE 缩放后铺开（控制底图元素大小），
// 每张卡片露出其中一个取景框（360×500），取景框相邻略有重叠，合起来正好覆盖整张图，
// 卡片多于取景框总数时循环。
// backdropSeed 由 App 在每次生成卡片时更新，用来随机起始取景框，让每次的前几张卡片都不一样。
const BACKDROP_SIZE = { width: 1500, height: 2250 };
const BACKDROP_SCALE = 0.8;
const BACKDROP = {
  width: Math.round(BACKDROP_SIZE.width * BACKDROP_SCALE),
  height: Math.round(BACKDROP_SIZE.height * BACKDROP_SCALE),
};
const CARD_BOX = { width: 360, height: 500 };
const BACKDROP_COLUMNS = Math.ceil(BACKDROP.width / CARD_BOX.width);
const BACKDROP_ROWS = Math.ceil(BACKDROP.height / CARD_BOX.height);
const BACKDROP_TOTAL = BACKDROP_COLUMNS * BACKDROP_ROWS;
const BACKDROP_STEP_X = (BACKDROP.width - CARD_BOX.width) / (BACKDROP_COLUMNS - 1);
const BACKDROP_STEP_Y = (BACKDROP.height - CARD_BOX.height) / (BACKDROP_ROWS - 1);

function getBackdropStyle(index, seed) {
  const slot = (index + seed) % BACKDROP_TOTAL;
  const column = slot % BACKDROP_COLUMNS;
  const row = Math.floor(slot / BACKDROP_COLUMNS);

  return {
    backgroundSize: `${BACKDROP.width}px ${BACKDROP.height}px`,
    backgroundPosition: `-${Math.round(column * BACKDROP_STEP_X)}px -${Math.round(
      row * BACKDROP_STEP_Y
    )}px`,
  };
}

export default function CardPreview({
  chunks,
  currentTemplate,
  currentStyle,
  backdropSeed,
}) {
  const chineseDate = getChineseDate();
  const currentDate = getCurrentDate();
  // 印章文字取当天所处节气
  const solarTerm = getSolarTerm();

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
                backdropStyle={getBackdropStyle(index, backdropSeed)}
              />
            ) : (
              <C2Card
                key={index}
                content={chunk}
                date={currentDate}
                sealText={solarTerm}
                backdropStyle={getBackdropStyle(index, backdropSeed)}
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
