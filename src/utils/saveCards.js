import html2canvas from 'html2canvas';

const CARD_BACKGROUNDS = {
  c1: '#f0ebe5',
  c2: '#f5efe1',
};

const DB_NAME = 'note-card';
const DB_VERSION = 1;
const STORE_NAME = 'directory';
const DIRECTORY_KEY = 'handle';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readSavedDirectory() {
  try {
    const db = await openDatabase();

    return await new Promise((resolve, reject) => {
      const request = db
        .transaction(STORE_NAME, 'readonly')
        .objectStore(STORE_NAME)
        .get(DIRECTORY_KEY);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('读取已保存目录失败:', error);
    return null;
  }
}

async function persistDirectory(handle) {
  const db = await openDatabase();

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');

    transaction.objectStore(STORE_NAME).put(handle, DIRECTORY_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function supportsLocalDirectory() {
  return typeof window.showDirectoryPicker === 'function';
}

async function pickDirectory() {
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });

    await persistDirectory(handle);
    return handle;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('已取消选择保存目录');
    }

    throw error;
  }
}

async function resolveDirectory() {
  const saved = await readSavedDirectory();

  if (saved) {
    const options = { mode: 'readwrite' };
    const permission = await saved.queryPermission(options);

    if (permission === 'granted') {
      return saved;
    }

    if ((await saved.requestPermission(options)) === 'granted') {
      return saved;
    }
  }

  return pickDirectory();
}

function getDateSuffix() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${now.getFullYear()}-${month}-${day}`;
}

function resolveBackgroundColor(card, fallback) {
  const { backgroundColor } = window.getComputedStyle(card);

  if (!backgroundColor || backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
    return fallback;
  }

  return backgroundColor;
}

async function renderCardImage(card, backgroundColor) {
  const canvas = await html2canvas(card, {
    scale: 2,
    useCORS: true,
    backgroundColor: resolveBackgroundColor(card, backgroundColor),
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('生成卡片图片失败'))),
      'image/png'
    );
  });
}

async function writeToDirectory(directory, fileName, blob) {
  const fileHandle = await directory.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();

  await writable.write(blob);
  await writable.close();
}

function downloadImage(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function saveCards(cards, template) {
  const total = cards.length;
  const backgroundColor = CARD_BACKGROUNDS[template] || '#ffffff';
  let directory = supportsLocalDirectory() ? await resolveDirectory() : null;
  const dateSuffix = getDateSuffix();

  for (let index = 0; index < cards.length; index++) {
    const blob = await renderCardImage(cards[index], backgroundColor);
    const fileName = `card_${index + 1}_${dateSuffix}.png`;

    if (!directory) {
      downloadImage(blob, fileName);
      continue;
    }

    try {
      await writeToDirectory(directory, fileName, blob);
    } catch (error) {
      if (error.name !== 'NotFoundError') {
        throw error;
      }

      directory = await pickDirectory();
      await writeToDirectory(directory, fileName, blob);
    }
  }

  return { total, directoryName: directory ? directory.name : '' };
}
