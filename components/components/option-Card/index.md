# 通过仿写antd Select选择器实现 卡片单选功能组件
## 效果
![alt text](image.png)

### 分析
* 首先我们分析AntD vue源码就会发现，他的结构大概有两层，一层是外层的a-select 一层内部的 a-select-option，然后在 a-select-option内 才是我们主要输入的内容，当在页面上点击具体的内容的时候 代码会将 a-select-option的value值赋值给 a-select的value值 最终我们会通过 a-select的value值 来判断用户选择了哪个选项。 那么实际上我们的这个组件和Select属性很相似的 具体由以下几点：
1. 首先 都需要有一个最终选项，即我们选择了哪一个
2. 其次 都有至少两个以上的选项
3. 最后 都需要有一个触发事件，当用户点击了某个选项的时候，需要触发一个事件，将用户选择的选项传递给外组件

### 思路
1. 需要写两个组件 因为页面中用到了 select 和select-option 两个组件
2. select本身 需要一个value值来接受最终选择的select-options的value值，所以我们需要在select上定义一个value在select-options上定义一个options属性
3. select-options需要一个点击事件来通知父组件用户点击了那个选项 

###  思考 
- 为什么我们需要写成两个组件呢？理论上写成一个组件，内部循环options组件不就好了吗？
 答案：因为select组件内可能不止放options组件，也有可能放其他组件，这个组件的目的，只是相当于中间组件，接受子组件的数据，然后展示传出到外部，内部的options组件其实可以看作是某一个组件或者某一类组件存在多个实例的情况

 ## 示例

### select
 ```vue   
   
   <template >
    <div class="selectCard">
      <slot></slot>
    </div>
  </template>
<script setup lang='ts'>
import { provide } from 'vue'
const value = defineModel('value')


const props = defineProps<{ selectIcon: Boolean }>()

const onOptionSelect = (val: any) => {
  value.value = val
}
provide('onSelect', { onOptionSelect, value, selectIcon: props.selectIcon })
</script>
<style scoped lang='less'>
.selectCard {
  display: flex;
  align-items: center;
  gap: 30px;
}
</style>
 ```
 通过上面的代码我们不难发现，这个组件十分的简单，首先需要一个value值来接受最终选择的select-options的value值 其次需要一个事件将从子组件拿到的值付值给这个value  最后 我们通过provide将这个事件和value值传递给子组件用来触发。


 *  为什么使用provide而不是emit？
  
 *     原因是因为我们的子组件是一个插槽，我们并不能确定子组件的具体内容，所以我们不能在子组件中直接定义一个事件，然后在父组件中监听这个事件，所以我们只能通过provide来传递这个事件和value值，子组件中通过inject来接收这个事件和value值，然后在子组件中触发这个事件，将值传递给父组件。


###  options 

```vue
  <template >
    <div @click="onSelected" :class="{ 'OptionCard-selected': selectd }" class="OptionCard">
      <div class="selectIcon" v-if="onSelect.selectIcon">
        <a-checkbox v-model:checked="selectd"> </a-checkbox>
      </div>
      <slot></slot>
    </div>
  </template>
<script setup lang='ts'>
import { ref, inject, computed } from 'vue'
const props = defineProps<{ option: any }>(
)
const onSelect: any = inject('onSelect')

const uidMap = new WeakMap<any, symbol>()
// 判断两个值是否相同
const isSame = (a: any, b: any) => {
  if (typeof a !== "object" || typeof b !== "object") {
    // 基本类型直接比较
    return a === b
  }
  // 对象类型用 WeakMap uid 判断
  if (!uidMap.has(a)) uidMap.set(a, Symbol())
  if (!uidMap.has(b)) uidMap.set(b, Symbol())
  return uidMap.get(a) === uidMap.get(b)
}

const selectd = computed(() => {
  return isSame(props.option, onSelect.value.value)
})

const onSelected = () => {
  onSelect.onOptionSelect(props.option)
}


</script>
<style scoped lang='less'>
.OptionCard {
  position: relative;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);


  .selectIcon {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 18px;
    height: 18px;
  }

  :deep(.ant-checkbox .ant-checkbox-inner) {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid #CCCCCC;
  }
}

.OptionCard:hover {
  transform: scale(1.02);

}
</style>

```

通过上面的option代码我们不难发现，这个组件也十分的简单，其主要包含了：

1. click 事件 用来触发点击选中某一个值的事件，
2. computed 用来判断当前选项是否被选中，
3. inject 用来接收父组件传递过来的事件和value值，

###  运行机制
那么这个组件大概是这样运行的，首先用户点击了某个选项，出发了click事件导致onSelected事件被执行 onSelect则会执行父组件传递过来的 onSelect.onOptionSelect事件 将当前选中的值也就是props.option的值传递给父组件的value值，然后将值传递到最终的value属性上。 其中，这里的selectd 以及isSame 都只是将当前选项的值与父组件传递过来的value值进行比较，判断是否相同，从而判断当前选项是否被选中。

- 后续 因为我们在子组件内写了slot，并且在option上传入option属性绑定的值  ，那么通过事件冒泡，最终会触发option的click将子组件的option的值传递到value  

## 实现： 如何以当前组件为基础实现一个相同的，但是多选的组件呢？

