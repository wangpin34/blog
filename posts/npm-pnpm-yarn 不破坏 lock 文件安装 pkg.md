
---
title: npm/pnpm/yarn 不破坏 lock 文件安装 pkg
tags: 
---
## yarn
```
yarn install --frozen-lockfile
```

## npm
```
npm ci
```
### Frozen Installs: 
1. It ignores package.json and installs only the exact versions listed in package-lock.json.
2. Strict Consistency: If the lockfile and package.json don't match, the command throws an error and stops.
3. Clean Slate: It automatically deletes your existing node_modules folder before starting to ensure no leftover files remain.
4. Speed: It is often faster than npm install because it skips the dependency resolution and "best-fit" logic.
