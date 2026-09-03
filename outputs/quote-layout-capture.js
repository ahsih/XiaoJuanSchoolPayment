(() => {
  const original = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function(callback, ...args) {
    const capture = this.width === 2064;
    return original.call(this, async blob => {
      if (capture && blob) {
        await fetch('/quote-layout-capture/cg-banilad-8weeks.png', { method: 'POST', body: blob });
      }
      callback(blob);
    }, ...args);
  };
})();
