import { defineComponent, h } from "vue";

export default defineComponent({
  name: 'TheLayoutContent',
  setup (_, { attrs, slots }) {
    return () => h('div', { ...attrs, class: 'layout-content' }, slots)
  }
})