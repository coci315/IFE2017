function MusicPlayer(playList) {
  this.playList = playList;
  this.currentIndex = 0;
  this.container = document.querySelector('.wrap');
  this.nPlayList = this.container.querySelector('.playlist');
  this.nTitle = this.container.querySelector('.player .title');
  this.nArtist = this.container.querySelector('.player .artist');
  this.nCoverLink = this.container.querySelector('.cover a');
  this.nCoverPic = this.container.querySelector('.cover img');
  this.nTime = this.container.querySelector('.player .time');
  this.nBtnPlay = this.container.querySelector('.player .btn_play');
  this.nBtnPause = this.container.querySelector('.player .btn_pause');
  this.nBtnPrev = this.container.querySelector('.player .btn_prev');
  this.nBtnNext = this.container.querySelector('.player .btn_next');
  this.nVolumeSlider = this.container.querySelector('.volume_slider');
  this.nVolumeSliderOuter = this.container.querySelector('.volume_slider .outer');
  this.nVolumeSliderInner = this.container.querySelector('.volume_slider .inner');
  this.nVolumeSVGPaths = this.container.querySelectorAll('.player .icon-volume path');
  this.nProgress = this.container.querySelector('.player .progress');
  this.nProgressOuter = this.nProgress.querySelector('.progress_outer');
  this.nProgressInner = this.nProgress.querySelector('.progress_inner');
  this._initPlayList();
  this.nPlayListLis = this.nPlayList.querySelectorAll('li');
  this.audio = new Audio();
  this._initEvent();
  this._loadMusic(this.currentIndex);
  this._setPlayListStyle(this.currentIndex);
}

MusicPlayer.prototype = {
  constructor: MusicPlayer,

  helper: {
    dealTime: function (time) {
      var time = parseInt(time);
      var min = parseInt(time / 60);
      min = min >= 10 ? '' + min : '0' + min;
      var sec = parseInt(time % 60);
      sec = sec >= 10 ? '' + sec : '0' + sec;
      return '-' + min + ':' + sec;
    }
  },

  _initPlayList: function () {
    for (var i = 0, l = this.playList.length; i < l; i++) {
      var li = document.createElement('li');
      li.innerText = (i + 1) + '. ' + this.playList[i].title;
      li.dataset.index = i;
      this.nPlayList.appendChild(li);
    }
  },

  loadAndPlay: function () {
    this._loadMusic(this.currentIndex);
    this._setPlayListStyle(this.currentIndex);
    this.play();
  },

  _loadMusic: function (index) {
    this.nTitle.innerText = this.playList[index].title;
    this.nArtist.innerText = this.playList[index].artist;
    this.nCoverLink.href = this.playList[index].release.link;
    this.nCoverPic.src = this.playList[index].picture;
    this.audio.src = this.playList[index].url;
    this.audio.load();
  },

  _setPlayListStyle: function (index) {
    for (var i = 0, l = this.nPlayListLis.length; i < l; i++) {
      this.nPlayListLis[i].classList.remove('active');
    }
    this.nPlayListLis[index].classList.add('active');
  },

  play: function () {
    this.audio.play();
    this.nBtnPlay.style.display = 'none';
    this.nBtnPause.style.display = 'inline-block';
  },

  pause: function () {
    this.audio.pause();
    this.nBtnPause.style.display = 'none';
    this.nBtnPlay.style.display = 'inline-block';
  },

  next: function () {
    this.currentIndex++;
    var length = this.nPlayListLis.length;
    if (this.currentIndex > length - 1) {
      this.currentIndex = 0;
    }
  },

  playNext: function () {
    this.next();
    this.loadAndPlay();
  },

  prev: function () {
    var length = this.nPlayListLis.length;
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = length - 1;
    }
  },

  playPrev: function () {
    this.prev();
    this.loadAndPlay();
  },

  _changeVolumeStyle: function (volume) {
    var nPaths = [].slice.call(this.nVolumeSVGPaths, 1);
    for (var i = 0, l = nPaths.length; i < l; i++) {
      nPaths[i].style.display = 'inline-block';
    }
    if (volume > 0.33 && volume < 0.66) {
      nPaths[2].style.display = 'none';
    } else if (volume > 0 && volume <= 0.33) {
      nPaths[2].style.display = 'none';
      nPaths[1].style.display = 'none';
    } else if (volume == 0) {
      for (var i = 0, l = nPaths.length; i < l; i++) {
        nPaths[i].style.display = 'none';
      }
    }
  },

  _initEvent: function () {
    // 媒体元数据加载完成时，设置歌曲时长
    var that = this;
    this.audio.addEventListener('loadedmetadata', function () {
      this.nTime.innerText = this.helper.dealTime(this.audio.duration);
    }.bind(this));
    // 媒体开始播放时，动态修改歌曲剩余时长，同时修改播放进度条
    this.audio.addEventListener('playing', function () {
      var outerWidth = that.nProgressOuter.offsetWidth;
      that.timer = setInterval(function () {
        // 修改歌曲剩余时长
        that.nTime.innerText = that.helper.dealTime(that.audio.duration - that.audio.currentTime);
        // 修改播放进度条
        that.nProgressInner.style.width = parseInt(outerWidth * (that.audio.currentTime / that.audio.duration)) + 'px';
        if (that.audio.paused || that.audio.ended) {
          clearInterval(that.timer);
        }
      }, 1000);
    });
    // 播放按钮点击时播放
    this.nBtnPlay.addEventListener('click', this.play.bind(this));
    // 暂停按钮点击时暂停
    this.nBtnPause.addEventListener('click', this.pause.bind(this));
    // 下一首
    this.nBtnNext.addEventListener('click', this.playNext.bind(this));
    // 上一首
    this.nBtnPrev.addEventListener('click', this.playPrev.bind(this));
    // 播放列表添加事件代理
    this.nPlayList.addEventListener('click', function (e) {
      var target = e.target;
      if (target.tagName.toLowerCase() === 'li') {
        that.currentIndex = target.dataset.index;
        that.loadAndPlay();
      }
    });
    // 音量控制条
    this.nVolumeSliderOuter.addEventListener('click', function (e) {
      var sliderStartX = that.nVolumeSlider.offsetLeft;
      var outerWidth = that.nVolumeSliderOuter.offsetWidth;
      var newInnerWidth = e.clientX - sliderStartX;
      that.nVolumeSliderInner.style.width = newInnerWidth + 'px';
      var volume = (newInnerWidth / outerWidth).toFixed(2);
      if (volume < 0) volume = 0;
      that.audio.volume = volume;
      that._changeVolumeStyle(volume);
    });
    // 播放进度条
    this.nProgress.addEventListener('click', function (e) {
      var progressStartX = that.nProgress.offsetLeft;
      var outerWidth = that.nProgressOuter.offsetWidth;
      var newInnerWidth = e.clientX - progressStartX;
      that.nProgressInner.style.width = newInnerWidth + 'px';
      var progressRate = (newInnerWidth / outerWidth).toFixed(2);
      var currentTime = parseInt(that.audio.duration * progressRate);
      that.audio.currentTime = currentTime;
      that.audio.paused && (that.nTime.innerText = that.helper.dealTime(that.audio.duration - that.audio.currentTime));
    })
  }
};


var musicPlayer = new MusicPlayer(playList);