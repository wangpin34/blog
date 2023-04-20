
---
title: secure log from filebeat to logstash and elasticsearch
tags: 
---
# To Elasticsearch
1. 生成证书和私钥。
```

openssl genrsa 2048 > host.key

openssl req -new -x509 -nodes -sha1 -days 3650 -key host.key > host.cert
```
因为是本地使用，host 一般都是 localhost，这里注意证书的 common name 也要设置成 localhost，否则会报以下错误：
```
certificate is valid for xxx, not localhost
```
```
Country: FI
State: Pirkanmaa
Locality: Tampere
Organization: masi
Organizational Unit Name: SSL Certificate Test
CommonName: localhost
EmailAddress: masi@gmail.com
```
2. 在 nginx 中启用 ssl，配置证书

nginx.conf
```
  ssl on;
  ssl_certificate /usr/local/openresty/nginx/certs/host.cert;
  ssl_certificate_key /usr/local/openresty/nginx/certs/host.key;
  ssl_session_timeout 5m;
  ssl_protocols TLSv1.2 TLSv1.1 TLSv1;
  ssl_ciphers HIGH:!aNULL:!eNULL:!LOW:!MD5;
  ssl_prefer_server_ciphers on;
```
2. filebeat.yml 中连接 elasticsearch，启用 https
3. 启动 elasticsearch，nginx 和 filebeat
```
$ elastic

$ service filebeat start
```

## Trouble shooting

### openssl certificate signed by unknown authority
服务器不认可个人通过 openssl 命令生成的证书，必须手动将此证书更新为可信任(Be trusted)。
[参考：adding-trusted-root-certificates-to-the-server](https://manuals.gfi.com/en/kerio/connect/content/server-configuration/ssl-certificates/adding-trusted-root-certificates-to-the-server-1605.html)
#### Ubuntu
1. 将证书文件拷贝到 /usr/local/share/ca-certificates。证书扩展名为 **crt**。
   实践发现扩展名 cert，pem 的不能被下面的命令识别，换成 crt 才可以。
2. 更新证书
```
$ sudo update-ca-certificates 
Updating certificates in /etc/ssl/certs...
1 added, 0 removed; done.
Running hooks in /etc/ca-certificates/update.d...

done.
```

# 参考文档
* [https://mapr.com/blog/how-secure-elasticsearch-and-kibana/](https://mapr.com/blog/how-secure-elasticsearch-and-kibana/)
