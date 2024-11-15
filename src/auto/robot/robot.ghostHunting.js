auto();
var h = device.height;
var w = device.width;

const {
  findTextAndClick,
  loopFunction,
  clickClosePoint,
  isFighting,
  randomClick,
  clickImageTemplate,
  isHasImageTemplate,
  hasText
} = require('/sdcard/mh/templateImages/util.js');

const ratioX = w / 1080;
const ratioY = h / 2400;

log(`RatioX: ${ratioX}, RatioY: ${ratioY}`);
var params = global.WEB_PARAMS.params;

// 封装点击日常任务的逻辑
function clickDailyTask() {
  let clicked = findTextAndClick('日常-', { region: 'rightHalf' });
  if (!clicked) {
    clickImageTemplate('renwu.jpg', { region: 'rightHalf' });
    sleep(2000);
    clickClosePoint();
    sleep(2000);
    clicked = findTextAndClick('日常-', { region: 'rightHalf' });
  }
  return clicked;
}

// 封装任务重试逻辑
function retryTaskClick(taskName) {
  let success = findTextAndClick(taskName, { region: 'rightHalf' });
  if (!success) {
    log(`未成功点击${taskName}，再次尝试`);
    sleep(2000);
    success = findTextAndClick(taskName, { region: 'rightHalf' });
  }
  return success;
}

// 主逻辑：执行多轮捉鬼任务
for (let i = 0; i < 100; i++) {
  if (isFighting()) {
    log('战斗中...');
  } else {
    toastLog(`开始第 ${i + 1} 轮捉鬼`);
    if (!clickDailyTask()) {
      log('未找到日常任务按钮，重试点击');
      continue; // 跳过本轮，避免死循环
    }
    sleep(10000);

    if (!isFighting()) {
      retryTaskClick('捉拿');
    }
  }

  sleep(8000);
  if (!isFighting()) {
    sleep(2000);
    toastLog(`再次尝试，开始第 ${i + 1} 轮捉鬼`);
    if (!clickDailyTask()) {
      log('再次未找到日常任务按钮，跳过本轮');
      continue;
    }
    sleep(10000);
    if (!isFighting()) {
      retryTaskClick('捉拿');
    }
  }

  // 监控任务进度，直到完成
  while (true) {
    if (hasText('少侠已经') || hasText('已经捉完') || hasText('1轮鬼')) {
      log(`第 ${i + 1} 轮捉鬼任务已完成`);
      break;
    }
    clickClosePoint();
    log('任务进行中...');
    sleep(10000);
  }

  // 完成确认步骤
  loopFunction(() => findTextAndClick('确定'), 8);

  // 点击任务继续按钮
  loopFunction(() => clickImageTemplate('zgrw.png', { region: 'rightHalf' }), 8);

  // 随机点击，避免停留在界面
  sleep(1000);
  randomClick();
  sleep(1000);
  clickClosePoint();
}
