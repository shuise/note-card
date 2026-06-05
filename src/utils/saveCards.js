import html2canvas from 'html2canvas';

const CARD_BACKGROUNDS = {
  c1: '#f0ebe5',
  c2: '#f5efe1',
};

export async function saveCardsToServer(cards, template) {
  const total = cards.length;
  const backgroundColor = CARD_BACKGROUNDS[template] || '#ffffff';

  for (let index = 0; index < cards.length; index++) {
    const card = cards[index];

    const canvas = await html2canvas(card, {
      scale: 2,
      useCORS: true,
      backgroundColor,
    });

    const imageData = canvas.toDataURL('image/png');

    const response = await fetch('/api/save-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData,
        index,
        total,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.message || `保存第 ${index + 1} 张卡片失败`);
    }
  }

  return total;
}
