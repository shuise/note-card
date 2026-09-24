const CHINESE_NUMS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function toChineseYear(value) {
  return String(value)
    .split('')
    .map((digit) => CHINESE_NUMS[parseInt(digit, 10)])
    .join('');
}

function toChineseMonth(value) {
  if (value <= 10) return CHINESE_NUMS[value];
  if (value < 20) return `十${CHINESE_NUMS[value - 10]}`;
  return '十二';
}

function toChineseDay(value) {
  if (value <= 10) return CHINESE_NUMS[value];
  if (value < 20) return `十${CHINESE_NUMS[value - 10]}`;
  if (value === 20) return '二十';
  if (value < 30) return `二十${CHINESE_NUMS[value - 20]}`;
  if (value === 30) return '三十';
  return '三十一';
}

export function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${year}年${month}月${day}日`;
}

export function getChineseDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${toChineseYear(year)}年 ${toChineseMonth(month)}月 ${toChineseDay(day)}日`;
}

// 二十四节气起始日期（来源：四季二十四节气一览.md），按公历先后排列
const SOLAR_TERMS = [
  { month: 1, day: 5, name: '小寒' },
  { month: 1, day: 20, name: '大寒' },
  { month: 2, day: 3, name: '立春' },
  { month: 2, day: 18, name: '雨水' },
  { month: 3, day: 5, name: '惊蛰' },
  { month: 3, day: 20, name: '春分' },
  { month: 4, day: 4, name: '清明' },
  { month: 4, day: 19, name: '谷雨' },
  { month: 5, day: 5, name: '立夏' },
  { month: 5, day: 20, name: '小满' },
  { month: 6, day: 5, name: '芒种' },
  { month: 6, day: 21, name: '夏至' },
  { month: 7, day: 6, name: '小暑' },
  { month: 7, day: 22, name: '大暑' },
  { month: 8, day: 7, name: '立秋' },
  { month: 8, day: 22, name: '处暑' },
  { month: 9, day: 7, name: '白露' },
  { month: 9, day: 22, name: '秋分' },
  { month: 10, day: 8, name: '寒露' },
  { month: 10, day: 23, name: '霜降' },
  { month: 11, day: 7, name: '立冬' },
  { month: 11, day: 22, name: '小雪' },
  { month: 12, day: 6, name: '大雪' },
  { month: 12, day: 21, name: '冬至' },
];

// 取日期所在的节气：每个节气从起始日持续到下一个节气前一天；1月1-4日仍属冬至
export function getSolarTerm(date = new Date()) {
  const key = (date.getMonth() + 1) * 100 + date.getDate();
  let current = SOLAR_TERMS[SOLAR_TERMS.length - 1];

  for (const term of SOLAR_TERMS) {
    if (term.month * 100 + term.day > key) {
      break;
    }

    current = term;
  }

  return current.name;
}

const SECTION_SEPARATOR = /\s*-{4,}\s*/;

export function splitContent(content) {
  const contentText = content.trim();

  if (!contentText) {
    return [];
  }

  return contentText
    .split(SECTION_SEPARATOR)
    .map((section) => section.trim())
    .filter(Boolean);
}

export function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
