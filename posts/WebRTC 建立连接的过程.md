
---
title: WebRTC 建立连接的过程
tags: 文章
---
WebRTC 帮助浏览器建议点对点的连接，并可以在连接之上搭建数据通道和流媒体通道，以完成复杂的通信过程。

两个客户端 pc1 和 pc2 建立连接需要的条件。
*  都能访问 stun 服务器

连接过程中需要的关键元素。
* offer 和 answer
* candidate

# 建立连接的过程(pc1 主动连接 pc2)

## Offer 和 answer
* pc1 和 pc2 分别创建连接对象
```javascript
var pc1 = new RTCPeerConnection(servers, pcConstraint);
var pc2 = new RTCPeerConnection(servers, pcConstraint);
```
* pc1 创建 offer，通过服务器转交给 pc2
```javascript
pc1.createOffer().then(function(offer) { 
  pc1.setLocalDescription(offer);
  sendToServer(offer);
})
```
* pc2 收到 offer，设置为 remote desc，同时创建 answer，通过服务器转交给 pc1
```javascript
pc2.setRemoteDescription(offer);
pc2.createAnswer().then(function(answer) { 
  pc2.setLocalDescription(answer);
  sendToServer(answer);
})
```

* pc1 收到 answer，设置为 remote desc
```javascript
pc1.setRemoteDescription(answer);
```

## Candidate
Candidate 的交换比较简单，pc1 和 pc2 分别获取自己的 Candidate， 通过服务器交换，然后添加到候选列表
```javascript
pc1.addIceCandidate(new RTCIceCandidate(pc2Candidate));

pc2.addIceCandidate(new RTCIceCandidate(pc1Candidate));
```

# Stream 和 dataChannel

待补充。
