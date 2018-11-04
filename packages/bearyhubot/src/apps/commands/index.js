import commandHandlers from './commandHandlers';
var request = require('request');

export default async function commands(clients) {
  const { rtm, http, RTMClientEvents: Events } = clients;

  const me = await http.user.me();

  function handleCommand(message, reply) {
    console.log(message);
    console.log(message.text)
    var responseData = '';
    var text = message.text.toLowerCase();

    // 豆瓣
    if (text.indexOf('电影') != -1)  {
	var indexMoive = text.lastIndexOf('电影');
	var query = text.substring(indexMoive + 2, 9999);
	getMoiveFromDouBan(responseData, query, reply);	
	return; 
    }
    if (text.indexOf('v2ex') != -1 ) {
	console.log('It is v2ex');
	if (text.indexOf('最新') != -1) {
            getV2exLatest(responseData, reply);
	
	} else {
            getV2exHot(responseData, reply);
	}
    } else {
	responseData = '请确认你的输入是否正确, 你可以这么说。。。';
	reply(responseData);
    }
    // promise 才可用
    //reply(responseData);
  }

// 查找今日V2ex热门
function getV2exHot(responseData, reply) {
    request('https://www.v2ex.com/api/topics/hot.json', function(err, res, body) {
	var data = JSON.parse(body);
	for (var i = 0; i < data.length; i++ ) {
	    var $item = "- [" + data[i].title + "](" +  data[i].url + ") \n ";
	    responseData += $item;
	}
        reply(responseData);
    })
}


// 查找V2ex热点
function getV2exLatest(responseData, reply) {
    console.log('This is latest v2ex');
    request('https://www.v2ex.com/api/topics/latest.json', function(err, res, body) {
	var data = JSON.parse(body);
	for (var i = 0; i < data.length; i++ ) {
	    var $item = "- [" + data[i].title + "](" +  data[i].url + ") \n ";
	    responseData += $item;
	}
        reply(responseData);
    })
}

// 豆瓣
function getMoiveFromDouBan(responseData, text, reply) {
    console.log('This is douban search query=' + text);
    request('https://api.douban.com/v2/movie/search?q=' + encodeURIComponent(text), function(err, res, body) {
	var data = JSON.parse(body);
	var resultItem = data['subjects'][0];
	var title = resultItem['title'];
	var url  = resultItem['alt'];
	var rate = resultItem['rating']['average'];
	var coverImg = resultItem['images']['medium'];
	var resData = '影名: [' + title + '](' + url + ')\n' 
		    + '得分: ' + rate + '\n'
		    + '![](' + coverImg + ')\n';
        reply(resData);
    })
}
  // 以下为原版
  function handleCommand_bak(message, reply) {
    console.log(message);
    console.log(message.text)

    const [cmd, ...options] = message.text.split(/\s+/);
    const command = cmd.toLowerCase();

    const handler = commandHandlers[command];
    if (typeof handler === 'function') {
      handler.call(message, options, reply);
    } else {
      reply('欢迎来到瞬间人生，请输入 `start` 开始游戏，`status` 查看当前状态，`help` 查看游戏介绍，或输入 `cmd` 查看所有可用的命令。 ');
    }
  }

  function handleP2PMessage(message) {
    if (message.uid === me.id) {
      // prevent inifinite message loop
      return;
    }

    // eslint-disable-next-line
    console.log(message.uid + ': ' + message.text);

    const reply = text =>
      rtm.send({
        type: 'message',
        text,
        vchannel_id: message.vchannel_id,
        refer_key: message.key,
      });

    // if (message.uid !== '=bwS8J') {
    //   reply('调试中，暂不开放');
    //   return;
    // }

    handleCommand(message, reply);
  }

  function handleRTMEvent(message) {
    switch (message.type) {
      case 'message':
        handleP2PMessage(message);
        break;
      case 'channel_message':
        // TODO handleChannelMessage(message);
        break;
      default:
    }
  }

  rtm.on(Events.EVENT, handleRTMEvent);
}
