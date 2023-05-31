
---
title: styled-components 源码阅读
tags: 文章,styled-components
---
 本次阅读的源码包括：
https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constructors/styled.js
https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constructors/constructWithOptions.js
https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/models/StyledComponent.js

约定一下简称，方便阅读：
SC - styled-component， 即一个 styled-component

<hr/>


# 详细解析
## styled.js
styled.js 是 styled API 的入口，常用的 API 如 styled.div 或者 styled(MyComponent) 即是从这个文件开始的，主要代码很少，如下所示：

styled.js
```typescript
import constructWithOptions from './constructWithOptions';
import StyledComponent from '../models/StyledComponent';
import domElements from '../utils/domElements';

import type { Target } from '../types';

const styled = (tag: Target) => constructWithOptions(StyledComponent, tag);

// Shorthands for all valid HTML Elements
domElements.forEach(domElement => {
  styled[domElement] = styled(domElement);
});

export default styled;
```
styled 函数接收一个 targe （预定义组件如 div 或者任何自定义组件），返回 constructWithOptions 函数的运算结果。后面我们会看到 constructWithOptions 的运算结果就是生成一个 SC。

## constructWithOptions.js
constructWithOptions 的代码也不多，如下所示：
constructWithOptions.js
```typescript
export default function constructWithOptions(
  componentConstructor: Function,
  tag: Target,
  options: Object = EMPTY_OBJECT
) {
  if (!isValidElementType(tag)) {
    throw new StyledError(1, String(tag));
  }

  /* This is callable directly as a template function */
  // $FlowFixMe: Not typed to avoid destructuring arguments
  const templateFunction = (...args) => componentConstructor(tag, options, css(...args));

  /* If config methods are called, wrap up a new template function and merge options */
  templateFunction.withConfig = config =>
    constructWithOptions(componentConstructor, tag, { ...options, ...config });

  /* Modify/inject new props at runtime */
  templateFunction.attrs = attrs =>
    constructWithOptions(componentConstructor, tag, {
      ...options,
      attrs: Array.prototype.concat(options.attrs, attrs).filter(Boolean),
    });

  return templateFunction;
}
```
我们可以看到函数返回一个叫做 templateFunction 的函数，它会把传入的 args 作为 css 内容，交由 css-helper 生成为 style-sheet，然后调用 componentConstructor 以生成 SC。在上一个文件中，我们已经知道这里的 componentConstructor 是指第三个文件 StyledComponent.js 的 **default export**  的函数。这里可以预先说明一下这个函数，主要功能就是根据 tag 和 css 生成 styled-component。

另外一个值得注意的是 withConfig 和 attrs 的实现，attrs 和 config 的内容会被合并到 options，最后依然递归调用 constructWithOptions。这也是为什么我们在定义 SC 时像 Jquery 那样写链式代码。有兴趣的可以搜一下关于 Jquery 链式操作的文章，这里不多说。

## StyledComponent.js
这个文件比较长，还是按照调用顺序，我们先看一下上面提到的 default export。

