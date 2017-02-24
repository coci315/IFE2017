### 实现思路
1. input标签在前，label标签在后，隐藏input标签，label标签用for与input的id关联。
2. 在label标签上动手脚，可以用背景图也可以用伪元素结合纯css的方式实现图标。
3. 通过`input:checked + label:before`来设置选中后的图标样式。

### 注意点
1. 伪元素别忘了设置content。
2. 如果没有设置浮动或绝对定位（这两个都会使元素变成inline-block），inline元素需要设置`display:inline-block`才能设置宽高，比如这里的伪元素。
3. 如果要调整伪元素的位置，特别是after伪元素，默认在原有内容的后面，所以需要用到绝对定位，将label元素设置为相对定位使其成为参照的定位父元素。这样就不需要再设置inline-block了。
4. ie8不兼容`:checked`伪类选择器。
5. CSS3伪元素使用`::`，ie8不支持`::`，仅支持`:`写法。
 
### 延伸
1. 伪元素的content可以直接设置成特殊字符来显示特殊图。[ html字符](http://www.w3cplus.com/solution/css3content/images/html.png)
2. content还有其它用法。[参考链接](http://www.w3cplus.com/solution/css3content/css3content.html)
3. 两篇参考文章。[1](http://www.tuicool.com/articles/uMzeQf) [2](http://www.helloweba.com/view-blog-295.html)
