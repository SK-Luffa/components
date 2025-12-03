# 通过仿写antd Select选择器实现 卡片单选功能组件
## 效果
![alt text](image.png)

### 分析
* 首先我们分析ANTvue源码就会发现，他的结构大概有两层，一层是外层的a-select 一层内部的 a-select-option，然后在 a-select-option 才是我们主要输入的内容，当在页面上点击具体的内容的时候 代码会将 a-select-option的value值赋值给 a-select的value值 最终我们会通过 a-select的value值 来判断用户选择了哪个选项。 那么实际上我们的这个组件和Select属性很相似的 具体由以下几点：
1. 首先 都需要有一个最终选项，即我们选择了哪一个
2. 其次 都有至少两个以上的选项
3. 最后 都需要有一个触发事件，当用户点击了某个选项的时候，需要触发一个事件，将用户选择的选项传递给外组件

### 思路
1. 需要写两个组件 因为页面中用到了 select 和select-option 两个组件
2. select 需要一个value值来接受最终选择的select-options的value值
