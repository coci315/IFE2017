var nodes = [{
  name: "父节点1",
  children: [{
    name: "子节点1"
  }, {
    name: "子节点2"
  }]
}, {
  name: "父节点2",
  children: [{
    name: "子节点3"
  }, {
    name: "子节点4",
    children: [{
      name: "子节点5"
    }]
  }]
}];

function NodeTree(nodes) {
  this.container = document.createElement('div');
  this.container.className = 'container';
  this._fillNodes(nodes, this.container);
  this._initEvent();
}

NodeTree.prototype = {
  constructor: NodeTree,

  _fillNodes: function (nodes, container) {
    var ul = document.createElement('ul');
    for (var i = 0; i < nodes.length; i++) {
      var li = document.createElement('li');
      if (nodes[i].children && nodes[i].children.length > 0) {
        var div = document.createElement('div');
        div.className = 'title node';
        div.innerHTML = '<i class="icon"></i><span class="icon"></span>' + nodes[i].name;
        li.appendChild(div);
        this._fillNodes(nodes[i].children, li);
      } else {
        li.innerText = nodes[i].name;
        li.className = 'node';
      }
      ul.appendChild(li);
    }
    container.appendChild(ul);
  },

  _initEvent: function () {
    var nodes = this.container.getElementsByClassName('node');
    this.container.addEventListener('click', function (e) {
      var target = e.target;
      if (target.classList.contains('node')) {
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].style.backgroundColor = '#fff';
        }
        target.style.backgroundColor = '#ccc';
      }
      if (target.parentNode.classList.contains('title')) {
        target.parentNode.classList.toggle('open');
      }
    }, false);
  }
};


var container = document.querySelector('.wrap');
var nodeTree = new NodeTree(nodes);
container.appendChild(nodeTree.container);