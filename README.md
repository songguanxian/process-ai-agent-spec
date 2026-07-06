# 工序管控系统 AI 助手（Agent）

本仓库用于管理《工序管控系统 AI 助手（Agent）》的产品需求、需求澄清成果、AI Coding 开发规格和文档生成脚本。项目目标是在现有工序管控系统上建设统一 AI Agent，辅助施工单位、监理单位、业主、项目管理人员和集团管理人员完成操作指南查询、业务表单发起、OCR 填报、报验/检查数据简报、流程导航、风险提示和审计追溯。

当前仓库以文档与规格管理为主，不包含生产代码实现。

## 最新文档

建议按以下顺序阅读：

| 顺序 | 文档 | 用途 |
|---|---|---|
| 1 | [工序AI助手_PRD_正式版.md](outputs/工序AI助手_PRD_正式版.md) | 产品需求正式版，面向产品、业务、项目管理与验收沟通。 |
| 2 | [工序AI助手_AI_Coding_开发规格说明_v2_工程化增强版.md](outputs/工序AI助手_AI_Coding_开发规格说明_v2_工程化增强版.md) | Codex AI Coding 的推荐开发规格输入，补齐 API Schema、Tool Schema、状态事件、权限矩阵、SSE、GenUI、RAG、Prompt 和测试矩阵。 |
| 3 | [工序AI助手_AI_Coding_开发规格说明.md](outputs/工序AI助手_AI_Coding_开发规格说明.md) | V1.0 开发规格基线，用于追溯原始 AI Coding 规格。 |
| 4 | [工序AI助手_PRD_正式版.docx](outputs/工序AI助手_PRD_正式版.docx) | PRD Word 交付版，便于评审、流转和归档。 |
| 5 | [工序AI助手需求说明书_多领域澄清合并版.docx](outputs/工序AI助手需求说明书_多领域澄清合并版.docx) | Grilling 多领域澄清后的合并版需求说明书，用于追溯需求来源。 |
| 6 | [工序AI助手需求说明书_OCR场景细化版.docx](outputs/工序AI助手需求说明书_OCR场景细化版.docx) | OCR/视觉识别场景细化版，用于追溯 OCR 识别、匹配、确认和填报闭环。 |

## 项目范围

一期范围包括：

- Web 右侧 AI 侧边栏与 App 底部一级 AI 入口。
- Web/App 统一会话体系、历史会话、任务节点和结果卡片。
- 文字、语音转写、附件、图片、拍照/相册等多模态输入。
- 操作指南问答、候选指南展示和业务表单入口推荐。
- 自然语言发起验收申请、检查记录草稿，并进入固定业务表单确认提交。
- 报验/检查数据简报，覆盖集团、直属单位/公司、项目、实体工程四级统计。
- App 白板/责任登记卡图片识别，Web 图片/PDF OCR 识别，人工确认后自动填表和附件挂接。
- 受控 GenUI，用于结果卡片、步骤卡、追问表单、确认摘要、图表说明和草稿建议。
- 日志审计、权限继承、配置版本、失败兜底、试点验收和运营治理。

一期不包含：

- AI 自动审批、自动提交、自动删除、自动整改闭环和批量提交。
- 无人工确认的全自动填报。
- 任意版式 PDF 全文结构化。
- OCR 自动新增项目、结构或人员基础库。
- 自定义 SQL、自定义统计口径和权限条件修改。
- AI 输出任意 HTML、JS、Vue 代码或动态脚本。
- Dify、商业云 Agent 平台和纯自研通用 Agent 编排层进入一期生产链路。

## 架构结论

已确认的一期架构路线：

- Agent 主框架：Deep Agents 独立 Python 编排服务。
- 业务边界：Spring 作为统一业务网关、权限边界、数据边界、工具边界和审计边界。
- 前端入口：Web Vue/Element UI 与 App uni-app 统一通过 Spring AI 接口访问 AI 能力。
- 流式响应：前端通过 Spring 使用 SSE 接收流式事件。
- RAG：现有 RAG 知识库作为检索工具接入 Deep Agents。
- OCR：OCR 服务独立部署，负责图片/PDF 识别、字段结构化、置信度与质量判断。
- 模型：一期优先接入第三方模型，后续二期接入自部署或私有化模型。
- GenUI：采用受控 UI schema 与白名单组件渲染，不允许 AI 生成任意前端代码。

## 核心业务边界

