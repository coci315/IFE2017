### 任务目的
* 学会分析并借鉴其他工具的运行机制
* 学习更多phatomJS的配置
 

### 任务描述
* 观察chrome开发者工具中device toolbar，切换到不同的device，查看浏览器BOM数据有何变化
* 把device toolbar中不同的device名对应的ua和尺寸信息记录下来，保存为配置文件
* 在任务1的基础上，增加一个参数，表示device信息，taskjs中，解析该参数并从配置文件找到对应的ua和尺寸，完成设置后再抓取
* 在结果中也增加一个device字段保存传入的设备名



### 任务注意事项
* chrome device toolbar不了解可以百度一下看看使用方法，在console中打印对应BOM信息查看
* 抽取的配置文件选三个就好：iphone5、iphone6、ipad
* API提示：system.args、page.settings['userAgent']、page.viewportSize、page.clipRect



### 实现思路
1. 在前一个任务的基础上增加一个`device`参数，对`system.args`进行判断处理，确保输入正确的可选参数。
2. 在chrome调试工具中切换设备，并在 console面板中输入`navigator.userAgent`来获得对应的ua字符串。
3. 通过`page.settings.userAgent`来设置ua，通过`page.viewportSize`来设置打开网页时的视口 ，通过`page.clipRect`可以设置截取的网页的大小。用法分别如下:

```
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
```

```
page.viewportSize = {
  width: 480,
  height: 800
};
```

```

page.clipRect = {
  top: 14,
  left: 3,
  width: 400,
  height: 300
};
```


### 注意点
1. ipad或者iphone的ua下抓取到的网页的节点class与PC下会有所不同，注意做兼容处理。
2. 百度自带的产品也会出现在搜索结果的首页，这些结果的 class也会有所不同，如果不想要这些结果，直接丢弃。