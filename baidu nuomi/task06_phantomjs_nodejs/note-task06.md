### 任务目的
* 学习NodeJS HTTP模块
* 学习NodeJS和本地进程的互动
* 学习NodeJS和mongodb的交互


### 任务描述
* 安装nodejs和mongodb
* 利用nodejs的HTTP模块封装一个node服务，监听8000端口，接受一个参数（关键字），http模块示例参考如下：
```
   var http = require("http");  
   http.createServer(function(request, response) {  
           console.log('request received');  
           response.writeHead(200, {"Content-Type": "text/plain"});  
           response.write("Hello World");  
           response.end();  
   }).listen(8000);  
   console.log('server started');
   ```
* 收到请求后，启动phantomjs进程执行taskjs，并将接受到的参数传递给phantomjs
* phantomjs执行完后告诉node服务，并传回抓取的json结果
* node服务将结果存到mongodb中（使用mogoose）


### 任务注意事项
* 参考nodejs和mongodb的相关文档快速学习和实践
 

### 学习资料
* [nodejs安装](https://nodejs.org/en/download/)
* [nodejs 实现一个http server](http://jobar.iteye.com/blog/2083843)
* [nodejs http模块API](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_http_createserver_requestlistener)
* [mongodb安装](https://www.mongodb.com/download-center?jmp=nav)
* [mongodb介绍](http://www.runoob.com/mongodb/mongodb-tutorial.html)
* [mongoose](http://www.nodeclass.com/api/mongoose.html)
 

### 实现思路
1. 用nodejs的`HTTP模块`来创建一个服务，响应get请求:
```
   var http = require("http");  
   http.createServer(function(request, response) {  
           console.log('request received');  
           response.writeHead(200, {"Content-Type": "text/plain"});  
           response.write("Hello World");  
           response.end();  
   }).listen(8000);  
   console.log('server started');
```
`request.url`会得到路径名开始的`url`，比如访问`http://localhost:8000/?word=%E4%B8%AD%E5%9B%BD&device=iphone5`，将会得到`/?word=%E4%B8%AD%E5%9B%BD&device=iphone5`。可以用`URL模块`来解析`url`。
2. 使用`URL模块`的`url.parse()`方法来解析url字符串，会得到一个`urlObject`，取出其中的`query`属性，默认得到的`query`是个字符串，需要将`url.parse()`的第二个参数设置为`true`，`query`将被解析为一个对象。访问上面的地址时就会得到如下 ：
```
    var queryObj = url.parse(req.url,true).query;
    console.log(queryObj); // {word: '中国', device: 'iphone5'}
```
3. 使用`child_process模块`的`child_process.exec()`方法来调用命令行。传给回调的 stdout 和 stderr 参数会包含子进程的 stdout 和 stderr 的输出。
``` 
var exec = require('child_process').exec;
var cmdStr = 'phantomjs task.js ';
exec(cmdStr + queryObj.word + ' ' + queryObj.device, function(err, stdout, stderr){
        if(err) {
            console.error(`exec error: ${error}`);
        } else {
        // todo
        }
```
4. 运行MongoDB服务器，从MongoDB目录的bin目录中执行mongod.exe文件,`mongod.exe --dbpath c:\data\db`，其中`c:\data\db`为mongodb的数据目录，需提前手动创建。
5. 使用MongoDB后台管理 Shell，从MongoDB目录的bin目录中执行mongo.exe文件,在命令行输入`mongo`即可。几个命令：
```
> db
test
> show dbs
admin  0.000GB
baidu  0.000GB
local  0.000GB
test   0.000GB
> use baidu
switched to db baidu
> db
baidu
> show collections
results
> db.results.find({}) //查找所有文档
> db.results.remove({}) //删除所有文档
```

6. 使用mongoose来操作mongodb。
```
// 连接数据库
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/baidu');

// 添加数据库连接失败和打开时的回调
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('mongoose connected!')
});

// 定义一个Schema
var resultSchema = new mongoose.Schema({
  code: Number,
  msg: String,
  word: String,
  device: String,
  time: Number,
  dataList: [{
    info: String,
    link: String,
    pic: String,
    title: String
  }]
});

// 编译定义好的Schema
var Result = mongoose.model('Result', resultSchema);

// 新建一个文档
var result = new Result(JSON.parse(stdout));

// 将文档保存到数据库
result.save(function(err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log(result);
        }
    });
```

### 注意点
1. 浏览器会默认请求favicon.ico，可以将处理逻辑放到`if(req.url !== '/favicon.ico'){}`里面。
2. task.js可能会输出无法转换成JSON的字符串，需要做一下处理。比如，当 device的 参数输入有误时，stdout会输出`'Usage: the device should be one of "iphone5,iphone6,ipad"'`。在返回JSON前加上判断：
```
     try {
        JSON.parse(stdout);
    } catch (err) {
        res.writeHead(200, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({code: 0, msg: '请确认查询参数是否正确'}));
    }
```