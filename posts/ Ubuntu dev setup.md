
---
title:  Ubuntu dev setup
tags: 周记
---
## apt-get
[apt-get](https://debian-handbook.info/browse/stable/sect.apt-get.html) is the package management tool for ubuntu
``` 
apt-get install software-name
apt-get update
```
### Proxy
Edit **/etc/apt/apt.conf**

```
Acquire::http::proxy "http://<proxy>:<port>/";
Acquire::ftp::proxy "ftp://<proxy>:<port>/";
Acquire::https::proxy "https://<proxy>:<port>/";
```
With user name
```
Acquire::http::proxy "http://<username>:<password>@<proxy>:<port>/";
Acquire::ftp::proxy "ftp://<username>:<password>@<proxy>:<port>/";
Acquire::https::proxy "https://<username>:<password>@<proxy>:<port>/";
```

ps.there is another way to config proxy, not works at my os.
[How to run “sudo apt-get update” through proxy in commandline?](https://askubuntu.com/questions/7470/how-to-run-sudo-apt-get-update-through-proxy-in-commandline)

#### References:
* [how to install packages with apt-get on a system connected via proxy?](https://askubuntu.com/questions/89437/how-to-install-packages-with-apt-get-on-a-system-connected-via-proxy)

### Update apt cache
Update local packages indexes. This is required before install/update packages.
```bash
sudo apt-get update
```

## Install nodejs/npm
```bash
sudo apt-get install nodejs
sudo apt-get install npm
```

### Problems
* node command not found

Need install nodejs-legacy package, it's a symlink bug fix: sudo apt-get install nodejs-legacy. Then install npm: sudo apt-get install npm. And right way to install Node.js:
```bash
sudo apt-get install nodejs
sudo apt-get install nodejs-legacy
sudo apt-get install npm
```
[install-node-js-in-ubuntu-14-04](https://askubuntu.com/questions/702157/install-node-js-in-ubuntu-14-04)

* Update nodejs to latest version

Usually the installed nodejs by apt-get is very old, we may need to update it to newer version.
[n](https://github.com/tj/n) is the node version management tool which can run on any platform. But on my virtual ubuntu it  doesn't work. It throws a error **invalid version**.

Finally, I find another way to install the latest nodejs.

Step 1: Add NodeJs PPA

First, you need to node.js PPA in our system provides by nodejs official website. We also need to install python-software-properties package if not installed already.
```bash
$ sudo apt-get install python-software-properties
$ curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
```
Step 2: Install Node.js and NPM

After adding required PPA file lets install Node package. NPM will also be installed with node.js. This command will also install many other dependent packages on your system.
```bash
$ sudo apt-get install nodejs
```
Step 3: Check Node.js and NPM Version

After installing node.js verify and check the installed version. You can find more details about current version on node.js official website.
```bash
$ node -v 

v7.5.0
```
Idea from [How to Install Latest Nodejs & Npm on Ubuntu 16.04 & 14.04](https://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/)


## Install mongodb
```
$ sudo apt-get install mongodb
```
After installed, you can create db in mongodb command line
```
$ mongo
> use mydbname
> db.collectionname.insert({})
```

## Share folder
mount share folder
```bash
$ sudo mount -t vboxsf -o uid=$UID,gid=$(id -g) share ~/host
```

## References
* [apt-get man book](https://linux.die.net/man/8/apt-get)
* [apt-get howto](https://help.ubuntu.com/community/AptGet/Howto)
* [apt-get useful commands](https://www.tecmint.com/useful-basic-commands-of-apt-get-and-apt-cache-for-package-management/)
* [debian apt-get](https://debian-handbook.info/browse/stable/sect.apt-get.html)
