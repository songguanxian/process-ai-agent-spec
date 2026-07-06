# 工序管控系统 AI 助手 Demo

这是一个用于评审的一次性 PoC，不连接真实后端、不写入数据库、不包含生产接口密钥。

## 运行方式

在仓库根目录执行：

```powershell
.\prototype\ai-assistant-demo\Start-Demo.ps1
```

默认访问地址：

```text
http://127.0.0.1:5177/prototype/ai-assistant-demo/index.html
```

也可以直接在仓库根目录执行：

```powershell
python -m http.server 5177 --bind 127.0.0.1
```

## 原型变体

通过页面底部切换器或 URL 参数查看三种结构：

- `?variant=A`：综合工作台
- `?variant=B`：现场移动优先
- `?variant=C`：治理审计视角

## 覆盖范围

- 7 类角色切换与权限差异。
- 10 个用户故事入口。
- Web AI 右侧侧边栏与 App 一级入口。
- 操作指南问答、验收申请草稿、检查记录草稿、OCR 确认、数据简报、受控 GenUI。
- 人在回路与人工兜底：触发条件、人工动作、状态机、API/Tool/SSE mock、审计记录和复核样本池。
- 运营审计工作台：工具调用、配置版本、SSE 事件、审计轨迹、复核样本。

## 注意

本目录为 throwaway prototype。若后续进入正式开发，应按 `outputs/工序AI助手_AI_Coding_开发规格说明_v2_工程化增强版.md` 重建工程化代码结构。
