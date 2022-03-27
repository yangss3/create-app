/* eslint-disable @typescript-eslint/ban-types */
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'postcss-preset-env' {
  const PostCSSPresetEnv: any
  export default PostCSSPresetEnv
}
