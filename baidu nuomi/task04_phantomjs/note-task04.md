### 任务目的
* 体会数据的封装
* 快速学习新工具的的能力
* 熟悉phantomjs的基础用法


### 任务描述
* 安装phantomjs2.0，并查看webpage相关的API <http://phantomjs.org/api/webpage/>。
* 编写一个task.js脚本，参考官网的includeJs方法，实现根据传入的参数（关键字），抓取百度第一页对应该关键字的搜索结果。
* 将结果输出为json string回显。
* 回显的格式为
    ```
    {
           code: 1, //返回状态码，1为成功，0为失败
           msg: '抓取成功', //返回的信息
           word: '示例关键字', //抓取的关键字
           time: 2000, //任务的时间
           dataList:[   //抓取结果列表
               {
                   title: 'xx',  //结果条目的标题
                   info: ‘’, //摘要
                   link: ‘’, //链接            
                   pic: '' //缩略图地址
                   }
           ]
    }
   ```
   
   
### 任务注意事项
* 多查API，学以致用
* 对于抓取的异常情况及时捕获并处理
* 结果中非自然结果的部分抛弃掉（广告、阿拉丁等），提前人工查看一下搜索结果，大多信息格式一致的都是自然结果，观察自然结果的class和相关结构特征。


### 在线学习资料
* [phantomjs下载与安装](http://phantomjs.org/download.html)
* [phantomjs使用说明](http://phantomjs.org/quick-start.html)
* [更多API文档](http://phantomjs.org/api/webpage/)
* [阮一峰phantomejs简易教程](http://javascript.ruanyifeng.com/tool/phantomjs.html)



### 实现思路
1. 查看百度的搜索结果页，发现是`https://www.baidu.com/s?wd=搜索关键字`。
2. 学习phantomjs文档，对于本次任务，主要用到`web page module`和`system module`，用到的api主要是`open()`和`evaluate（）`。
3. 通过`system.args`获取命令行输入的参数。
4. 通过`open()`方法打开网页，通过`evaluate()`在打开的网页中进行dom操作，获取所需的数据，存入用来保存结果的对象中。
5. 将保存结果的对象JSON序列化打印输出。
 

### 注意点
1. 在拼接网址字符串时，需要对关键字进行`encodeURIComponent()`编码处理，否则中文字会出现乱码。
2. `evaluate()`方法是通过沙盒隔离的方式，内外交互，需要通过参数和return的方式。
3.  通过`render('xx.png')`的方式可以保存打开的网页的截图，通过截图来直观地查看代码是否按预期进行。