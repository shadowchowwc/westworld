(function (window) {
  const docWidth = 750; // 设计图文档宽度
  const designWidth = docWidth;
  const minFontSize = 8;
  const maxFontSize = 10;
  const baseFontSize = 18;

  const doc = window.document;
  const docEl = doc.documentElement;
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

  const recalc = function () {
    docEl.setAttribute('data-dpr', 2);
    const clientWidth = docEl.getBoundingClientRect().width;
    docEl.style.fontSize = `${Math.max(Math.min(baseFontSize * (clientWidth / designWidth), maxFontSize), minFontSize) * 10}px`;
  };

  let resizeTimeout;
  const throttledRecalc = function () {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(recalc, 200);
  };

  if (doc.addEventListener) {
    window.addEventListener(resizeEvt, throttledRecalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
  }
})(window);
