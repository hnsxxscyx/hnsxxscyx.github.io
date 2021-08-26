---
title: 手把手教你用Laravel-echo-server 建立广播系统
date: 2021-07-28 08:01:19
tags: ['laravel', 'WebSockets', 'web']
---
# 开始之前
- Laravel并没有官方的Socket.IO 服务器，所以我们使用Laravel-echo-server 这个第三方库，只要正确配置，无缝接入Laravel
- 需要会使用Laravel 的事件的写法
- 确保config/broadcasting.php 中default 不为null
  
# 原理简述
Laravel 广播系统的原理其实很简单，客户端与Socket.io服务端（Laravel-echo-server) 建立连接，服务端监听驱动器事件，当驱动器产生事件时，服务端（Laravel-echo-server）监听到事件并向指定频道发送事件消息，客户端监听指定频道，收取事件消息。

# 建立连接
## 驱动器
本文使用Redis 作为驱动器, 请参考Laravel Redis 的配置项并保证正常使用。
## 服务端（发送广播）
### Laravel-echo-server
#### 安装
需要全局安装Laravel-echo-server。
```
npm install -g laravel-echo-server
```
#### 初始化配置
使用包自带的init 命令可以快速初始化配置文件
```
laravel-echo-server init
```
首次使用可以一路回车，全使用默认配置，执行后路径下会生成 laravel-echo-server.json 文件，根据实际需要再修改配置信息。
```json
{
  "authHost": "dash.dev.car.co.uk",
  "authEndpoint": "/broadcasting/auth",
  "clients": [
    {
      "appId": "",
      "key": ""
    }
  ],
  "database": "redis",
  "databaseConfig": {
    "redis": {
      "port": "6379"
    }
  },
  "devMode": false,
  "host": null,
  "port": "6001",
  "protocol": "http",
  "socketio": {},
  "secureOptions": 67108864,
  "sslCertPath": "",
  "sslKeyPath": "",
  "sslCertChainPath": "",
  "sslPassphrase": "",
  "subscribers": {
    "http": true,
    "redis": true
  },
  "apiOriginAllow": {
    "allowCors": false,
    "allowOrigin": "",
    "allowMethods": "",
    "allowHeaders": ""
  }
}
```
注意：
- appId 是使用http 请求来触发广播的，如果只需要在Laravel 中使用Redis 触发广播，可以忽略此项配置。
- 开发时建议devMode 设为true, 可以直观的看到连接及server 运行情况。
- 注意驱动器的配置，给驱动器配置正确的地址及端口。
- 跨域请求对cookies 有限制，注意合适的跨域配置

#### 启动
```
laravel-echo-server start
```
看到”Server ready!“ 证明server 已经启动成功了。
### Laravel
#### 触发广播事件
广播依赖于事件系统，这样设计是有原因的。
事件系统可以很好的解耦某个逻辑的不同响应，比如用户注册后可以短信、邮件等多种方式通知用户注册成功，并执行其他操作，使用一个事件及多个监听器就可以很好的解耦业务逻辑。
##### 定义广播事件
将事件实现 Illuminate\Contracts\Broadcasting\ShouldBroadcast
```php
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class BroadcastDemo implements ShouldBroadcast
{
    public function broadcastOn()
    {
        // need return a channel or channels
        return new Channel('channel-demo');
    }
}
```
必须存在 broadcastOn方法，该方法返回一个频道或者频道数组，事件会被广播到这些频道。
正常触发事件就可以触发广播。
##### 广播数据
Laravel 会默认将事件中public 属性自动序列化为广播数据，即允许客户端访问事件中的公有数据。
但是也可以使用broadcastWith 方法更细粒度的控制广播数据。
##### 广播驱动
需要配置和laravel-echo-server 相同的驱动器，驱动器来实现发布-订阅模式，laravel 使用事件系统发布消息，laravel-echo-server订阅事件，做出回调（使用socket.io 推送消息），这里我们使用的是redis作为队列驱动程序，当laravel 触发推送到指定频道时，在redis-cli 中使用SUBSCRIBE 监听对应频道或所有频道也可以看到具体信息。

#### 频道
依然拿现实中的广播系统做类比，公共频道就像广播电台，客户端只要能连接到指定频道就都可以收听，但很多信息是不能放在公开频道上的，所以需要授权以进入频道。
##### 频道认证
当连接私有频道时，客户端向laravel-echo-server发起请求，laravel-echo-server 将此请求转发给Laravel 以判断是否应该授权。
Laravel 默认授权路由为：/broadcasting/auth，通常来说使用
```php
Broadcast::routes();
```
就会注册授权路由，或者可以使用BroadcastManager 来更细粒化的控制。
在routes/channels.php 中使用Broadcast::channel 方法定义授权回调，方法返回Boolean 值，回调中当前用户被当做第一个参数，额外的通配符参数会被作为后续参数。
需要注意的是，由于通配符中也使用了「.」，所以参数中会只取第一个点前面的字符。实际使用中可以将「.」替换为其他字符来获取完整信息
##### 仅广播给他人
现实中，如果边听收音机边给电台热线打电话，收音机中肯定也会出现电话对话声，离得近了甚至会产生回音。
网络中的广播系统自然也会有这种情况发生，但在网上是没法走开的，所以需要广播系统可以针对性的进行推送，避开触发此次广播的用户。
laravel 在每个请求中使用X-Socket-ID 来标识用户，客户端可以将X-Socket-ID 设为socketId，使用axios 时库会自动向header中添加，但使用其他请求库时可以在socket 连接建立后将X-Socket-ID配置如header，可以参考以下代码:
```js
echoInstance.connector.socket.on('connect', () => {
  http.defaults.headers.common['X-Socket-Id'] = echoInstance.socketId();
});
```

当请求携带有X-Socket-ID时，调用broadcast函数时使用toOthers 方法，即可将指定连接从广播接收者中排除。
```php
broadcast(new BroadcastDemo())->toOthers();
```
到目前为止，我们已经构建了一个可以适应大部分需求的广播系统的发送，接下来我们看看如何配置客户端。
## 客户端（接收广播）
### 建立连接
客户端需要使用 Socket.IO JavaScript库来建立文件，当启动laravel-echo-server 后，可以通过 server 地址及端口号获取Socket.IO 库，比如开发时通常使用http://localhost 与6001 端口，可以使用
```url
http://localhost:6001/socket.io/socket.io.js
```
获取到Socket.IO 库。
如果需要手动在客户端添加Socket.IO 库，请注意socket.io.js 版本，目前只有2.x 版本可以正常使用。

接着，我们需要在合适的时机建立实例化Echo(示例代码使用localhost 与6001端口)：
```js
import Echo from "laravel-echo"

const EchoInstance = new Echo({
    broadcaster: 'socket.io',
    host: 'http://localhost:6001'
});
```
实例化Echo 时，客户端的echo 库会发送http 请求到server 端请求建立连接。
### 加入频道
建立连接后可以使用echoInstance的channel 方法加入指定频道，使用listen 监听频道上的指定事件：
```js
echoInstance
      .channel('channelName')
      .listen('eventName', ()=>{
        //   callback
      })
```
需要退出频道时，使用leave 方法即可。
