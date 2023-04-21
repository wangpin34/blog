
---
title: React context 入门
tags: 文章
---
# Why？
通过 props 将数据层层传递**下去**是最常见的方式，也是最简单的。
```html
<Child data={data}/>
```
如果 child 层次太深，props 传递会非常啰嗦。
```html
<Parent1 data={data}/>
<Parent2 data={data}/>
<Parent3 data={data}/>
<Child data={data}/>
``` 
或者换一种思路，让 child 自己访问数据 - 这就是 context：在 context 中存储一些任何 child 都有可能访问的数据，然后在 component 中访问 context 对应的数据（也可以修改）。context 不那么常用，但很有必要掌握。

> 通常，你可以采用 redux 来解决上述问题（redux 也是构建于 context 之上的），如果你并不熟悉 redux 或者由于任何原因不想采用 redux 作为数据管理方案，可以使用本文介绍的 context 。
# Get started 
context 包含下面几个核心概念。
1. createContext
2. assign context
3. provider
4. consumer

分别说明：
## createContext
顾名思义，创建一个 context:
```javascript
const MyContext = React.createContext(defaultValue);
```
默认值可以给也可以不给。

## Assign context
新创建的 context 是独立存在的，如果要在 component 里面访问 context，需要先建立联系。方式有两种，这里先说第一种 assign context。顾名思义，就是直接将 context 分配给某个 component。

```javascript
class MyComponent extends React.Component {
  render () {
    let value = this.context;
    return (
      <div>{value}</div>
    )
  }
}

MyComponent.contextType = MyContext;
```
也可以使用 public class fields syntax, 这样写：
```
class MyComponent extends React.Component {
  static contextType = MyContext.
  render () {
    let value = this.context;
    return (
      <div>{value}</div>
    )
  }
}
```

## Provider 和 Consumer
Provider 用于配置初始数据，Consumer 用于**按需订阅** context。

### 配置 Provider
```javascript
<MyContext.Provider value={/**/}>
  <App/>
</MyContext.Provider>
```
**注意**，此处 value 是必须提供的。

### 按需订阅
在 component 内部通过对应的 Consumer 获取 value。这里完全可以根据具体业务决定是否访问 context，比 assign context 更灵活可控。

```javascript
class MyComponent extends React.Component {
  render () {
    let value = this.context;
    return (
      <MyContext.Consumer>
        {value => (
           <div>{value}</div>
         ) 
        }
      <MyContext.Consumer>
    )
  }
}
```

## defaultValue
你可能会注意到一旦使用 Provider & Context， value 是必须提供的，所以 defaultValue 不会起作用。因此，defaultValue 只能在使用第一种办法 Assign Context 时生效。一般 defaultValue 可以忽略。
##  更新 value
常见的做法是将 value 存储为 root component 的 state 或者子属性，然后更新对应数据。
```javascript
// index.jsx
class App extends React.Component {
  constructor(props) {
    this.state = { context: {} };
  }
  handleConextChange = () => {
    // change state here
  }
  render() {
    <Provider value={this.state.context}>
      <App handleContextChange={this.handleConextChange}/>
    </Provider>
  }
}
```
context value 不必一定是 plain object，也可以包含 function，这样的好处是可以直接将操作 context 的通过 context 的方式传递给 child component，但我不推荐这种写法。

# UseContext Hooks
React 16.8.x 发布了一系列 hooks api，旨在改变以往 class component 的诸多问题（开发和运行效率，阅读性）。如果你喜欢 hooks，那也可以尝试下 useContext。

```
const value = useContext(MyContext)
```

useContext 等价于上面介绍的 assign context。



