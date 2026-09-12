import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { useData } from 'vitepress'
import Home from './Home.vue'
import Intro from './Intro.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    const { frontmatter } = useData()
    // 首頁（frontmatter 有 layout: home）使用完全自訂版面
    // 簡介頁（layout: intro）用另一套自訂版面
    // 其他頁面（例如未來新增的文件頁）維持 VitePress 預設文件版面
    if (frontmatter.value.layout === 'home') {
      return h(Home)
    }
    if (frontmatter.value.layout === 'intro') {
      return h(Intro)
    }
    return h(DefaultTheme.Layout)
  },
  enhanceApp({ app }) {}
}
