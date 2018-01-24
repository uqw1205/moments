// TODO: 用户名称需修改为自己的名称
var userName = 'Lu仔酱';
// 朋友圈页面的数据
var data = [{
  user: {
    name: '阳和', 
    avatar: './img/avatar2.png'
  }, 
  content: {
    type: 0, // 多图片消息
    text: '华仔真棒，新的一年继续努力！',
    pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
    share: {},
    timeString: '3分钟前'
  }, 
  reply: {
    hasLiked: false,
    likes: ['Guo封面', '源小神'],
    comments: [{
      author: 'Guo封面',
      text: '你也喜欢华仔哈！！！'
    },{
      author: '喵仔zsy',
      text: '华仔实至名归哈'
    }]
  }
}, {
  user: {
    name: '伟科大人',
    avatar: './img/avatar3.png'
  },
  content: {
    type: 1, // 分享消息
    text: '全面读书日',
    pics: [],
    share: {
      pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
      text: '飘洋过海来看你'
    },
    timeString: '50分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['阳和'],
    comments: []
  }
}, {
  user: {
    name: '深圳周润发',
    avatar: './img/avatar4.png'
  },
  content: {
    type: 2, // 单图片消息
    text: '很好的色彩',
    pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
    share: {},
    timeString: '一小时前'
  },
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}, {
  user: {
    name: '喵仔zsy',
    avatar: './img/avatar5.png'
  },
  content: {
    type: 3, // 无图片消息
    text: '以后咖啡豆不敢浪费了',
    pics: [],
    share: {},
    timeString: '2个小时前'
  }, 
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}];

// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes) {
  if (!likes.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
  // 点赞人的html列表
  var likesHtmlArr = [];
  // 遍历生成
  for(var i = 0, len = likes.length; i < len; i++) {
    likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
  }
  // 每个点赞人以逗号加一个空格来相隔
  var likesHtmlText = likesHtmlArr.join(', ');
  htmlText.push(likesHtmlText);
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
  if (!comments.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-comment">'];
  for(var i = 0, len = comments.length; i < len; i++) {
    var comment = comments[i];
    htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text + '</div>');
  }
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
  var htmlText = [];
  htmlText.push('<div class="reply-zone">');
  htmlText.push(likesHtmlTpl(replyData.likes));
  htmlText.push(commentsHtmlTpl(replyData.comments));
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 多张图片消息模版 （可参考message.html）
 * @param {Object} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 */
function multiplePicTpl(pics) {
  var htmlText = [];
  htmlText.push('<ul class="item-pic">');
  for (var i = 0, len = pics.length; i < len; i++) {
    htmlText.push('<img class="pic-item" src="' + pics[i] + '">')
  }
  htmlText.push('</ul>');
  return htmlText.join('');
}
/**
 * 单张图片消息模版
 * @param {Object} singlePic 单图片消息的图片列表
 * @return {String} 返回html字符串
 */
function singlePic(pic) {
  var htmlText = [];
  htmlText.push('<ul class="item-pic">');
  if (pic.length == 1) {
    htmlText.push('<img class="item-only-img" src="' + pic[0] + '" >')
  }
  htmlText.push('</ul>');
  return htmlText.join('');
}
/**
 * 分享消息模版
 * @param {Object} shareCon 分享消息的图片列表
 * @return {String} 返回html字符串
 */
function shareCon(share) {
  var htmlText = ['<ul class="item-share">'];
  htmlText.push('<img class="share-img" src="' + share.pic + '">')
  htmlText.push('<p class= "share-tt">' + share.text + '</p>')
  htmlText.push('</ul>');
  return htmlText.join('');
}
/**
 * 循环：消息体 
 * @param {Object} messageData 对象
 */ 
function messageTpl(messageData) {
  var user = messageData.user;
  var content = messageData.content;
  var htmlText = [];
  htmlText.push('<div class="moments-item" data-index="0">');
  // 消息用户头像
  htmlText.push('<a class="item-left" href="#">');
  htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
  htmlText.push('</a>');
  // 消息右边内容
  htmlText.push('<div class="item-right">');
  // 消息内容-用户名称
  htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
  // 消息内容-文本信息
  htmlText.push('<p class="item-msg">' + content.text + '</p>');
  // 消息内容-图片列表 
  var contentHtml = '';
  // 目前只支持多图片消息，需要补充完成其余三种消息展示
  switch(content.type) {
      // 多图片消息
    case 0:
      contentHtml = multiplePicTpl(content.pics);
      break;
    case 1:
      // TODO: 实现分享消息
      contentHtml = shareCon(content.share);
      break;
    case 2:
      // TODO: 实现单张图片消息
      contentHtml = singlePic(content.pics);
      break;
    case 3:
      // TODO: 实现无图片消息
  }
  htmlText.push(contentHtml);
  // 消息时间和回复按钮
  htmlText.push('<div class="item-ft">');
  htmlText.push('<span class="item-time">' + content.timeString + '</span>');
  htmlText.push('<div class="item-reply-btn">');
  htmlText.push('<span class="item-reply"></span>');
  htmlText.push('</div></div>');
  // 消息回复模块（点赞和评论）
  htmlText.push(replyTpl(messageData.reply));
  htmlText.push('</div></div>');
  return htmlText.join('');
}


/**
 * 页面渲染函数：render
 */
function render() {
  // TODO: 目前只渲染了一个消息（多图片信息）,需要展示data数组中的所有消息数据。
  var messageHtml = [];
  for(var i = 0 , len = data.length ; i <len ; i ++) {
    messageHtml += messageTpl(data[i]);
    $momentsList.html(messageHtml);
  }
}



  var btn = document.getElementsByClassName('item-reply'),
      ft = document.getElementsByClassName('item-ft'),
      replyBtn = document.getElementsByClassName('item-reply-btn'),
      praise = document.getElementsByClassName('praise');

// 点赞与评论按钮
function praise(){
  var len = btn.length;
      console.log(btn[0]);
  for(var i = 0 ; i <len ; i ++){
      var div = document.createElement('div');
      div.className = 'praise';
      var html = '<i class="icon-like"></i>' + '<span class="icon-like-item">点赞 </span>' +
    '<i class="icon-comment"></i>' + '<span class="icon-comment-item">评论  </span>';
      div.innerHTML = html;
      ft[i].insertBefore(div,replyBtn[i]);
      }
}


  //评论内容发送到评论后面
function praiseComment() {
  var comment = document.getElementsByClassName('reply-comment')[0];
  var inputText = document.getElementsByTagName('input')[0];
  var div = document.createElement('div');
  div.className = 'comment-item';
  var html = '<a href="#" class="reply-who">'+userName +'</a>'+': ' + inputText.value;
  div.innerHTML = html;
  comment.appendChild(div);
}

function praiseLike() {
  var like = document.getElementsByClassName('reply-like');
  var i = document.createElement('i');
  i.className = 'icon-like-blue';
  var div = document.createElement('a');
  div.className = 'reply-who';
  div.href = '#';
  div.innerHTML = ', '+ userName;
  if(!like){
    like.appendChild(i);
    like.appendChild(div);
  }else{
    like.appendChild(div);
  }
}





/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
  // TODO: 完成页面交互功能事件绑定
  
  
  btn[0].addEventListener('click',function(){
    (praise()());
  },false)
}

/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
  // 渲染页面
  render();
  bindEvent()
}

init();