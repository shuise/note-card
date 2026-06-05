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

function splitSection(section, maxLength) {
  const chunks = [];
  let currentChunk = '';
  let sentenceBuffer = '';

  function flushSentence() {
    if (!sentenceBuffer) {
      return;
    }

    const testChunk = currentChunk + sentenceBuffer;

    if (testChunk.length <= maxLength || !currentChunk) {
      currentChunk = testChunk;
    } else {
      chunks.push(currentChunk);
      currentChunk = sentenceBuffer;
    }

    sentenceBuffer = '';
  }

  for (const char of section) {
    sentenceBuffer += char;

    if (char === '。') {
      flushSentence();
    }
  }

  flushSentence();

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function stripLeadingNewlines(text) {
  return text.replace(/^[\r\n]+/, '');
}

export function splitContent(content) {
  const contentText = content.trim();
  const maxLength = 200;
  const sections = contentText
    .split(/\s*---\s*/)
    .map((section) => section.trim())
    .filter(Boolean);
  const chunks = [];

  sections.forEach((section) => {
    const sectionChunks = splitSection(section, maxLength);

    if (sectionChunks.length) {
      chunks.push(...sectionChunks);
    } else if (section) {
      chunks.push(section);
    }
  });

  if (!chunks.length && contentText) {
    chunks.push(contentText);
  }

  return chunks
    .map(stripLeadingNewlines)
    .filter((chunk) => chunk.length > 0);
}

export function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
