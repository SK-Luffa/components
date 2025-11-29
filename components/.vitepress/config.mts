import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "home",
  description: "A VitePress Site",
  base: '/components/', // 如果仓库名是 components；请替换为你的实际仓库名
  themeConfig: {

    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [

          { text: '单个弹窗修改组件', link: '/components/Modal-single/index.md' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'hhttps://github.com/SK-Luffa/components' }
    ]
  }
})
