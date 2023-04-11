
---
title: 服务器建站check list
tags: nginx,ssh
---
梳理一下利用服务器进行建站（而不是使用第三方直接托管的 container，比如 gitpages，lambda）的要点。

<hr/>

我们要建立一个网站，域名为 wangpin.com。技术栈为 React，[Express](https://expressjs.com/)。

> 以下内容只是思路，命令和脚本部分只是为了补充文字叙述的不足，且只适合当前服务器和应用。如果想要使用，最好考虑自己服务器和应用的特点，按图索骥，检索合适的办法。

> Linux 对读写权限的要求非常苛刻，比如 ssh 对 key 的要求，直接给 777（所有人都可以读写执行）会被认为不安全从而拒绝 load 这个key。如果对 Linux 的这套理念不太熟悉，或者甚至不太认同，则很难进行下去。本文的 ssh 部分，nginx 部分，都涉及到文件的权限问题。权限问题因不同的用户场景而不同，很难给出唯一的答案。不变的准则是：保证相关程序进程有足够的权限操作文件。

# 管理配置
## ssh 登陆
```
# Step 1： 在个人电脑生成密钥
ssh-keygen -t [rsa|dsa]
# Step 2:  将公钥(扩展名.pub)拷贝到服务器，将内容追加到 ~/.ssh/authorized_keys 文件， 主意是追加，而不是覆盖
```
主意：如果个人电脑已经存在密钥，则必须在 ~/.ssh/config 文件设置`访问服务器的ip或者对应的域名，使用这个私钥`，即ip和私钥的对应关系。如：

~/.ssh/config
```
Host [host alias]
HostName [ip address]
User [root or any valid user]
IdentityFile ~/.ssh/[private key file]
```

设置好之后（不需要重启服务器），就可以通过以下方式登陆服务器：
```
ssh root@[host alias]
```
## swap 分区（避免内存竞争导致程序轻易 crash）
```bash
dd if=/dev/zero of=/swapfile bs=1M count=1024
mkswap /swapfile
swapon /swapfile
# 添加这行： /swapfile swap swap defaults 0 0 到 /etc/fstab
echo  "/swapfile swap swap defaults 0 0" >> /etc/fstab
```
## 分配 web 目录，service 目录
```bash
# web 资源目录
mkdir /www/apps/[app-name]
# 修改 /www/apps/[app-name] 的用户和组，以及读写权限，确保 nginx 能够读取目录内容。nginix进程一般默认运行在 nginx 用户下，所以添加到 ngnix 用户即可。
mkdir /www/services/[service-name]
```
app 命名为 wangpin，则
```
mkdir /www/apps/wangpin
mkdir /www/services/wangpin
```

## ssl 证书（可选）
如果网站 enable https，则需要配置好 ssl 证书。我们将其存放在用户目录下，同样，***确保内容 nginx 可读***。
```
mkdir -p /users/wangpin/ssl-keys/wangpin/
```

# nginx 配置
假设域名为 wangpin.com
```
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    gzip  on;

    #include /etc/nginx/conf.d/*.conf;

    server {
      listen 80;
      server_name wangpin.com;
      return 301 https://$server_name$request_uri;
    }

    server {
      listen 443 ssl;
      server_name wangpin.com;
      ssl_certificate /users/wangpin/ssl-keys/wangpin/full_chain.pem;
      ssl_certificate_key /users/wangpin/ssl-keys/wangpin/private.key;
      ssl_session_cache shared:SSL:1m;
      ssl_session_timeout 30m;
      add_header Strict-Transport-Security "max-age=31536000" always;
      location /api {
        proxy_pass http://localhost:8080;
      }
      location / {
        root /www/apps/wangpin;
        index index.html;
        # support single page app 
        try_files $uri /index.html =404;
        expires max;
      }
    }
}
```

# 设置开机启动项（nginx，database，service）

# 设置自动化发布
使用  sftp 将构建好的文件上传到对应目录。sftp 利用刚开始生成和设置好的 ssl key。
```
sftp  root@[host alias]:/www/apps/wangpin <<EOF
# sftp command goes here
exit
EOF
```
使用ssh自动脚本重启service，这里我们使用 [forever](https://www.npmjs.com/package/forever) 管理 service。静态内容nginix会自己热替换。
```
ssh root@[host alias] <<EOF
cd /www/services/wangpin
yarn 
forever stopall
NODE_ENV=production forever start index.js
EOF
```

