import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const docsPath = join(__dirname, '../src');

type IItems = {
  text: string,
  link: string,
}[]
type SidebarConfigItem = {
  text: string,
  collapsed?: boolean,
  items: IItems
};
// type SidebarOptions = Record<string, SidebarConfigItem[]>
type ConfigOption = {
  name: string,
  [key: string]: string
}

// const sidebarConfigMultiple: SidebarOptions = {};
const sidebarConfigSingle: SidebarConfigItem[] = [];

export function getSideBarOptions() {

  if (!sidebarConfigSingle.length) {
    getMdFileToGenerateSidebar();
  }

  return {
    nav: sidebarConfigSingle.map(v => {
      return {
        text: v.text, link: v.items[0].link
      }
    }).filter(v => v.link),
    sidebar: sidebarConfigSingle
  }
}

// 单目录
function getMdFileToGenerateSidebar(path = docsPath, pathLink = '/src', dep = 0) {
  const _sidebarConfig = {
    collapsed: false,
  } as SidebarConfigItem;
  const fileList = readdirSync(path);

  fileList.forEach(fileName => {
    // 以.开头的配置文件不处理
    if (fileName.startsWith('.')) return;

    const filepath = join(path, fileName);
    const stat = statSync(filepath);

    let configContent = {} as ConfigOption;
    // 如果是文件夹
    if (stat.isDirectory()) {
      getMdFileToGenerateSidebar(filepath, `${pathLink}/${fileName}`, dep + 1);
    } else {
      // 文件名后缀
      const ext = extname(filepath);
      const baseName = basename(filepath, ext);
      // 配置文件 - 当前目录的名称以及其他md文件对应的中文名称
      if (fileName === 'config.json') {
        configContent = JSON.parse(readFileSync(filepath, 'utf-8'));
        _sidebarConfig.text = configContent['name'];

        // 根据配置重新赋值
        if (_sidebarConfig.items && _sidebarConfig.items.length > 0) {
          for (let configItem of _sidebarConfig.items) {
            const _baseNameText = configItem['text'];
            if (configContent[_baseNameText] !== _baseNameText) {
              configItem['text'] = configContent[_baseNameText]
            }
          }
        }
      }
      if (ext === '.md') {
        if (!_sidebarConfig.items) {
          _sidebarConfig.items = [];
        }
        (_sidebarConfig.items as IItems).push({
          text: configContent[baseName] || baseName,
          link: `${pathLink}/${baseName}`,
        })
      }
    }
  })

  sidebarConfigSingle.push(_sidebarConfig);
}

// 多目录
// function getMdFileToGenerateSidebarMultiple(path = docsPath, pathLink = '/src', dep = 0) {
//   const _sidebarConfig = {
//     collapsed: false,
//   } as SidebarConfigItem;
//   const fileList = readdirSync(path);

//   fileList.forEach(fileName => {
//     // 以.开头的配置文件不处理
//     if (fileName.startsWith('.')) return;

//     const filepath = join(path, fileName);
//     const stat = statSync(filepath);

//     let configContent = {} as ConfigOption;
//     // 如果是文件夹
//     if (stat.isDirectory()) {
//       const config = getMdFileToGenerateSidebar(filepath, `${pathLink}/${fileName}`, dep + 1);
//       if (!sidebarConfigMultiple[`/${fileName}/`]) {
//         sidebarConfigMultiple[`/${fileName}/`] = [config];
//       }
//     } else {
//       // 文件名后缀
//       const ext = extname(filepath);
//       const baseName = basename(filepath, ext);
//       // 配置文件 - 当前目录的名称以及其他md文件对应的中文名称
//       if (fileName === 'config.json') {
//         configContent = JSON.parse(readFileSync(filepath, 'utf-8'));
//         _sidebarConfig.text = configContent['name'];

//         // 根据配置重新赋值
//         if (_sidebarConfig.items && _sidebarConfig.items.length > 0) {
//           for (let configItem of _sidebarConfig.items) {
//             console.log(configItem)
//             const _baseNameText = configItem['text'];
//             if (configContent[_baseNameText] !== _baseNameText) {
//               configItem['text'] = configContent[_baseNameText]
//             }
//           }
//         }
//       }
//       if (ext === '.md') {
//         if (!_sidebarConfig.items) {
//           _sidebarConfig.items = [];
//         }
//         (_sidebarConfig.items as IItems).push({
//           text: configContent[baseName] || baseName,
//           link: `${pathLink}/${baseName}`,
//         })
//       }

//       if (dep === 0) {
//         sidebarConfigMultiple['/default'] = [_sidebarConfig];
//       }
//     }
//   })

//   return _sidebarConfig;
// }
