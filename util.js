// 获取指定区域
function getRegion(regionStr){
  const width = device.width, height = device.height;
  let region;
  switch(regionStr){
    case 'rightBottomHalf':
      region = [width / 2, height / 2, width / 2, height / 2];
      break;
    case 'rightTopHalf':
      region = [width / 2, 0, width / 2, height / 2];
      break;
    case 'leftTopHalf':
      region = [0, 0, width / 2, height / 2];
      break;
    case 'leftBottomHalf':
      region = [0, height / 2, width / 2, height / 2];
      break;
    case 'rightHalf':
      region = [width / 2, 0, width / 2, height];
      break;
    case 'leftHalf':
      region = [0, 0, width / 2, height];
      break;
    case 'center':
      region = [width / 4, height / 4, width / 2, height / 2];
      break;
    default:
      throw new Error("Unknown region: " + regionStr);
  }
  return region;
}

// OCR 识别图片中的文字区域
function gmlkitOcr(img, options = {}) {
  const region = getRegion(options.region || '');
  const [imgWidth, imgHeight] = [img.getWidth(), img.getHeight()];
  const regionWidth = region[2] || imgWidth - region[0];
  const regionHeight = region[3] || imgHeight - region[1];
  const newImg = images.clip(img, region[0], region[1], regionWidth, regionHeight);
  const result = gmlkit.ocr(newImg, 'zh');
  const arr = JSON.parse(JSON.stringify(result)).children;

  if (!options.region) return arr;

  return arr.map(item => ({
    ...item,
    bounds: {
      bottom: item.bounds.bottom + region[1],
      top: item.bounds.top + region[1],
      left: item.bounds.left + region[0],
      right: item.bounds.right + region[0]
    }
  }));
}

// 点击区域内的文字
function clickRect(rect, options = {}) {
  if (!rect) return;
  const scale = 0.8;
  const [height, width] = [rect.bounds.bottom - rect.bounds.top, rect.bounds.right - rect.bounds.left];
  const [centerX, centerY] = [rect.bounds.left + width / 2, rect.bounds.top + height / 2];
  const x = Math.round((Math.random() - 0.5) * width * scale + centerX);
  const y = Math.round((Math.random() - 0.5) * height * scale + centerY);
  click(x, y);
}

// 模板匹配点击
function clickImageTemplate(name, options = {}) {
  const region = getRegion(options.region || '');
  let img = captureScreen();
  let temp = images.read(`/sdcard/mh/templateImages/${name}`);
  const smallTemp = images.scale(temp, device.width / 1080, device.height / 2400);
  let p = findImage(img, smallTemp, { region });

  if (!p && options.isRepeat) {
    sleep(3000);
    img.recycle();
    img = captureScreen();
    p = findImage(img, smallTemp, { region });
  }

  if (p) {
    click(p.x + Math.round(temp.getWidth() / 4 + Math.random() * temp.getWidth() / 4), 
          p.y + Math.round(temp.getHeight() / 4 + Math.random() * temp.getHeight() / 4));
    log('点击图片', name);
    img.recycle();
    temp.recycle();
    smallTemp.recycle();
    return true;
  } else {
    log(`未找到${name}的图片`);
    img.recycle();
    temp.recycle();
    smallTemp.recycle();
    return false;
  }
}

// 判断是否包含模板图片
function isHasImageTemplate(name, options = {}) {
  const region = getRegion(options.region || '');
  const img = captureScreen();
  const temp = images.read(`/sdcard/mh/templateImages/${name}`);
  const smallTemp = images.scale(temp, device.width / 1080, device.height / 2400);
  const found = !!findImage(img, smallTemp, { region });
  img.recycle();
  temp.recycle();
  smallTemp.recycle();
  return found;
}

// 检查是否在战斗中
function isFighting() {
  return isHasImageTemplate('fighting.jpg', { region: 'rightBottomHalf' }) || 
         isHasImageTemplate('fighting2.jpg', { region: 'rightBottomHalf' });
}

// 点击关闭按钮
function clickClosePoint() {
  const imagesList = ['xhao.jpg', 'xhao2.jpg', 'xhao3.jpg'];
  let attempts = 0;
  while (attempts < 5) {
    const closed = imagesList.some(image => isHasImageTemplate(image) && clickImageTemplate(image, { region: 'rightBottomHalf' }));
    if (!closed) break;
    attempts++;
  }
}

// 循环执行某个函数
function loopFunction(func, interval) {
  for (let i = 0; i < interval; i++) {
    if (func()) return true;
    sleep(1000);
  }
  return false;
}

module.exports = {
  clickRect,
  gmlkitOcr,
  clickImageTemplate,
  isHasImageTemplate,
  isFighting,
  clickClosePoint,
  loopFunction
};
