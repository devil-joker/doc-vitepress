# vitepress 简单使用

```
<!-- 根据src目录结构，动态生成导航 -->
import { getSideBarOptions } from './sideFile.mts';

{
  themeConfig: {
    nav: getSideBarOptions().nav,

    sidebar: getSideBarOptions().sidebar
  }
}
```

## 类型定义
```
type IItems = {
  text: string,
  link: string,
}[]
type SidebarConfigItem = {
  text: string,
  collapsed?: boolean,
  items: IItems
};
type SidebarOptions = Record<string, SidebarConfigItem[]>
```

| 取值         | 方法            | 类型         | 描述                             |
| ------------ | -------------- | ------------ | -------------------------------- |
| sidebarConfigSingle | getMdFileToGenerateSidebar | SidebarConfigItem[] | 生成单路由结构导航 |
| sidebarConfigSingle | getMdFileToGenerateSidebarMultiple | SidebarOptions | 生成多路由结构导航 |