``` typescript
export default function createStyledComponent(target: Target, options: Object, rules: RuleSet) {
  const isTargetStyledComp = isStyledComponent(target);
  const isClass = !isTag(target);

  const {
    displayName = generateDisplayName(target),
    componentId = generateId(ComponentStyle, options.displayName, options.parentComponentId),
    ParentComponent = StyledComponent,
    attrs = EMPTY_ARRAY,
  } = options;

  const styledComponentId =
    options.displayName && options.componentId
      ? `${escape(options.displayName)}-${options.componentId}`
      : options.componentId || componentId;

  // fold the underlying StyledComponent attrs up (implicit extend)
  const finalAttrs =
    // $FlowFixMe
    isTargetStyledComp && target.attrs
      ? Array.prototype.concat(target.attrs, attrs).filter(Boolean)
      : attrs;

  const componentStyle = new ComponentStyle(
    isTargetStyledComp
      ? // fold the underlying StyledComponent rules up (implicit extend)
        // $FlowFixMe
        target.componentStyle.rules.concat(rules)
      : rules,
    finalAttrs,
    styledComponentId
  );

  /**
   * forwardRef creates a new interim component, which we'll take advantage of
   * instead of extending ParentComponent to create _another_ interim class
   */
  let WrappedStyledComponent;
  const forwardRef = (props, ref) => (
    <ParentComponent {...props} forwardedComponent={WrappedStyledComponent} forwardedRef={ref} />
  );
  forwardRef.displayName = displayName;
  WrappedStyledComponent = React.forwardRef(forwardRef);
  WrappedStyledComponent.displayName = displayName;

  // $FlowFixMe
  WrappedStyledComponent.attrs = finalAttrs;
  // $FlowFixMe
  WrappedStyledComponent.componentStyle = componentStyle;

  // $FlowFixMe
  WrappedStyledComponent.foldedComponentIds = isTargetStyledComp
    ? // $FlowFixMe
      Array.prototype.concat(target.foldedComponentIds, target.styledComponentId)
    : EMPTY_ARRAY;

  // $FlowFixMe
  WrappedStyledComponent.styledComponentId = styledComponentId;

  // fold the underlying StyledComponent target up since we folded the styles
  // $FlowFixMe
  WrappedStyledComponent.target = isTargetStyledComp ? target.target : target;

  // $FlowFixMe
  WrappedStyledComponent.withComponent = function withComponent(tag: Target) {
    const { componentId: previousComponentId, ...optionsToCopy } = options;

    const newComponentId =
      previousComponentId &&
      `${previousComponentId}-${isTag(tag) ? tag : escape(getComponentName(tag))}`;

    const newOptions = {
      ...optionsToCopy,
      attrs: finalAttrs,
      componentId: newComponentId,
      ParentComponent,
    };

    return createStyledComponent(tag, newOptions, rules);
  };

  // $FlowFixMe
  Object.defineProperty(WrappedStyledComponent, 'defaultProps', {
    get() {
      return this._foldedDefaultProps;
    },

    set(obj) {
      // $FlowFixMe
      this._foldedDefaultProps = isTargetStyledComp ? merge(target.defaultProps, obj) : obj;
    },
  });

  if (process.env.NODE_ENV !== 'production') {
    // $FlowFixMe
    WrappedStyledComponent.warnTooManyClasses = createWarnTooManyClasses(displayName);
  }

  // $FlowFixMe
  WrappedStyledComponent.toString = () => `.${WrappedStyledComponent.styledComponentId}`;

  if (isClass) {
    hoist(WrappedStyledComponent, target, {
      // all SC-specific things should not be hoisted
      attrs: true,
      componentStyle: true,
      displayName: true,
      foldedComponentIds: true,
      styledComponentId: true,
      target: true,
      withComponent: true,
    });
  }

  return WrappedStyledComponent;
}
```
先不理最前面准备数据的部分，从 **  let WrappedStyledComponent; ** 看起。我们看到这里通过 React.forwardRef 将 ref 传递给 SC （也就是这个 ParentComponent）。比较特别的，WrappedStyledComponent 的构造函数也作为一个 prop 传递给了 SC。这里的真实目的是将后续赋予给 WrappedStyledComponent 诸多 props 如 id，attrs，css，捎带给 SC。

```typescript
  const forwardRef = (props, ref) => (
    <ParentComponent {...props} forwardedComponent={WrappedStyledComponent} forwardedRef={ref} />
  );
  WrappedStyledComponent = React.forwardRef(forwardRef);
```

