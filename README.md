# 瞬间人生

## Disclaimer

第一次看到V2ex上的帖子一直没注意，后来看到这个北京浮生记，突然来了感觉，想到了个点子，但是因为已经是倒数第二天了，复杂开发是来不及了，参考[北京浮生记](http://shadeofgod.github.io/beijing-hel)基本框架中开发除了当前版本。


应该不算是参加hackthon，纯粹是为了好玩，但是突然想到了这个点子。时间也是来不及了的，后期或许可以讲这个东西产品化。
瞎搞搞



### Structure

```
-- packages
 |-- bearyhubot  # 倍洽机器人模块
 |-- core        # 游戏逻辑核心模块
```

注：如果你需要部署到自己的机器人上，你需要在 `./packages/bearyhubot/src/` 目录下添加一个 `token.js` 文件：

```sh
echo "export const HUBOT_TOKEN = '<YOUR OWN HUBOT TOKEN>';" > ./packages/bearyhubot/src/token.js
```

### Prepare

```sh
npm install
npm run prepare
```

### Deploy

dev mode:

```sh
npm run dev
```

prod mode:

```sh
# install pm2
npm install pm2 -g

npm run prod
```

## LICENSE

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present, polandeme
