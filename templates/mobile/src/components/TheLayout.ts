import { defineComponent, h } from "vue";

export default defineComponent({
  name: 'TheLayout',
  setup (_, { attrs, slots }) {
    return () => h('div', { ...attrs, class: 'layout' }, slots)
  }
})