import { defineConfig } from 'vitepress'
import { getSideBarOptions } from './sideFile.mts';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "文档",
  description: "静态文档站点",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: getSideBarOptions().nav,

    sidebar: getSideBarOptions().sidebar

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  }
})
