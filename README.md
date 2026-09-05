# UnblockNeteaseMusic Server 修复版

本仓库提供已修复酷狗音乐换源逻辑的 Windows 可执行文件。

## 使用

1. 下载 `server.exe`。
2. 双击运行，或在本目录打开 PowerShell 后执行：

   ```powershell
   .\server.exe
   ```

3. 默认监听：

   - HTTP: `http://127.0.0.1:8080`
   - HTTPS: `http://127.0.0.1:8081`

## 验证

可访问健康检查接口：

```powershell
Invoke-RestMethod http://127.0.0.1:8080/check
```

## 说明

- 原始项目：https://github.com/UnblockNeteaseMusic/server
- 修复目标：恢复失效的酷狗音乐源换源能力。
