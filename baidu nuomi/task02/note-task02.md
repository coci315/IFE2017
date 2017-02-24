### 任务目的
1. 了解js中的oncontextmenu事件
2. 了解如何获取鼠标位置
3. 了解如何实现页面屏蔽右键菜单


### 任务描述
1. 实现鼠标右击时，出现自定义菜单。点击非自定义菜单区域时，隐藏自定义菜单。
2. 点击自定义菜单条目时，弹出菜单条目名称。

### 任务注意事项
1. 自定义菜单出现在鼠标指针右下方，当右边区域不够大，展示在左下方，同理，当下方区域不够时，展示在鼠标指针上方。
2. 注意测试不同情况，尤其是极端情况下的效果。
3. 尽量不要使用第三方库，包括jQuery。


### 实现思路
1. 用一个div来实现鼠标右击出现菜单，id命名为clickdiv用一个div来实现自定义菜单，id命名为menu，菜单初始隐藏。
2.  oncontextmenu事件的默认行为就是右击的时候出现浏览器菜单。给clickdiv绑定contextmenu事件，取消默认行为，添加显示自定义菜单的行为。
3.  获取菜单的宽高，窗口的宽高，右击时鼠标的位置。鼠标的位置加上菜单的宽高，来跟窗口的宽高比大小，从而决定自定义菜单的位置。
4.  给自定义菜单绑定点击事件，通过事件代理来触发每个选项点击时的行为。


### 注意点
1. 点击时鼠标的位置需要做兼容处理。pageX和pageY，ie8不兼容，可做如下处理：

```
    function getMousePos(e) {
          var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
          var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
          var x = e.pageX || e.clientX + scrollX;
          var y = e.pageY || e.clientY + scrollY;
          return { 'x': x, 'y': y };
    }
```

2. 注意添加事件，以及获取event对象，以及阻止默认行为时的IE兼容处理。

```
    function addEvent(node,event,handler) {
      if (node.addEventListener){
          node.addEventListener(event,handler,false);
      }else{
          node.attachEvent('on'+event,handler);
      }
    }
```

```
      e = e || window.event;
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
```

3. 由于menu隐藏时，无法获取宽高，所以需要先显示出来再获取。

```
      menu.style.display = 'block';
      var menuW = menu.clientWidth;
      var menuH = menu.clientHeight;
```

4. 可以通过给menu的css设置`user-select: none;`来防止自定义菜单的文字被选中。