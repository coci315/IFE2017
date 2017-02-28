var webPage = require('webpage');
var page = webPage.create();

var system = require('system');
var args = system.args;


// 可选的device参数
var devices = ['iphone5', 'iphone6', 'ipad'];
var device = '';
var deviceSettings = {
  'iphone5': {
    'userAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'viewportSize': {
      width: 320,
      height: 568
    }
  },
  'iphone6': {
    'userAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'viewportSize': {
      width: 375,
      height: 667
    }
  },
  'ipad': {
    'userAgent': 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'viewportSize': {
      width: 768,
      height: 1024
    }
  },
};

// 如果没有输入关键字
if (args.length === 1 || args.length > 3) {
  console.log('Usage: task.js <some word> [some device]');
  phantom.exit();
}

// 如果输入了三个参数
if (args.length === 3) {
  if (devices.indexOf(args[2]) === -1) {
    console.log('Usage: the device should be one of "iphone5,iphone6,ipad"');
    phantom.exit();
  } else {
    device = args[2];
    page.settings.userAgent = deviceSettings[device].userAgent;
    page.viewportSize = deviceSettings[device].viewportSize;
    // page.clipRect = {
    //   top: 0,
    //   left: 0,
    //   width: deviceSettings[device].viewportSize.width,
    //   height: deviceSettings[device].viewportSize.height
    // };
  }
}

var result = {};
var t = Date.now();
var word = args[1];

page.open('https://www.baidu.com/s?wd=' + encodeURIComponent(word), function(status) {
  if (status !== 'success') {
    result.code = 0;
    result.msg = '抓取失败';
  } else {

    // 对打开后的链接进行截图，测试是否是正确的结果
    // page.render('result.png');

    var dataList = page.evaluate(function() {
      var nResults = document.querySelectorAll('.result');
      var dataList = [];

      for (var i = 0, l = nResults.length; i < l; i++) {
        var obj = {};
        var title = nResults[i].querySelector('.t') || nResults[i].querySelector('.c-title');
        if (title === null) continue;
        obj.title = title.innerText;
        var info = nResults[i].querySelector('.c-abstract') || nResults[i].querySelector('.c-line-clamp3');
        if (info === null) continue;
        obj.info = info.innerText;
        var link = nResults[i].querySelector('a.c-showurl') || nResults[i].querySelector('span.c-showurl');
        if (link === null) continue;
        obj.link = link.innerText.trim();
        var pic = nResults[i].querySelector('.c-img');
        obj.pic = pic ? pic.src : '';
        dataList.push(obj);
      }
      return dataList;
    });

    result.code = 1;
    result.msg = '抓取成功';
    result.word = word;
    result.device = device;
    result.time = Date.now() - t;
    result.dataList = dataList;
  }

  console.log(JSON.stringify(result));
  phantom.exit();
})

