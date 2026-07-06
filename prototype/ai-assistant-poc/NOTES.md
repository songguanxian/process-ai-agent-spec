# 工序 AI 助手 PoC 说明

这是一次性功能原型，用于回答：

> 工序管控系统 AI 助手在 Web/App 中如何承载统一会话、任务节点、结果卡片、OCR 确认、报表简报、固定确认和审计状态？

## 运行方式

在仓库根目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File prototype\ai-assistant-poc\Start-PoC.ps1
```

打开：

```text
http://127.0.0.1:5177/prototype/ai-assistant-poc/?variant=A
```

## 变体

- `A`：Web 业务驾驶舱 + 右侧 AI 侧边栏。
- `B`：App 现场作业模式，突出拍照、语音、常用指令和移动端确认。
- `C`：运营工作台模式，突出任务节点、审计、配置版本和管理视角。

## 原型约束

- 不连接真实后端。
- 不持久化数据。
- 所有状态保存在浏览器内存。
- 通过底部切换器或键盘左右方向键切换变体。
- 评审完成后应删除或吸收为正式设计，不应直接作为生产代码使用。
