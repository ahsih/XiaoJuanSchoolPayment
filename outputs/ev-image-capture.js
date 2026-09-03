(() => {
  const original = HTMLCanvasElement.prototype.toBlob;
  let sequence = 0;
  HTMLCanvasElement.prototype.toBlob = function(callback, ...args) {
    const capture = this.width === 1032;
    return original.call(this, async blob => {
      if (capture && blob) {
        await fetch(`/ev-image-capture/${++sequence}.png`, { method: 'POST', body: blob });
      }
      callback(blob);
    }, ...args);
  };
})();
