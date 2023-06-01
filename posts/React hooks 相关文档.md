
---
title: React hooks 相关文档
tags: 文章
---
从去年下半年以来开始实践 React Hooks，到现在一年多时间，谈谈感想。

# 相比 Class 组件
React 官方包括社区里很多大神解释过为什么 Hooks 是更好的选择，从提高编译效率，运行效率，开发体验多个方面都总结出很多很棒的例子。作为普通开发者，我更加看中的是最后一点，因为这与自己的日常工作息息相关，这倒不是说其他两个就不重要了，只是对于个人的影响没有那么深刻。
那么，Hooks 带来了什么好处呢？
首先，使用 Hooks 可以更加方便的描述数据之间的依赖关系，最典型的如 useMemo 的用法，如下，通过 a，b 推导出 c。

```javascript
const { a, b } = props
const c = useMemo(() => a + b, [a, b])
```
c 是 jsx 里直接使用的变量，当然，这个例子不太具有说服力。但是这里的数据联动关系更加清晰了。当 a，b 变化时，重新计算 c 的值。

其次，side effect 更加直观，以往在 class 组件中，需要在特定的 life cycle 如 componentDidMount 这样的方法里管理 side-effect，使用 Hooks 可以直接编写。
```javascript
useEffect(() => {
  document.body.addEventListener('resize', onResize)
}, [])
```
而且，可以很方便的在 effect 退出时就地清理现场。
```javascript
useEffect(() => {
  document.body.addEventListener('resize', onResize)
  return () => {
    document.body.removeEventListener('resize', onResize)
  }
}, [])
```
而不用像 class 组件中，先将 onResize 保存为实例变量，然后在 compoentWillUnmount 中清理。

最后，也是使用 Hooks 一段时间感受到，除了 useEffect，其他 Hooks 都是没有副作用的纯数据。那将某些可以重用的 Hooks 单独拿出来定义，然后组合起来使用，也是很自然的事情。这就是 custom Hooks。

# 相比 HOC
在 Hooks 之前，很多重用逻辑的场合，如导入额外的 props，需要使用 HOC。如常见的，withRouter(react-router-dom)，withStyles(material-design)。如果需要导入的东西比较多，就会写成这样：withStyles(withRouter(withX(withY(withZ(Component)))))，少一个括号就能debug半天。

Hooks 发布之后，这些 lib 也实现了 Hooks 接口，代码看起来会像这样：
```
function Component() {
  const history = useHistory()
  const classes = useStyles()
  // others
}
```
可阅读性提高很多。

此外，自己定制 Hooks 也极其简单，比如，我自己做了一个 file picker。

```javascript
import { useMemo, useEffect } from 'react'
import { useObservable } from 'rxjs-hooks'
import { BehaviorSubject } from 'rxjs'

function useFilepicker() {
  const subject$ = useMemo(() => new BehaviorSubject<string>(''), [])
  const v$ = useMemo(() => new BehaviorSubject<{ name?: string; content?: string } | null>(null), [])
  const v = useObservable(() => v$)
  useEffect(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.name = 'my-file'
    input.style.display = 'none'
    document.body.appendChild(input)

    const onChange: EventListener = (event: Event): any => {
      const files = (event.target as HTMLInputElement).files
      if (files && files.length) {
        const file = files[0]
        const fileReader = new FileReader()
        fileReader.readAsText(file)
        fileReader.onload = (e: ProgressEvent<FileReader>): any => {
          console.log('File read operation successfully complete')
          const result = e.target ? (e.target.result as string) : ''
          v$.next({
            name: file.name,
            content: result,
          })
        }
      }
      return
    }

    input.addEventListener('change', onChange)

    const subscrition = subject$.subscribe((v) => {
      console.log(`Received message from handlers: ${v}`)
      if (v === 'open') {
        input.click()
      }
    })

    return () => {
      input.removeEventListener('change', onChange)
      document.body.removeChild(input)
      subscrition.unsubscribe()
    }
  }, [subject$, v$])

  return useMemo(
    () => ({
      handlers: {
        open: () => subject$.next('open'),
      },
      value: v,
    }),
    [subject$, v]
  )
}

export default useFilepicker
```

# 总结
诞生于 2018 年的 Hooks 已经面世两年时间了，从我个人的体验来说，Hooks 对开发体验的提升是一场革命。开发人员可以用更清晰地数据逻辑来编写组件，更简单地方式来封装数据以及数据相关的逻辑。

我想，我是真的离不开 Hooks 了（笑）。

下面是收藏的一些关于 Hooks 的文章。
# 文章

* [React Hoos RFC](https://github.com/reactjs/rfcs/pull/68)
* [Making Sense of React Hooks - medium](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)
  [Making Sense of React Hooks - dev.to/](https://dev.to/dan_abramov/making-sense-of-react-hooks-2eib)
* [React hooks: not magic, just arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)
* [Do React Hooks replace Higher Order Components](https://medium.com/javascript-scene/do-react-hooks-replace-higher-order-components-hocs-7ae4a08b7b58)
