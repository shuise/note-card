import qrcode from 'qrcode-generator';

// 库里默认按单字节（Latin-1）编码，含中文的链接会扫出乱码，这里换成 UTF-8
qrcode.stringToBytes = function stringToBytes(text) {
  const bytes = [];

  for (const char of text) {
    const code = char.codePointAt(0);

    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code < 0x10000) {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    } else {
      bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      );
    }
  }

  return bytes;
};

// 只认 http(s):// 和 www. 开头的链接，避免把普通句子当链接
// 中文标点（句号/逗号/顿号等）在正文里通常紧跟链接，不能算进链接本身
const URL_PATTERN =
  /(?:https?:\/\/|www\.)[^\s<>"'“”‘’（）。，、；：！？…【】《》〔〕「」『』]+/gi;
// 链接末尾常被英文标点或右括号黏住，扫描前去掉
const TRAILING_PUNCTUATION = /[.,;:!?…·'"”’)\]}】》>]+$/;

const QR_DISPLAY_SIZE = 96;
// 生成位图按 2 倍展示尺寸，导出（scale 2）时二维码依然清晰
const QR_TARGET_PIXELS = QR_DISPLAY_SIZE * 2;
// 二维码四周的静区（按模块数），太小会影响扫码
const QR_PADDING_MODULES = 2;
const QR_DARK = '#3b322a';
const QR_LIGHT = '#fbf7ee';

function normalizeUrl(url) {
  return /^www\./i.test(url) ? `https://${url}` : url;
}

// 把内容拆成「文本片段」和「二维码」两类，文本片段保持原有换行
export function splitLinkSegments(content) {
  const text = content || '';

  if (!text) {
    return [];
  }

  const pattern = new RegExp(URL_PATTERN.source, 'gi');
  const segments = [];
  let cursor = 0;
  let match = pattern.exec(text);

  while (match) {
    const url = match[0].replace(TRAILING_PUNCTUATION, '');

    if (!url) {
      pattern.lastIndex = match.index + 1;
      match = pattern.exec(text);
      continue;
    }

    if (match.index > cursor) {
      segments.push({ type: 'text', value: text.slice(cursor, match.index) });
    }

    segments.push({ type: 'qr', value: normalizeUrl(url) });
    cursor = match.index + url.length;
    match = pattern.exec(text);
  }

  if (cursor < text.length) {
    segments.push({ type: 'text', value: text.slice(cursor) });
  }

  // 二维码自己占一行，紧贴它的换行/空白去掉，避免上下多出空行
  return segments
    .map((segment, index) => {
      if (segment.type !== 'text') {
        return segment;
      }

      let value = segment.value;

      if (index > 0 && segments[index - 1].type === 'qr') {
        value = value.replace(/^\s+/, '');
      }

      if (index < segments.length - 1 && segments[index + 1].type === 'qr') {
        value = value.replace(/\s+$/, '');
      }

      return { ...segment, value };
    })
    .filter((segment) => segment.type === 'qr' || segment.value !== '');
}

// 生成二维码位图（PNG dataURL）。html2canvas 对位图 img 支持最好，导出不会丢。
export function createQrDataUrl(text) {
  try {
    const qr = qrcode(0, 'M');

    qr.addData(text);
    qr.make();

    const count = qr.getModuleCount();
    const cellSize = Math.max(
      2,
      Math.round(QR_TARGET_PIXELS / (count + QR_PADDING_MODULES * 2))
    );
    const size = (count + QR_PADDING_MODULES * 2) * cellSize;
    const canvas = document.createElement('canvas');

    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');

    context.fillStyle = QR_LIGHT;
    context.fillRect(0, 0, size, size);
    context.fillStyle = QR_DARK;

    for (let row = 0; row < count; row += 1) {
      for (let col = 0; col < count; col += 1) {
        if (qr.isDark(row, col)) {
          context.fillRect(
            (col + QR_PADDING_MODULES) * cellSize,
            (row + QR_PADDING_MODULES) * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.warn('生成二维码失败:', error);
    return '';
  }
}
