// 全局方法封装
function showLog () {
  app.startActivity("console")
}
global.showLog = showLog

// 调用 JS 方法
function jsCall (str) {
  events.broadcast.emit('callJs', str);
}
global.jsCall = jsCall

// 给 JS 变量赋值
function jsVal(key, val) {
  const formattedVal = typeof val === 'object' ? JSON.stringify(val) : `"${val}"`;
  jsCall(`${key}=${formattedVal}`);
}
global.jsVal = jsVal;

// 将脚本和参数挂在 global.curRobot, 然后可以在 robot.menu.js 悬浮菜单点击开始执行
global.runRobot = function(params) {
  toastLog('机器人已加载, 请打开App对应页面, 点击开始!');
  global.curRobot = () => global.runRobotNow(params);
};

// 执行机器人
global.runRobotNow = function runRobotNow(params) {
  global.curRobot = () => runRobotNow(params);

  global.robotStop();
  global.robotThread = threads.start(function () {
    log(params);
    global.WEB_PARAMS = params;

    const taskName = params.robot;
    if (robotTasks[taskName]) {
      robotTasks[taskName](params); // 动态调用指定任务函数
    } else {
      console.error('任务 "${taskName}" 未定义');
    }
  });
};

// 停止机器人
global.robotStop = function() {
  if (global.robotThread && global.robotThread.isAlive()) {
    global.robotThread.interrupt();
  }
};

// 监听返回键双击退出
if (!global.backThread) {
  global.backThread = threads.start(() => {
    let timer;
    let count = 0;
    ui.emitter.on("back_pressed", e => {
      if (ui.web.canGoBack()) {
        ui.web.goBack();
        e.consumed = true;
      } else {
        toast("连续按两次返回键退出");
        clearTimeout(timer);
        timer = setTimeout(() => (count = 0), 500);
        if (++count >= 2) {
          threads.shutDownAll();
          e.consumed = false;
          exit();
        } else {
          e.consumed = true;
        }
      }
    });
  });
}

// 滑动手势操作
function swipeUp(xFactor = 0.5, startFactor = 0.8, endFactor = 0.2, duration = 500) {
  const width = device.width;
  const height = device.height;
  swipe(width * xFactor, height * startFactor, width * xFactor, height * endFactor, duration);
}

global.swipeUp = () => swipeUp();
global.swipeHorizontalUp = () => swipeUp(0.5, 0.5, 0.2, Math.floor(Math.random() * 1200));
