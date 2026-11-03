import { useMemo } from 'react';
import { createQrDataUrl, splitLinkSegments } from '../utils/linkQr';

// 卡片正文：把内容里的链接换成二维码，单独占一行并居中，其余文字保持原有换行
export default function CardContent({ content }) {
  const segments = useMemo(() => splitLinkSegments(content), [content]);

  const blocks = useMemo(
    () =>
      segments.map((segment, index) => {
        if (segment.type === 'text') {
          return (
            <span className="card-text" key={`text-${index}`}>
              {segment.value}
            </span>
          );
        }

        const dataUrl = createQrDataUrl(segment.value);

        if (!dataUrl) {
          return (
            <span className="card-text" key={`text-${index}`}>
              {segment.value}
            </span>
          );
        }

        return (
          <span className="qr-block" key={`qr-${index}`}>
            <img src={dataUrl} alt="" />
          </span>
        );
      }),
    [segments]
  );

  return <div className="card-content">{blocks}</div>;
}
