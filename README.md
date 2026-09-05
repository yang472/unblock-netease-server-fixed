# UnblockNeteaseMusic Server 修复版

当前版本：`1.2.0`

本仓库是 [UnblockNeteaseMusic/server](https://github.com/UnblockNeteaseMusic/server) 的修复分支，恢复网易云音乐不可用歌曲的换源能力，并修正酷狗源偶发返回 DJ、翻唱、Live 等非原版版本的问题。

## v1.2.0 修复内容

- 酷狗搜索结果优先保留非 DJ、非翻唱、非 Live、非伴奏等原版候选。
- 结合酷狗返回的 `isoriginal` 与 `trans_param.is_original` 字段识别明确翻唱。
- 存在可识别的原版候选时，不再因为原版候选播放失败而滑到 DJ、翻唱或试听片段。
- 仅当酷狗源确实没有可识别原版时，才按原顺序兜底匹配。

## 直接运行

下载 Release 中的 `server.exe`，双击运行，或在本目录执行：

```powershell
.\server.exe
```

默认监听：

- HTTP：`http://127.0.0.1:8080`
- HTTPS：`https://127.0.0.1:8081`

查看版本：

```powershell
.\server.exe -v
```

## 验证

```powershell
Invoke-RestMethod http://127.0.0.1:8080/check
```

## 从源码运行

```powershell
yarn
yarn build
yarn start
```

运行测试：

```powershell
yarn test
```

打包 Windows 可执行文件：

```powershell
yarn build
npx -y pkg@5.8.1 . --out-path=dist --targets node18-win-x64
```

## 说明

- 原始项目：<https://github.com/UnblockNeteaseMusic/server>
- 许可证：LGPL-3.0-only
