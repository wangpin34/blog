
---
title: 5 must-read tips before start your own ui lib 
tags: 文章
---
# Where are my ideas from?
Every web engineer likes to build small tools or libraries and love to introduce them to others. My story about creating an ui libraray is different because it's a have-to-do task for me since the [antd-mobile](https://mobile.ant.design/) we were used was not suited our needs on lots of areas. So I came to an idea that it's the time to create our own.

During the time before I released the beta version of the library, I had resolved lots of issues and rebuild my knowledge again and again. And it came to 5 key tips as following. They are probably not the one you had to spend more time to learn and understand, but it's easy to be ignored.

# Tips
##  Never rely on CSS from a parent too much
Because styles in a parent could be inherited by its children(and descendants ) easily(You don't have to code it), and by default.  Most of the cases this feature is great since the same style will be applied onto the descendants without explicit declare. But others it's will be a nightmare. They are as following:

1. Some styles that parent defined break the style of children. 
2. Some required styles are inherited from a parent and now they are removed because of any reasonable request. 

e.g. 
```css
.parent {
 background-color: silver;
 color: #000;
}
.child {
  color: #000;
}

```
And then one day the background-color and color of the parent are totally changed but forget to change the child as well.

```css
.parent {
 background-color: #1a2a3a ;
 color: #dddddd;
}
.child {
  color: #000;
}

```
It ends with unreadable text content in the child component. 

Think about how many times you have been beaten by this kind of issue. It's easy to be fixed,  absolute yes. But, it's easier to be broken,  when you, or somebody else who is working on the code repo and try to update just the colors but accepts a bug report Immediately.

So in order o keep every piece of your code about styles are robust, please have this principle in mind:
> A component should have enough styles for basic visual effects
 
##  Use margin and padding the right way
What's the usual stuff you are using to give the distance between components? In my old understanding, margin and padding can work in the same way. But, they are actually different.

![屏幕快照 2019-08-06 下午4 12 49](https://user-images.githubusercontent.com/12655367/62522845-1c72bd00-b865-11e9-87f6-66d7a32c6374.png)

The major difference is the margin is outside of the edge of the border, but the padding is inside the edge of the border. That says the padding is much closer to the content of the component. In addition, from the visual effect, the border is like the boundary of the component with others, and the background will apply to the padding area but not margin. According to these clues, the padding is more like to be part of the component itself and the margin is not.

And think about this case. We give the padding as distance with others to the component, it works fine. 
![屏幕快照 2019-08-06 下午4 26 55](https://user-images.githubusercontent.com/12655367/62523761-0960ec80-b867-11e9-934d-67132aa47f04.png)

And after then we are going to add a border to the component. Think about what will happen?
![屏幕快照 2019-08-06 下午4 32 34](https://user-images.githubusercontent.com/12655367/62524237-d539fb80-b867-11e9-90d4-2d88bc1f2916.png)

So what we learned?
1. Use the padding to define the distance between the content with border. It should be controlled by the component itself.
2. Use the margin to define the distance between the components, it should be controlled by the parent(or parent of parent) of the components.

## Consider theme as earlier as possible
There are two reasons you'd better use theme(e.g. An js object which holds all values of styles, like font, color, etc).

1.  Avoid copy and paste the style values everywhere.

As we learned from tip 1, we are going to give the necessary styles to each of the components. If the components are many, this gonna be a huge work. There are lots of style values we have to add to the components, color, font family, margin, padding, etc. It's boring to copy and paste one by one, and it's easy to be made a mistake. Your team will get tired very soon. The straight forward way to improve the process is to have a theme provider which can provide the references to the values so it's possible to refer these references instead of the values.  It can even evolve into styles generator and injection according to the skill sets of your team.

2.  Change the theme on the fly

More and more apps are going to have 2 themes self-contained at least. One for day and another for the night. By toggle the theme we had plugined in the app, it's being a much easy work.

Another reason(maybe the more common) you better to owen the theme is,  your boss or your designer likes changing on the UX frequently.

According to above, With theme is a good approach to increase code quality, and very suits UX which never stop changes.  If you make this decision you'd better start it as soon as possible.  
> The earlier you started, the less work you have to do while refactoring the code.

## Never use global CSS
If you have read tip 1 and accept it, then you should absolutely forget any global styles - the style sheet you put in an external CSS file or inside the style tag. They do not belong to any component but Influence the visual effect of the components everywhere - acts as the root parent. You will easy to abuse the global styles to style the components, such as some of the styles should be injected to the particular component actually but you put it in the global scope since it's much easier.

The only usage of global style is to reset, only. Component style to the component, this is the rule we have made just now, aren't we?
## Splitting component at the right moment.
Splitting component into several sub-components when you meet the following problems(Priority from high to low): 
* The component is too big to read/change.
* More than half of code in the component never changed after the first version, but the rest of the code changed a lot;
* Reuse some of the code snippets

Previously my understand about what the major motivation of splitting a big component is to reuse parts of its code snippets. But actually, most of the components(especially the business components)  have very few code snippets are available for reuse. In this case, according to my old understanding, it's OK to keep there and don't do code splitting since no reuse needed. Then I got a large number of huge components. 

The correct way is not that. You are free to separate component into smaller pieces if you think it's better to control the complexity. Yes, the purpose of component-splitting is not to reuse them but to low down the complexity so that the code is readable and maintainable. Reuse is an attractive feature but it's more like a side effect of component-splitting but not the major purpose.

**And you never need to worry about this part in the first version of the library**.

# My store:  Why I had made a new UI library
Several weeks ago I started to make a new UI library on top of reactjs and styled-components. The reason why I make this choice because the visual documents powered by our design team introduced more and more different from what the library we are currently used to build the app could support. You know,  customization on such a UI library never been an easy job. Especially most of the customizations are kind of changes about UX(animation, layout, etc) on basic components(that's totally different with a process like composite basic components and then got a business component).  So, compare to patches which will lead to an unmaintained as a final result, I have to start from a new project with functions we product only needs.

Although essentially speaking, I did not make it from zero at all. I copied lots of idea/code snippets from a well know project named smooth-ui and copied as much as more design of API from antd-mobile. Since our app was built by Antd-mobile at that moment,  so I thought it's better to follow the same API. 

Now the beta of this library has been released and integrated by two projects successfully. My knowledge of building a ui library has been grown a lot. I think the most valuable things from what I have learned from this work is not any particular skills about programing languages, but Methodology. I'm not good at summary things like that. I will write, think, again and again. Hope to leave valuable articles.






    
