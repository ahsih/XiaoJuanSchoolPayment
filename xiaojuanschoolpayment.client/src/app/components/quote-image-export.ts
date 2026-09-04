/** Browser-only export helpers shared by every school's quote button. */
export function quoteImageEnvironment() {
  const agent = navigator.userAgent;
  const wechat = /MicroMessenger/i.test(agent);
  const mobile = wechat || /Android|iPhone|iPad|iPod/i.test(agent)
    || (/Macintosh/i.test(agent) && navigator.maxTouchPoints > 1)
    || window.matchMedia('(max-width: 600px)').matches;
  return { wechat, mobile };
}

export function quoteCanvasScale(width: number, height: number, requested: number, mobile: boolean): number {
  // A conservative budget also covers older iOS/WKWebView canvases. Never crop rows.
  const maxSide = mobile ? 4096 : 16384;
  const maxPixels = mobile ? 6_000_000 : 16_000_000;
  return Math.min(requested, mobile ? 2 : 3, maxSide / width, maxSide / height,
    Math.sqrt(maxPixels / (width * height)));
}

export function loadQuoteImage(source: string, timeoutMs = 10_000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const cleanup = () => { clearTimeout(timer); image.onload = null; image.onerror = null; };
    const fail = () => {
      cleanup();
      image.src = '';
      reject(new Error('报价图片素材加载失败，请检查网络后重试。'));
    };
    const timer = window.setTimeout(fail, timeoutMs);
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) { fail(); return; }
      cleanup();
      resolve(image);
    };
    image.onerror = fail;
    if (/^https?:/i.test(source) && new URL(source).origin !== location.origin) {
      image.crossOrigin = 'anonymous';
    }
    image.src = source;
  });
}

export function encodeQuoteCanvas(canvas: HTMLCanvasElement, timeoutMs = 15_000): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('图片生成超时，请重试。')), timeoutMs);
    try {
      canvas.toBlob(blob => {
        clearTimeout(timer);
        if (!blob || blob.size === 0 || blob.type !== 'image/png') {
          reject(new Error('图片生成不完整，请重试。'));
          return;
        }
        resolve(blob);
      }, 'image/png');
    } catch (error) {
      clearTimeout(timer);
      reject(error);
    }
  });
}

export async function validateQuoteBlob(blob: Blob): Promise<void> {
  if (!blob.size || blob.type !== 'image/png') throw new Error('图片生成不完整，请重试。');
  const url = URL.createObjectURL(blob);
  try {
    const image = await loadQuoteImage(url);
    image.src = '';
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** An actual img source lets embedded browsers offer their native long-press menu. */
export function quoteBlobDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const timer = window.setTimeout(() => { reader.abort(); reject(new Error('图片预览加载超时，请重试。')); }, 10_000);
    reader.onload = () => {
      clearTimeout(timer);
      const result = reader.result;
      if (typeof result === 'string' && result.startsWith('data:image/png;base64,') && blob.size > 0) resolve(result);
      else reject(new Error('图片预览加载失败，请重试。'));
    };
    reader.onerror = () => { clearTimeout(timer); reject(new Error('图片预览加载失败，请重试。')); };
    reader.readAsDataURL(blob);
  });
}

export function downloadQuoteBlob(blob: Blob, fileName: string): void {
  if (!blob.size || blob.type !== 'image/png') throw new Error('图片生成不完整，请重试。');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  try { link.click(); } finally {
    link.remove();
    // Downloads can outlive their component. Never revoke on the next tick or on route change.
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
}
