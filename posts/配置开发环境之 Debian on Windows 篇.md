
---
title: 配置开发环境之 Debian on Windows 篇
tags: 
---
# 系统信息
Windows 11 x64
16GB RAM 

# 安装和配置 NodeJS

```bash
# install curl
sudo apt-get update
sudo apt-get install curl
# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# install nodejs latest
nvm install node
# install pnpm
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

**完成**。

参考：
1. [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
2. [pnpm](https://pnpm.io/installation)

# 安装和配置 Python
```
# 安装 pyenv
curl -fsSL https://pyenv.run | bash
# 安装最新版本，目前是 3.13.5
pyenv install 3.13.5
# 设置 3.13.5 为全局默认版本
pyenv global 3.13.5
```

pyenv install 的时候遇到报错：
```
configure: error: no acceptable C compiler found in $PATH
```
安装 compiler 解决错误：
```
sudo apt update
sudo apt install -y build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev

```

`完成`。

参考：https://github.com/pyenv/pyenv?tab=readme-ov-file#linuxunix
# 安装和配置 Git
```
sudo apt-get install ssh
sudo apt-get install git
```

在用户目录下创建 .ssh 目录，切进去，生成 ssh key
```
ssh-keygen -t ed25519 -C "your_email@example.com"
```
注意：设置private key的mode为 600，
```
chmod 600 id_ed25519
```
否则会遇到如下错误：
```
Permissions 0644 for '~/.ssh/id_ed25519' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
```
<hr/>
在同目录下，创建 config 文件，配置 ssh key 和 github host：

```
Host github
HostName github.com
User git
IdentityFile ~/.ssh/id_ed25519
```
在 github 账户下，导入对应的 public key。

**完成**。


# ~~配置 vscode server~~
这里直接跳过，vscode 原生可用，不需要安装任何lib。
# 安装和配置 [PostgreSQL](https://www.postgresql.org/)