下面是 SC 的 render 方法中，使用这些 props 创建内容。期间历经多次的数据预处理，组合与变换。
```typescript
  renderInner(theme?: Theme) {
    const {
      componentStyle,
      defaultProps,
      displayName,
      foldedComponentIds,
      styledComponentId,
      target,
    } = this.props.forwardedComponent;

    let generatedClassName;
    if (componentStyle.isStatic) {
      generatedClassName = this.generateAndInjectStyles(EMPTY_OBJECT, this.props);
    } else {
      generatedClassName = this.generateAndInjectStyles(
        determineTheme(this.props, theme, defaultProps) || EMPTY_OBJECT,
        this.props
      );
    }

    const elementToBeCreated = this.props.as || this.attrs.as || target;
    const isTargetTag = isTag(elementToBeCreated);

    const propsForElement = {};
    const computedProps = { ...this.props, ...this.attrs };

    let key;
    // eslint-disable-next-line guard-for-in
    for (key in computedProps) {
      if (process.env.NODE_ENV !== 'production' && key === 'innerRef' && isTargetTag) {
        this.warnInnerRef(displayName);
      }

      if (key === 'forwardedComponent' || key === 'as') {
        continue;
      } else if (key === 'forwardedRef') propsForElement.ref = computedProps[key];
      else if (key === 'forwardedAs') propsForElement.as = computedProps[key];
      else if (!isTargetTag || validAttr(key)) {
        // Don't pass through non HTML tags through to HTML elements
        propsForElement[key] = computedProps[key];
      }
    }

    if (this.props.style && this.attrs.style) {
      propsForElement.style = { ...this.attrs.style, ...this.props.style };
    }

    propsForElement.className = Array.prototype
      .concat(
         ,
        styledComponentId,
        generatedClassName !== styledComponentId ? generatedClassName : null,
        this.props.className,
        this.attrs.className
      )
      .filter(Boolean)
      .join(' ');

    return createElement(elementToBeCreated, propsForElement);
  }
```
比较有意思的几个点：
1. 在开发模式下，styled-components 会尝试警告 innerRef [在 v4 中已经废弃](https://www.styled-components.com/docs/api#deprecated-innerref-prop)。
2. 我们第一次注意到熟悉的 className。我们经常会发现明明只 assign 了一个 className，但实际的 html 标签上却有很多 className 连接在一起。这里说明了这些 className 的来源：
 * 根据 style 内容动态生成
 * 通过 attrs 手动添加的 className
 * Props 引入的 className
 * 其他：styledComponentId （display name + componentId） 和 foldedComponentIds（target 
 SC 的 styledComponentId + foldedComponentIds）

# 总结
这三个文件虽然总代码量并不大，但基本算是 styled-components library 的核心了。我们看到了以下问题的答案：
1. styled.div.`css rules` 是如何工作的？
styled-components [官方介绍](https://www.styled-components.com/docs/advanced#tagged-template-literals)说 styled API 使用了 es6 的 [Tagged Template Literals](http://es6.ruanyifeng.com/#docs/string#%E6%A8%A1%E6%9D%BF%E5%AD%97%E7%AC%A6%E4%B8%B2)。其实这个东西我几乎每天都在用，比如输出 log ：
```javascript
console.log(`Today: ${Date.now()}`)
```
之所以我会觉得 styled 的方式难以理解，是因为我一直没有看到这个知识点：[标签模版](http://es6.ruanyifeng.com/#docs/string#%E6%A0%87%E7%AD%BE%E6%A8%A1%E6%9D%BF)
。阅读完之后你会知道，以下写法是等价的：
```javascript
styled.div`display: block;`
styled.div('display: block')
```
如果模板里包含变量，则会进行更复杂的转换：
```javascript
let a = 5;
let b = 10;

tag`Hello ${ a + b } world ${ a * b }`;
// 等同于
tag(['Hello ', ' world ', ''], 15, 50);
```
这解释了为什么 constructWithOptions.js 中 args（css 内容）会以下面的方式传递进来。

```javascript
  const templateFunction = (...args) => componentConstructor(tag, options, css(...args));
```
2. SC 是如何与 style 绑定的？
每个 SC 拥有自己的 className 数组，我们称为 list。首先，SC 会计算并生成自己的 className ，添加到 list 中。 这个 className 会 match 到自己的 style-sheet（即模板中定义的 css 内容）。然后，如果 target 也是 SC，则当前 SC 也会将 target 的 className 添加到 list 。这样，list 中就包含了自己 style 的 className，和 target SC 的 className。所以， SC 就能利用到 target 的 style，相应的， target 也会同样利用到自己 target（如果有） 的 style。这看起来很像是面向对象的继承，起码起到了继承的效果不是。
    
能够继承 style，是 styled-components 一个很强大的地方。另一个方面，每个 SC 的 style 是独占的，别的 SC 不可访问更不可修改，从这个角度来说，也算是具有一定的封装。你看，面向对象的特征嘛。


