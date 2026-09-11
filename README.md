# UnblockNeteaseMusic Server 修复版

当前版本：`1.3.0`

本仓库是 [UnblockNeteaseMusic/server](https://github.com/UnblockNeteaseMusic/server) 的修复分支，恢复网易云音乐不可用歌曲的换源能力，并修正酷狗源偶发返回 DJ、翻唱、Live 等非原版版本的问题。

## v1.3.0 新增内容

- 新增 `server-silent.exe` 静默运行版：双击后不显示控制台窗口，在后台监听默认端口。
- 静默版日志写入 `server.log`，默认位于 EXE 同目录；无法写入时回退到 `%LOCALAPPDATA%\UnblockNeteaseMusic\server.log` 或 `%TEMP%\unblock-netease-music-server.log`。
- 监听端口被占用时，服务会写入明确错误日志并退出，避免无提示闪退。

## v1.2.0 修复内容

- 酷狗搜索结果优先保留非 DJ、非翻唱、非 Live、非伴奏等原版候选。
- 结合酷狗返回的 `isoriginal` 与 `trans_param.is_original` 字段识别明确翻唱。
- 存在可识别的原版候选时，不再因为原版候选播放失败而滑到 DJ、翻唱或试听片段。
- 仅当酷狗源确实没有可识别原版时，才按原顺序兜底匹配。

## 直接运行

下载 Release 中的 `server.exe`（普通控制台版）或 `server-silent.exe`（无窗口静默版）。

普通版双击运行，或在本目录执行：

```powershell
.\server.exe
```

静默版直接双击运行，或在 PowerShell 中执行：

```powershell
.\server-silent.exe
```

静默版运行后不打开窗口，可在同目录的 `server.log` 中查看运行状态。需要显式指定日志文件时，可设置 `UNBLOCK_LOG_FILE`：

```powershell
$env:UNBLOCK_LOG_FILE = 'D:\logs\netease-server.log'
.\server-silent.exe
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
node scripts/build-silent.js
```

构建完成后，`dist/server.exe` 为普通版，`dist/server-silent.exe` 为无窗口静默版。

## 说明

- 原始项目：<https://github.com/UnblockNeteaseMusic/server>
- 许可证：LGPL-3.0-only