- AI 负责识别意图、抽取槽位、追问缺失字段、生成 Action Plan、解释结果、生成草稿和组织确认。
- Spring 负责鉴权、权限过滤、上下文编排、业务工具 API、字段校验、正式写入和审计留痕。
- Deep Agents 不直连生产 MySQL，不访问附件原始地址，不执行任意 SQL，不自由调用任意 HTTP。
- 查询、识别、预览、候选推荐和页面跳转可由 AI 先执行。
- 字段预填、附件挂接和表单草稿必须可见、可修改、可追溯。
- 提交验收申请、提交检查记录、正式导出、归档、覆盖已有字段、人工绑定系统对象等动作必须由用户显式确认。
- 权限、流程状态、字段校验、审批规则、统计口径和页面可用性均以现有业务系统规则为准。

## 仓库结构

```text
.
├─ README.md
├─ outputs/
│  ├─ 工序AI助手_PRD_正式版.md
│  ├─ 工序AI助手_PRD_正式版.docx
│  ├─ 工序AI助手_AI_Coding_开发规格说明_v2_工程化增强版.md
│  ├─ 工序AI助手_AI_Coding_开发规格说明.md
│  ├─ 工序AI助手需求说明书_多领域澄清合并版.docx
│  └─ 工序AI助手需求说明书_OCR场景细化版.docx
├─ prototype/
│  └─ ai-assistant-poc/
│     ├─ index.html
│     ├─ app.js
│     ├─ styles.css
│     ├─ Start-PoC.ps1
│     ├─ NOTES.md
│     └─ assets/reference/
└─ work/
   ├─ generate_ai_coding_spec.py
   ├─ generate_ai_coding_spec_v2.py
   ├─ generate_prd_final.py
   ├─ merge_all_domain_requirements.py
   ├─ merge_ocr_requirements.py
   ├─ merge_session_genui_requirements.py
   ├─ cleanup_docx_trailing_blanks.py
   └─ requirements_extracted.md
```

`work/` 目录保留文档生成、合并和校验脚本。Word 渲染校验产生的 PNG/PDF 临时文件已通过 `.gitignore` 排除。

## 功能原型 PoC

本仓库包含一个一次性可运行 Demo，用于评审 Web/App AI 助手的核心交互形态：

```powershell
powershell -ExecutionPolicy Bypass -File prototype\ai-assistant-poc\Start-PoC.ps1
```

打开：

```text
http://127.0.0.1:5177/prototype/ai-assistant-poc/?variant=A
```

原型提供 3 个可切换变体：

- `A`：Web 业务驾驶舱 + 右侧 AI 侧边栏。
- `B`：App 现场作业模式，突出拍照、语音、常用指令和移动端确认。
- `C`：运营工作台模式，突出任务节点、审计、配置版本和管理视角。

原型覆盖 9 个用户故事、7 类角色、角色权限切换、权限不足拦截、OCR 确认、表单确认、数据简报、配置版本、审计追踪和 SSE 事件流状态展示。

原型不连接真实后端，不持久化数据，所有状态保存在浏览器内存中。评审完成后应删除或吸收为正式设计。

## 面向 Codex AI Coding 的使用方式

开发代码时优先使用 [工序AI助手_AI_Coding_开发规格说明_v2_工程化增强版.md](outputs/工序AI助手_AI_Coding_开发规格说明_v2_工程化增强版.md)，该文档已经细化到以下实现维度：

- 项目概述、总体架构、Agent 总体设计。
- Skill、Tool、MCP 服务设计。
- 数据库表结构、API、RAG 检索、MySQL 查询流程。
- 权限模型、页面设计、日志设计、性能要求和安全设计。
- Given/When/Then 测试用例。
- Code Generation Specification，包括 Spring、Python Deep Agents、Prompt、Skill、Tool、MCP、RAG、Config、Test 等目录划分。
- V2 工程化增强章节，包括 API Contract、Tool Contract、Data Model Enhancement、State Event Matrix、SSE Protocol、GenUI Schema、RAG Tool Contract、Permission Matrix、Prompt Template、Expanded Test Matrix 和 Codex AI Coding Task Slices。

生成代码时以该规格为准；PRD 用于解释产品目标、业务范围、验收口径和排期策略。

## 版本管理规则

- `outputs/` 保存正式交付文档。
- `work/` 保存可追溯的生成脚本和中间文本。
- 不提交 Word 渲染校验图片、PDF、Office 临时文件和编辑器缓存。
- 提交前检查是否包含真实密钥、Token、生产数据库连接、第三方模型 API Key 或未脱敏敏感数据。
- 本仓库建议保持私有，直到业务方确认文档可公开。

## 当前状态

- PRD 正式版已生成。
- AI Coding 开发规格说明 V1.0 已生成。
- AI Coding 开发规格说明 V2.0 工程化增强版已生成。
- Web/App AI 助手功能原型 PoC 已生成。
- 多领域需求澄清合并版已生成。
- OCR 场景细化版已生成。
- GitHub 远程仓库已配置为 `origin/main`。
