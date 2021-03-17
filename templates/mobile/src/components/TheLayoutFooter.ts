import { defineComponent, h } from "vue";

export default defineComponent({
  name: 'TheLayoutFooter',
  setup (_, { attrs, slots }) {
    return () => h('div', { ...attrs, class: 'layout-footer' }, slots)
  }
})