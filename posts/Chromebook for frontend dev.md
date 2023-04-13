
---
title: Chromebook for frontend dev
tags: 
---
## Before started
Recently my manager Phoneinx asked if I had an interest in the Chrome Book. She had a Chrome Book on her desk and she wanted to know if it could be a machine for software development. I said yes then I got the Chrome Book on my desk. Then I started.

## Vscode
Most of my daily work is coding and I usually work on vscode. Install Vscode on ChromeOS is a little bit tricky. You must install `Linux beta`(a new feature of ChromeOS) firstly and then install Vscode with Linux beta. The details of the process were documented here [Learning with VS Code on Chromebooks](https://code.visualstudio.com/blogs/2020/12/03/chromebook-get-started)

The installation of Linux Beta takes a couple of minutes. Actually, the process failed several times and I have to re-start it. After it was successfully installed, It opened a terminal, and I realized that a Linux terminal app was added to the apps panel. I pined the Linux to the bottom bar for quick access.  

## Inside Linux
My working and also my favorite programing language is JS. So I will install `NodeJS` toolchains.
### Install NodeJS
Install NVM (NodeJS version manager) firstly
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```
Usually, you have to reopen the terminal to find the `nvm` since it's not hot attached to the current working terminal.

Then type the following command in the new terminal,  the installation and configuration are successful if it outputs `nvm`. Please note that `which nvm` will not work, since nvm is a sourced shell function, not an executable binary.

Advanced troubleshooting please refer: https://github.com/nvm-sh/nvm/blob/master/README.md#troubleshooting-on-linux

Then install NodeJS, if you found nvm could not find available NodeJS versions for install, that might be caused by that curl could not found the location of SSL cert. Append the following express to ~/.bashrc to set the location.

```
export CURL_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
```

Then
```bash
nvm install node
```
This will install the latest NodeJS and NPM as well, if you'd like other versions, try to install with an exact version number. e.g. 
```
nvm install 14.17.4
```
`nvm` will set the latest installed version as the default. Use `nvm use <version>` to switch current version.

By the way, the NPM version will be installed or switched along with NodeJS. So you never need to worry about how to maintain the version pairs, resolve conflicts, etc.

### Other stuff if you like
```
npm install -g yarn
sudo apt-get install make
sudo apt-get install git
```

## Troubleshooting
### `git clone` got error `host key verification failed`


