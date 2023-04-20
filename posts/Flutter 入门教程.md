
---
title: Flutter 入门教程
tags: flutter,移动端开发
---
## 安装配置
### 使用镜像
由于在国内访问Flutter有时可能会受到限制，Flutter官方为中国开发者搭建了临时镜像，大家可以将如下环境变量加入到用户环境变量中：

export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn

## 命令
Flutter tool 默认以匿名方式发送使用统计和崩溃报告给 google 官方，以作为分析和解决问题。可以通过下面这条命令禁用这项配置（不建议）。

flutter config --no-analytics"
