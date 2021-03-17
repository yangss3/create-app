import { defineComponent, h } from "vue";

export default defineComponent({
  name: 'TheLayoutHeader',
  setup (_, { attrs, slots }) {
    return () => h('div', { ...attrs, class: 'layout-header' }, slots)
  }
})