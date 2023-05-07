
---
title: 【译】python 静态方法和类方法的区别
tags: 译
---
# python staticmethod and classmethod

>Though classmethod and staticmethod are quite similar, there's a slight difference in usage for both entities: classmethod must have a reference to a class object as the first parameter, whereas staticmethod can have no parameters at all.
>
>Let's look at all that was said in real examples.

尽管 classmethod 和 staticmethod 非常相似，但在用法上依然有一些明显的区别。classmethod 必须有一个指向 **类对象** 的引用作为第一个参数，而 staticmethod 可以没有任何参数。

让我们看几个例子。


## 例子 - Boilerplate

> Let's assume an example of a class, dealing with date information (this is what will be our boilerplate to cook on):

```python
class Date(object):

    def __init__(self, day=0, month=0, year=0):
        self.day = day
        self.month = month
        self.year = year

```
> This class obviously could be used to store information about certain dates (without timezone information; let's assume all dates are presented in UTC).

很明显，这个类的对象可以存储日期信息（不包括时区，假设他们都存储在 UTC）。


> Here we have __init__, a typical initializer of Python class instances, which receives arguments as a typical instancemethod, having the first non-optional argument (self) that holds reference to a newly created instance.

这里的 __init__ 方法用于初始化对象的属性，它的第一个参数一定是 self，用于指向已经创建好的对象。

### Class Method

> We have some tasks that can be nicely done using classmethods.

>Let's assume that we want to create a lot of Date class instances having date information coming from outer source encoded as a string of next format ('dd-mm-yyyy'). We have to do that in different places of our source code in project.

利用 classmethod 可以做一些很棒的东西。

比如我们可以支持从特定格式的日期字符串来创建对象，它的格式是 ('dd-mm-yyyy')。很明显，我们只能在其他地方而不是 __init__ 方法里实现这个功能。

> So what we must do here is:

> Parse a string to receive day, month and year as three integer variables or a 3-item tuple consisting of that variable.
Instantiate Date by passing those values to initialization call.
This will look like:

大概步骤：
* 解析字符串，得到整数 day， month， year。
* 使用得到的信息初始化对象

代码如下
```python
day, month, year = map(int, string_date.split('-'))
date1 = Date(day, month, year)

```
理想的情况是 Date 类本身可以具备处理字符串时间的能力，解决了重用性问题，比如添加一个额外的方法。

> For this purpose, C++ has such feature as overloading, but Python lacks that feature- so here's when classmethod applies. Lets create another "constructor".

C++ 可以方便的使用重载来解决这个问题，但是 python 不具备类似的特性。 所以接下来我们要使用 classmethod 来帮我们实现。

```python
@classmethod
  def from_string(cls, date_as_string):
  day, month, year = map(int, date_as_string.split('-'))
  date1 = cls(day, month, year)
  return date1


date2 = Date.from_string('11-09-2012')
```

> Let's look more carefully at the above implementation, and review what advantages we have here:

> We've implemented date string parsing in one place and it's reusable now.
Encapsulation works fine here (if you think that you could implement string parsing as a single function elsewhere, this solution fits OOP paradigm far better).
cls is an object that holds class itself, not an instance of the class. It's pretty cool because if we inherit our Date class, all children will have from_string defined also.

让我们在仔细的分析下上面的实现，看看它的好处。

我们在一个方法中实现了功能，因此它是可重用的。 这里的封装处理的不错（如果你发现还可以在代码的任意地方添加一个不属于 Date 的函数来实现类似的功能，那很显然上面的办法更符合 OOP 规范）。 **cls** 是一个保存了 **class** 的对象（所有的一切都是对象）。 更妙的是， Date 类的衍生类都会具有 from_string 这个有用的方法。

### Static method

> What about staticmethod? It's pretty similar to classmethod but doesn't take any obligatory parameters (like a class method or instance method does).

> Let's look at the next use case.

> We have a date string that we want to validate somehow. This task is also logically bound to Date class we've used so far, but still doesn't require instantiation of it.

> Here is where staticmethod can be useful. Let's look at the next piece of code:

staticmethod 没有任何必选参数，而 classmethod 第一个参数永远是 cls， instancemethod 第一个参数永远是 self。

```python
@staticmethod
def is_date_valid(date_as_string):
  day, month, year = map(int, date_as_string.split('-'))
  return day <= 31 and month <= 12 and year <= 3999

# usage:
is_date = Date.is_date_valid('11-09-2012')
```
> So, as we can see from usage of staticmethod, we don't have any access to what the class is- it's basically just a function, called syntactically like a method, but without access to the object and it's internals (fields and another methods), while classmethod does.

所以，从静态方法的使用中可以看出，我们不会访问到 class 本身 - 它基本上只是一个函数，在语法上就像一个方法一样，但是没有访问对象和它的内部（字段和其他方法），相反 classmethod 会访问 cls， instancemethod 会访问 self。

## 参考
* [Meaning of @classmethod and @staticmethod for beginner?](https://stackoverflow.com/questions/12179271/meaning-of-classmethod-and-staticmethod-for-beginner)
