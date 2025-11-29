# Modal-single

- 解释：只存在一个输入框的弹窗组件
- 组件参数：
  - :title：弹窗标题
  - :label：输入框标签
  - v-model:open：弹窗是否显示
  - v-modal:value：输入框需要绑定的值
  - @submit：点击确定事件
  - @close：点击取消事件

## 构建思路

- 原因： 首先是基于 antd modal 弹窗组件进行进一步封装，因为页面上可能会存在多个单次输入的弹窗，如果不进行组件封装的话，要么就在组件里写很多个 switch 语句，要么就在组件里写很多个 modal 组件，都不是很优雅。
- 实现： 组件里只包含一个 modal 弹窗组件，组件的显示隐藏由组件外部的 v-modal:visible 来控制 这样写内部的 ok 和取消事件也可以控制， 然后就是左上角的标题 以及需要绑定的名称和内容，需要外部提供，，还有验证，有些输入不能为空或者如果是邮箱的话，需要正则，所以还需要一个 rules 属性最后就是 submit 事件，这里主要考虑到可能是各种业务场景（修改、添加）还有就是时间处理完毕后刷新等回调函数
  ![alt text](image.png)

- 思路 我们可以看到 要实现这个组件需要考虑到以下几个方面：
  变化的地方：
  - 弹窗标题
    这里可以通过 props 传递，
  - 输入框标签
    这里也可以通过 props 传递
  - 输入框需要绑定的值
    这里可以通过 v-model:value 来传递
  - 验证规则
    这里可以通过 props 传递，
  - 确定和取消按钮事件
    这里可以通过 emit 事件来进行处理, 这里在确定和取消后触发对应的回调函数

# 参考源码 （vue3+TS）

- Modal-single 使用示例：
```vue
               <template >
        <a-modal v-model:open="open" :title="props.title" @close="close" @ok="ok" cancelText="取消" okText="确认">
          <a-form ref="formRef" :model="formModel" :rules="formRules" layout="vertical">
            <a-form-item name="value" :label="props.label">
              <a-input v-model:value="formModel.value" />
            </a-form-item>
          </a-form>

        </a-modal>
      </template>

  <script setup lang='ts'>
  import { ref } from 'vue'
  import type { FormInstance } from 'ant-design-vue'

const open = defineModel('open')
const value = defineModel('value')

const emit = defineEmits(['submit', 'close'])
const props = defineProps<{
title?: string
label?: string
rules?: Array<Record<string, any>>
}>()
const formRef = ref<FormInstance>()
const formModel = ref({
value: value.value ?? ''
})
const formRules = ref({
value: props.rules ?? []
})

const ok = async () => {
try {
await formRef.value?.validateFields(['value'])
open.value = false
emit('submit')
} catch (err) {

}
}
const close = () => {
open.value = false
emit('close')
}

</script>
<style scoped lang='less'></style>
 ```
# Modal-single 组件使用示例：
 ```vue
 <ModalSingle v-model:open="open" :title="title" :label="label" v-model:value="username"
:rules="[{ required: true, message: '请输入用户名' }]" @submit="handleSubmit" @close="close" />
<button @click="open = true">打开弹窗</button>
<button @click="close">关闭弹窗</button>
```
