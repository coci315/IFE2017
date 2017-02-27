var webPage = require('webpage');
var page = webPage.create();

var system = require('system');
var args = system.args;

// 如果没有输入关键字
if (args.length === 1) {
  console.log('Usage: task.js <some word>');
  phantom.exit();
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
        obj.title = nResults[i].querySelector('.t a').innerText;
        obj.info = nResults[i].querySelector('.c-abstract').innerText;
        obj.link = nResults[i].querySelector('.c-showurl').innerText.trim();
        var pic = nResults[i].querySelector('.c-img');
        obj.pic = pic ? pic.src : '';
        dataList.push(obj);
      }
      return dataList;
    });

    result.code = 1;
    result.msg = '抓取成功';
    result.word = word;
    result.time = Date.now() - t;
    result.dataList = dataList;
  }

  console.log(JSON.stringify(result));
  phantom.exit();
})

