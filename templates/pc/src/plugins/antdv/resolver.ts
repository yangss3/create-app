const viteIgnoredPrefix = [
  'AForm',
  'ALayout',
  'ABreadcrumb',
  'ADropdown',
  'AMenu',
  'ASubMenu',
  'AStep',
  'ACheckbox',
  'ARadio',
  'ADatePicker',
  'AMonthPicker',
  'ARangePicker',
  'AWeekPicker',
  'AInput',
  'ATextarea',
  'ASelect',
  'ATree',
  'ACard',
  'ACollapse',
  'AList',
  'AStatistic',
  'ATable',
  'ATab',
  'ATimeline',
  'AAnchor',
  'ADescriptions'
]

export default (name: string) => {
  if (
    name.match(/^A[A-Z]/) &&
    !viteIgnoredPrefix.some((prefix) => name.startsWith(prefix))
  ) {
    return {
      importName: name.slice(1),
      path: 'ant-design-vue'
    }
  }
}
