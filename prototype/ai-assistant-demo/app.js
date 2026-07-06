// PROTOTYPE ONLY: 工序管控系统 AI 助手可运行 Demo。所有数据均为本地 mock，不连接真实后端。
const variants = [
  { id: "A", label: "综合工作台" },
  { id: "B", label: "现场移动优先" },
  { id: "C", label: "治理审计视角" },
];

const roles = [
  {
    id: "field",
    name: "现场作业人员",
    scope: "本人任务、授权项目",
    permissions: ["guide", "formDraft", "ocrOwn", "manualOwn", "submit"],
  },
  {
    id: "pm",
    name: "项目管理人员",
    scope: "项目范围",
    permissions: ["guide", "formDraft", "reportProject", "ocrProject", "manualProject", "submit", "export"],
  },
  {
    id: "group",
    name: "集团/直属单位管理人员",
    scope: "授权组织范围",
    permissions: ["guide", "reportOrg", "export"],
  },
  {
    id: "supervisor",
    name: "项目管理/监管负责人",
    scope: "监管项目范围",
    permissions: ["guide", "formDraft", "reportProject", "ocrProject", "manualProject", "submit", "export", "ocrRebind"],
  },
  {
    id: "bizAdmin",
    name: "业务配置管理员",
    scope: "配置范围",
    permissions: ["guide", "config", "audit", "reviewPool"],
  },
  {
    id: "sysAdmin",
    name: "系统管理员",
    scope: "系统管理范围",
    permissions: ["guide", "audit", "config", "reviewPool", "export", "ocrRebind"],
  },
  {
    id: "aiOps",
    name: "AI/供应商运维",
    scope: "AI 运行监控范围",
    permissions: ["guide", "audit", "reviewPool"],
  },
];

const scenarios = [
  { id: "dashboard", title: "总览", nav: "总览", story: "会话、任务和状态总览" },
  { id: "guide", title: "操作指南问答", nav: "指南问答", story: "US-001 工序报验步骤" },
  { id: "acceptance", title: "验收申请草稿", nav: "验收申请", story: "US-002 自然语言发起验收申请" },
  { id: "inspection", title: "检查记录草稿", nav: "检查记录", story: "US-003 语音生成检查记录" },
  { id: "ocr", title: "OCR / 视觉识别填报", nav: "OCR 填报", story: "US-004/007 白板与责任登记卡识别" },
  { id: "report", title: "报验/检查数据简报", nav: "数据简报", story: "US-005/006 四级层级统计" },
  { id: "genui", title: "受控 GenUI", nav: "GenUI", story: "受控组件与跨端渲染" },
  { id: "fallback", title: "人在回路与人工兜底", nav: "人工兜底", story: "US-010 低置信度后继续办理" },
  { id: "ops", title: "配置、审计与运营", nav: "运营审计", story: "US-008/009 配置与审计" },
];

const initialTasks = [
  {
    id: "T-20260706-001",
    type: "guide",
    title: "操作指南问答",
    status: "completed",
    object: "路基工序报验",
    result: "返回 3 条候选指南，Top1 已采纳",
    source: "Web 侧边栏",
  },
  {
    id: "T-20260706-002",
    type: "ocr",
    title: "白板照片识别",
    status: "waiting_manual_confirm",
    object: "K10+887 路基左幅",
    result: "核心字段可用，结构候选需确认",
    source: "App 拍照",
  },
  {
    id: "T-20260706-003",
    type: "fallback",
    title: "验收申请低置信度兜底",
    status: "manual_required",
    object: "K12+345 桥面铺装",
    result: "项目和结构存在冲突，需要人工选择",
    source: "AI 会话卡片",
  },
];

const state = {
  variant: normalizeVariant(new URLSearchParams(location.search).get("variant")),
  role: "field",
  view: "dashboard",
  sessionId: "S-AI-20260706-0008",
  context: {
    org: "集团公司",
    company: "直属一公司",
    project: "G312 改扩建项目",
    contract: "TJ-02 合同段",
    entity: "K10+000-K13+500 路基工程",
  },
  taskSeq: 4,
  tasks: [...initialTasks],
  messages: [
    { from: "assistant", text: "已恢复最近进行中的 AI 会话。当前上下文为 G312 改扩建项目 TJ-02 合同段。" },
    { from: "assistant", text: "你可以从左侧场景或下方快捷指令触发指南问答、验收申请、检查记录、OCR、数据简报和人工兜底演示。" },
  ],
  sse: [
    { time: "09:18:21", event: "message.delta", detail: "恢复会话上下文" },
    { time: "09:18:22", event: "task.node.loaded", detail: "载入 3 个任务节点" },
  ],
  tools: [
    { id: "TC-001", tool: "Tool-001 search_guide", level: "read", status: "success", cost: "830ms" },
    { id: "TC-002", tool: "Tool-011 create_ocr_task", level: "draft", status: "success", cost: "1.6s" },
  ],
  audits: [
    { time: "09:18:22", actor: "现场作业人员", action: "恢复 AI 会话", object: "S-AI-20260706-0008", result: "成功" },
  ],
  reviewPool: [
    { id: "RS-001", source: "OCR", reason: "低置信度", status: "待复核", owner: "AI/供应商运维" },
    { id: "RS-002", source: "RAG", reason: "用户否定 Top1", status: "待复核", owner: "业务配置管理员" },
  ],
  activeDraft: "acceptance",
  draftStatus: "draft",
  ocrStatus: "waiting_manual_confirm",
  exportStatus: "idle",
  configVersion: "Prompt v1.4.0 / OCR模板 v2.1.3 / GenUI v1.0.5",
  manual: {
    id: "MF-20260706-003",
    taskId: "T-20260706-003",
    status: "manual_required",
    reason: "项目与结构候选冲突，AI 置信度 0.58",
    sourceModule: "FormDraftSkill",
    aiValue: "项目：G312 改扩建项目；结构：K12+345 桥面铺装",
    userValue: "待处理",
    handler: "现场作业人员",
    finalObject: "-",
    actions: ["选择候选", "修改字段", "补录字段", "打开半预填表单", "转管理员处理"],
  },
};

const sample = {
  guideCandidates: [
    { title: "验收申请操作指南", version: "KB-2026.07", confidence: "0.93", module: "验收管理", adopted: true },
    { title: "路基工序报验材料清单", version: "KB-2026.06", confidence: "0.81", module: "资料管理", adopted: false },
    { title: "App 端验收申请提交说明", version: "KB-2026.05", confidence: "0.76", module: "移动端", adopted: false },
  ],
  acceptanceFields: [
    ["项目", "G312 改扩建项目", "页面上下文", "高"],
    ["桩号", "K10+887", "用户输入", "高"],
    ["工程部位", "路基左幅", "系统库匹配", "中"],
    ["验收类型", "路基填筑验收", "字典匹配", "高"],
    ["申请人", "张建国", "登录用户", "高"],
    ["申请时间", "2026-07-06 09:30", "系统时间", "高"],
    ["施工单位", "中交一公局二标项目部", "权限组织", "高"],
    ["附件", "白板照片 2 张", "输入事件", "中"],
  ],
  inspectionFields: [
    ["项目", "G312 改扩建项目", "页面上下文", "高"],
    ["检查范围", "K11+200 右幅边坡", "语音转写", "中"],
    ["检查类型", "质量巡检", "AI 推断", "中"],
    ["检查人", "李明", "登录用户", "高"],
    ["检查时间", "2026-07-06 10:12", "系统时间", "高"],
    ["检查结果", "发现局部压实度资料未上传", "语音转写", "高"],
  ],
  ocrFields: [
    ["桩号", "K10+887", "核心字段", "高", "白板第1张"],
    ["工程部位", "路基左幅", "核心字段", "中", "白板第1张"],
    ["施工节点", "填筑验收", "辅助字段", "中", "责任卡第1页"],
    ["责任人", "王强", "核心字段", "低", "责任卡第1页"],
    ["附件名称", "白板照片-0706.jpg", "辅助字段", "高", "上传文件"],
  ],
  reportRows: [
    ["直属一公司", "36", "32", "4", "2", "1", "88.9%"],
    ["直属二公司", "28", "25", "3", "3", "0", "89.3%"],
    ["直属三公司", "19", "15", "4", "4", "2", "78.9%"],
  ],
  detailRows: [
    ["YSSQ-202607-0018", "报验", "G312 改扩建项目", "K10+887 路基左幅", "已通过", "中交一公局", "张建国"],
    ["JCJL-202607-0031", "检查", "G312 改扩建项目", "K11+200 右幅边坡", "待整改", "中铁六局", "李明"],
    ["JCJL-202607-0038", "检查", "G320 桥梁项目", "桥面铺装", "逾期未整改", "路桥集团", "王敏"],
  ],
};

function normalizeVariant(value) {
  return variants.some((item) => item.id === value) ? value : "A";
}

function h(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function role() {
  return roles.find((item) => item.id === state.role) || roles[0];
}

function can(permission) {
  return role().permissions.includes(permission);
}

function nowTime() {
  return new Date().toLocaleTimeString("zh-CN", { hour12: false });
}

function addAudit(action, object, result) {
  state.audits.unshift({ time: nowTime(), actor: role().name, action, object, result });
}

function addSse(event, detail) {
  state.sse.unshift({ time: nowTime(), event, detail });
}

function addTool(tool, level, status, cost = "模拟") {
  const next = String(state.tools.length + 1).padStart(3, "0");
  state.tools.unshift({ id: `TC-${next}`, tool, level, status, cost });
}

function addMessage(from, text) {
  state.messages.push({ from, text });
  if (state.messages.length > 18) state.messages.shift();
}

function createTask(type, title, object, result, status = "processing", source = "Web 侧边栏") {
  const id = `T-20260706-${String(state.taskSeq++).padStart(3, "0")}`;
  const task = { id, type, title, status, object, result, source };
  state.tasks.unshift(task);
  addSse("task.node.created", `${id} ${title}`);
  addAudit("创建任务节点", id, status);
  return task;
}

function updateTask(type, status, result) {
  const task = state.tasks.find((item) => item.type === type);
  if (task) {
    task.status = status;
    task.result = result || task.result;
  }
}

function triggerScenario(id, source = "Web 侧边栏") {
  state.view = id;
  const scene = scenarios.find((item) => item.id === id);
  if (!scene) return render();

  const title = scene.title;
  addMessage("user", scene.story);

  if (id === "guide") {
    createTask("guide", title, "工序报验步骤", "RAG Top3 候选已返回", "completed", source);
    addTool("Tool-001 search_guide", "read", "success", "760ms");
    addSse("rag.search.completed", "Top1=验收申请操作指南，Top3 可用");
    addMessage("assistant", "已检索操作指南知识库，返回 3 条候选，并展示关联验收申请入口。");
  }

  if (id === "acceptance") {
    createTask("acceptance", title, "K10+887 路基左幅", "已生成验收申请草稿，等待固定确认页", "waiting_user_confirm", source);
    addTool("Tool-006 generate_form_draft", "draft", "success", "1.1s");
    addSse("draft.generated", "验收申请草稿字段 8 项");
    addMessage("assistant", "已抽取项目、桩号、部位和验收类型，并生成验收申请草稿。正式提交前需要你确认。");
  }

  if (id === "inspection") {
    createTask("inspection", title, "K11+200 右幅边坡", "语音转写已形成检查记录草稿", "waiting_user_confirm", source);
    addTool("Tool-007 generate_inspection_draft", "draft", "success", "1.4s");
    addSse("voice.transcript.completed", "检查问题描述已抽取");
    addMessage("assistant", "语音内容已转写，并生成检查记录草稿。检查类型和责任单位需要人工确认。");
  }

  if (id === "ocr") {
    createTask("ocr", title, "白板照片与责任登记卡", "OCR 批次进入待确认", "waiting_manual_confirm", source);
    state.ocrStatus = "waiting_manual_confirm";
    addTool("Tool-011 create_ocr_task", "draft", "success", "1.8s");
    addSse("ocr.batch.pending_confirm", "OCR-BATCH-0706-001");
    addMessage("assistant", "OCR 批次已完成识别。责任人字段低置信，结构候选需要人工确认。");
  }

  if (id === "report") {
    createTask("report", title, "2026 年 2 月集团工序简报", "核心指标已返回，明细支持钻取", "completed", source);
    addTool("Tool-009 query_report_brief", "read", "success", "2.4s");
    addSse("report.brief.ready", "四级层级统计已生成");
    addMessage("assistant", "已按集团、直属单位、项目、实体工程四级口径生成报验/检查简报。");
  }

  if (id === "genui") {
    createTask("genui", title, "受控 UI schema", "白名单组件渲染成功", "completed", source);
    addTool("Tool-014 validate_genui_schema", "draft", "success", "280ms");
    addSse("genui.schema.validated", "schema_version=1.0.5");
    addMessage("assistant", "已使用受控 GenUI schema 渲染结果卡、追问表单、候选列表和确认摘要。");
  }

  if (id === "fallback") {
    createManualFallback("low_confidence", "FormDraftSkill", "验收申请项目与结构候选冲突，置信度 0.58");
    addMessage("assistant", "已停止自动推进，并创建人工兜底记录。请在卡片中选择候选、修改字段、补录或转入表单手工办理。");
  }

  if (id === "ops") {
    createTask("ops", title, "审计与配置", "已加载配置版本、工具日志和复核样本池", "completed", source);
    addTool("Tool-016 query_audit_log", "internal", "success", "620ms");
    addSse("audit.panel.loaded", "审计工作台已打开");
    addMessage("assistant", "已打开运营审计工作台，可查看 Prompt 版本、工具调用、人工兜底记录和复核样本池。");
  }

  render();
}

function createManualFallback(triggerType, sourceModule, reason) {
  const task = createTask("fallback", "人工兜底处理", "验收申请/检查记录/OCR", reason, "manual_required", "AI 会话卡片");
  state.manual = {
    id: `MF-20260706-${String(state.taskSeq).padStart(3, "0")}`,
    taskId: task.id,
    status: "manual_required",
    reason,
    triggerType,
    sourceModule,
    aiValue: "AI 原始建议：项目=G312 改扩建项目；结构=K12+345 桥面铺装；置信度=0.58",
    userValue: "待人工处理",
    handler: role().name,
    finalObject: "-",
    actions: ["选择候选", "修改字段", "补录字段", "人工绑定", "打开半预填表单", "重试", "作废", "转管理员处理"],
  };
  addTool("Tool-017 create_manual_fallback_record", "draft", "success", "420ms");
  addSse("ai_manual_fallback_start", `${state.manual.id} ${triggerType}`);
  addAudit("创建人工兜底记录", state.manual.id, reason);
}

function manualAction(action) {
  const map = {
    choose: ["waiting_manual_confirm", "用户选择候选：G312 改扩建项目 / K12+345 桥面铺装"],
    correct: ["waiting_manual_fill", "用户修改字段：工程部位改为 K12+345 桥面铺装右幅"],
    fill: ["waiting_manual_fill", "用户补录字段：验收类型=桥面铺装验收"],
    bind: ["waiting_manual_bind", "用户绑定已有结构：桥面铺装结构 S-1028"],
    form: ["manual_processing", "已打开半预填表单，保留 AI 草稿字段和附件"],
    retry: ["manual_processing", "工具已重试一次，仍失败，保留人工办理路径"],
    escalate: ["manual_processing", "已转项目管理员处理"],
  };
  const next = map[action];
  if (!next) return;
  state.manual.status = next[0];
  state.manual.userValue = next[1];
  addTool(action === "bind" ? "Tool-018 complete_manual_fallback" : "Tool-017 create_manual_fallback_record", action === "bind" ? "submit" : "draft", "success", "模拟");
  addSse(action === "bind" ? "ai_manual_bind" : "ai_manual_field_correct", next[1]);
  addAudit("人工兜底动作", state.manual.id, next[1]);
  updateTask("fallback", state.manual.status, next[1]);
  render();
}

function completeManual() {
  state.manual.status = "manual_completed";
  state.manual.finalObject = "验收申请草稿 YSSQ-DRAFT-0706-018";
  state.manual.userValue = "人工确认并进入半预填表单";
  updateTask("fallback", "manual_completed", "人工兜底完成，进入业务表单确认");
  state.reviewPool.unshift({
    id: `RS-${String(state.reviewPool.length + 1).padStart(3, "0")}`,
    source: state.manual.sourceModule,
    reason: state.manual.triggerType,
    status: "待复核",
    owner: "业务配置管理员",
  });
  addTool("Tool-018 complete_manual_fallback", "submit", "success", "510ms");
  addSse("ai_manual_fallback_complete", `${state.manual.id} manual_completed`);
  addAudit("完成人工兜底", state.manual.id, state.manual.finalObject);
  render();
}

function voidManual() {
  state.manual.status = "manual_voided";
  state.manual.userValue = "用户作废：重复上传或不再办理";
  updateTask("fallback", "manual_voided", "用户作废人工兜底任务");
  addSse("ai_manual_fallback_complete", `${state.manual.id} manual_voided`);
  addAudit("作废人工兜底", state.manual.id, "已填写作废原因");
  render();
}

function parseChat(text) {
  const value = text.trim();
  if (!value) return;
  addMessage("user", value);
  if (value.includes("报验步骤") || value.includes("指南")) return triggerScenario("guide");
  if (value.includes("验收") || value.includes("报验申请")) return triggerScenario("acceptance");
  if (value.includes("检查") || value.includes("隐患")) return triggerScenario("inspection");
  if (value.includes("白板") || value.includes("OCR") || value.includes("照片") || value.includes("责任登记卡")) return triggerScenario("ocr");
  if (value.includes("简报") || value.includes("统计") || value.includes("不合格")) return triggerScenario("report");
  if (value.includes("低置信") || value.includes("人工") || value.includes("兜底") || value.includes("识别不了")) return triggerScenario("fallback");
  if (value.includes("审计") || value.includes("日志")) return triggerScenario("ops");
  createManualFallback("unknown_intent", "RouterAgent", `意图无法识别：${value}`);
  state.view = "fallback";
  addMessage("assistant", "没有识别出唯一意图，已提供可选任务类型和人工处理入口。");
  render();
}

function render() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <div class="prototype variant-${state.variant.toLowerCase()}">
      ${renderNav()}
      <main class="main">
        ${renderTopbar()}
        ${renderVariantMain()}
      </main>
      ${renderAiDrawer()}
      ${renderPrototypeSwitcher()}
    </div>
  `;
}

function renderNav() {
  return `
    <aside class="left-nav">
      <div class="brand">
        <div class="brand-mark">AI</div>
        <div>
          <div class="brand-title">工序管控系统</div>
          <div class="brand-subtitle">AI 助手 PoC</div>
        </div>
      </div>
      <div class="nav-section">
        <div class="nav-label">演示场景</div>
        ${scenarios
          .map(
            (scene) => `
              <button class="nav-item ${state.view === scene.id ? "active" : ""}" data-action="scenario" data-scenario="${scene.id}">
                <span class="nav-dot"></span><span class="nav-text">${h(scene.nav)}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    </aside>
  `;
}

function renderTopbar() {
  return `
    <header class="topbar">
      <div class="topbar-left">
        <div>
          <div class="page-title">${h((scenarios.find((item) => item.id === state.view) || scenarios[0]).title)}</div>
          <div class="breadcrumb">集团公司 / 直属一公司 / G312 改扩建项目 / TJ-02 合同段</div>
        </div>
      </div>
      <div class="topbar-right">
        <span class="tag blue">会话 ${h(state.sessionId)}</span>
        <select class="select" data-action="role-change" aria-label="角色切换">
          ${roles.map((item) => `<option value="${item.id}" ${item.id === state.role ? "selected" : ""}>${h(item.name)}</option>`).join("")}
        </select>
      </div>
    </header>
  `;
}

function renderVariantMain() {
  if (state.variant === "B") {
    return `
      <section class="content">
        ${renderBanner("现场移动优先视角", "突出 App 一级入口、拍照/语音、任务卡片和移动端确认流程；右侧仍保留 Web AI 会话作为统一状态。")}
        <div class="mobile-focus">
          ${renderPhone()}
          <div>${renderScenarioContent()}</div>
        </div>
      </section>
    `;
  }

  if (state.variant === "C") {
    return `
      <section class="content">
        ${renderBanner("治理审计视角", "突出人工兜底、权限拦截、Tool 调用、配置版本、复核样本池和验收证据包。")}
        <div class="governance-focus">
          <div>${renderScenarioContent()}</div>
          <div class="grid">${renderOpsPanel(true)}${renderFallbackPanel(true)}</div>
        </div>
      </section>
    `;
  }

  return `
    <section class="content">
      ${renderBanner("综合工作台视角", "左侧是现有工序管控系统外壳，中间承载业务页面和确认页，右侧 AI 侧边栏保留统一会话、任务节点、结果卡片和审计状态。")}
      ${renderScenarioContent()}
    </section>
  `;
}

function renderBanner(title, text) {
  return `
    <div class="banner">
      <div>
        <h1>${h(title)}</h1>
        <p>${h(text)}</p>
      </div>
      <div class="inline">
        <span class="tag green">Mock 数据</span>
        <span class="tag purple">${h(variantLabel())}</span>
      </div>
    </div>
  `;
}

function variantLabel() {
  return `${state.variant} - ${variants.find((item) => item.id === state.variant).label}`;
}

function renderScenarioContent() {
  const map = {
    dashboard: renderDashboard,
    guide: renderGuide,
    acceptance: renderAcceptance,
    inspection: renderInspection,
    ocr: renderOcr,
    report: renderReport,
    genui: renderGenui,
    fallback: () => renderFallbackPanel(false),
    ops: () => renderOpsPanel(false),
  };
  return (map[state.view] || renderDashboard)();
}

function renderDashboard() {
  return `
    <div class="grid cols-4">
      ${renderMetric("今日 AI 任务", "42", "已完成 36，待确认 4", "green")}
      ${renderMetric("人工兜底", "7", "低置信 3 / 多候选 2 / 工具失败 2", "warn")}
      ${renderMetric("表单草稿采纳率", "86%", "验收与检查合计", "green")}
      ${renderMetric("权限拦截", "5", "均未暴露不可见数据", "danger")}
    </div>
    <div class="grid cols-2" style="margin-top:12px;">
      <div class="panel">
        <div class="panel-title"><h2>10 个用户故事入口</h2><span class="tag blue">可点击演示</span></div>
        <div class="two-column-list" style="padding:12px;">
          ${scenarios
            .filter((item) => item.id !== "dashboard")
            .map(
              (item) => `
              <button class="story-card" data-action="scenario" data-scenario="${item.id}">
                <strong>${h(item.title)}</strong>
                <span class="muted">${h(item.story)}</span>
              </button>`,
            )
            .join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-title"><h2>Agent 工作流</h2><span class="tag green">可审计</span></div>
        <div class="workflow" style="padding:12px;">
          ${["意图分类", "槽位抽取", "工具调用", "用户确认", "系统执行"].map((title, index) => `<div class="step"><strong>${index + 1}. ${title}</strong><span>${workflowText(index)}</span></div>`).join("")}
        </div>
      </div>
    </div>
    <div class="grid cols-2" style="margin-top:12px;">
      ${renderTaskTable()}
      ${renderPhone()}
    </div>
  `;
}

function workflowText(index) {
  return [
    "识别指南、验收、检查、OCR、简报、人工兜底等任务。",
    "项目、桩号、部位、时间范围、附件和人员信息。",
    "仅调用 Spring 白名单工具，读/草稿/提交分级。",
    "高风险动作进入确认页，低置信进入人在回路。",
    "原业务系统写入，AI 会话与审计记录回传。",
  ][index];
}

function renderMetric(label, value, foot, type) {
  return `
    <div class="metric ${type === "warn" ? "warn" : type === "danger" ? "danger" : ""}">
      <div class="metric-label">${h(label)}</div>
      <div class="metric-value">${h(value)}</div>
      <div class="metric-foot">${h(foot)}</div>
    </div>
  `;
}

function renderTaskTable() {
  return `
    <div class="panel">
      <div class="panel-title"><h2>会话任务节点</h2><span class="tag blue">${state.tasks.length} 个任务</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>任务ID</th><th>类型</th><th>状态</th><th>对象</th><th>结果</th></tr></thead>
          <tbody>
            ${state.tasks
              .map(
                (task) => `<tr><td>${h(task.id)}</td><td>${h(task.title)}</td><td>${statusTag(task.status)}</td><td>${h(task.object)}</td><td>${h(task.result)}</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderGuide() {
  return `
    <div class="grid cols-2">
      <div class="panel pad">
        <div class="section-title"><h2>RAG 检索过程</h2><span class="tag green">Top3 可用</span></div>
        <div class="timeline">
          <div class="timeline-item active"><strong>查询词</strong><div class="muted">工序报验步骤</div></div>
          <div class="timeline-item active"><strong>权限过滤</strong><div class="muted">${h(role().scope)}，过滤不可见项目资料</div></div>
          <div class="timeline-item active"><strong>召回与重排</strong><div class="muted">候选 8 条，重排后返回 Top3</div></div>
          <div class="timeline-item active"><strong>受控回答</strong><div class="muted">展示来源、版本、适用端和业务入口</div></div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title"><h2>候选指南</h2><button class="btn" data-action="manual-fallback" data-reason="rag_low_confidence">模拟低置信度</button></div>
        <div style="padding:12px;">
          ${sample.guideCandidates
            .map(
              (item) => `
              <div class="candidate">
                <div>
                  <strong>${h(item.title)}</strong>
                  <div class="muted">来源版本：${h(item.version)} / 模块：${h(item.module)} / 置信度：${h(item.confidence)}</div>
                </div>
                <button class="btn ${item.adopted ? "primary" : ""}" data-action="scenario" data-scenario="acceptance">${item.adopted ? "直达表单" : "查看"}</button>
              </div>`,
            )
            .join("")}
        </div>
      </div>
    </div>
    <div class="panel pad" style="margin-top:12px;">
      <div class="section-title"><h2>操作指南卡片</h2><span class="tag blue">受控 GenUI</span></div>
      <ol>
        <li>进入验收管理，确认当前项目、合同段和实体工程。</li>
        <li>选择报验/验收类型，填写桩号、工程部位、施工节点。</li>
        <li>上传白板照片、责任登记卡或现场附件。</li>
        <li>检查 AI 预填字段，进入固定确认页后由用户提交。</li>
      </ol>
      <div class="inline"><button class="btn primary" data-action="scenario" data-scenario="acceptance">新建验收申请</button><button class="btn" data-action="scenario" data-scenario="inspection">新建检查记录</button></div>
    </div>
  `;
}

function renderAcceptance() {
  return `
    <div class="grid cols-2">
      <div class="panel">
        <div class="panel-title"><h2>验收申请草稿</h2><span class="tag orange">待固定确认</span></div>
        <div style="padding:12px;">
          ${renderFields(sample.acceptanceFields)}
          <div class="notice" style="margin-top:10px;">正式提交必须进入原业务表单或固定确认页。目标表单已有人工填写内容时，不直接覆盖。</div>
          <div class="inline" style="margin-top:10px;">
            <button class="btn primary" data-action="confirm-draft">进入固定确认页</button>
            <button class="btn" data-action="manual-fallback" data-reason="missing_fields">缺槽转人工兜底</button>
          </div>
        </div>
      </div>
      ${renderConfirmationPanel("验收申请确认", "YSSQ-DRAFT-0706-018", "提交后进入验收管理模块原有审批/流转规则。")}
    </div>
  `;
}

function renderInspection() {
  return `
    <div class="grid cols-2">
      <div class="panel pad">
        <div class="section-title"><h2>语音转写与缺失追问</h2><span class="tag blue">App/Web 共用</span></div>
        <div class="field">
          <div class="field-label">语音转写</div>
          <div class="field-value">K11+200 右幅边坡检查发现压实度资料没有上传，现场需要补充整改。</div>
          <div class="field-source"><span class="tag orange">检查类型中置信</span><span class="tag orange">责任单位需确认</span></div>
        </div>
        <div style="margin-top:10px;">${renderFields(sample.inspectionFields)}</div>
        <div class="inline" style="margin-top:10px;"><button class="btn primary" data-action="submit-inspection">确认生成检查记录</button><button class="btn" data-action="manual-fallback" data-reason="slot_conflict">多候选/缺槽兜底</button></div>
      </div>
      ${renderConfirmationPanel("检查记录确认", "JCJL-DRAFT-0706-031", "提交后写入检查管理模块和项目检查台账。")}
    </div>
  `;
}

function renderFields(fields) {
  return `
    <div class="field-grid">
      ${fields
        .map(
          ([label, value, source, confidence]) => `
          <div class="field">
            <div class="field-label">${h(label)}</div>
            <div class="field-value">${h(value)}</div>
            <div class="field-source"><span class="tag blue">${h(source)}</span><span class="tag ${confidence === "低" ? "red" : confidence === "中" ? "orange" : "green"}">置信度${h(confidence)}</span></div>
          </div>`,
        )
        .join("")}
    </div>
  `;
}

function renderConfirmationPanel(title, number, consequence) {
  const disabled = !can("submit");
  return `
    <div class="panel">
      <div class="panel-title"><h2>${h(title)}</h2><span class="tag ${disabled ? "red" : "green"}">${disabled ? "无提交权限" : "可提交"}</span></div>
      <div style="padding:12px;" class="grid">
        <div class="candidate"><div><strong>原值</strong><div class="muted">目标表单为空或未提交草稿</div></div><span class="tag">保留</span></div>
        <div class="candidate"><div><strong>AI 建议值</strong><div class="muted">${h(number)}，字段来源已标记</div></div><span class="tag blue">建议</span></div>
        <div class="candidate"><div><strong>用户修改值</strong><div class="muted">用户可逐项修改后再确认提交</div></div><span class="tag green">最终输入</span></div>
        <div class="notice">${h(consequence)} 责任主体为当前确认用户：${h(role().name)}。</div>
        <button class="btn primary" data-action="submit-business" ${disabled ? "disabled" : ""}>用户确认并提交</button>
        ${disabled ? `<button class="btn" data-action="manual-fallback" data-reason="permission_denied">查看权限申请路径</button>` : ""}
      </div>
    </div>
  `;
}

function renderOcr() {
  return `
    <div class="ocr-layout">
      <div class="panel">
        <div class="panel-title"><h2>原图/PDF 预览</h2><span class="tag orange">异步任务：${h(state.ocrStatus)}</span></div>
        <div style="padding:12px;">
          <div class="preview-box">
            <img src="../../work/extracted-docx-images/工序助手工序助手app端-7.png" alt="OCR 参考截图" />
            <div class="preview-overlay"></div>
          </div>
          <div class="inline" style="margin-top:10px;"><button class="btn">旋转</button><button class="btn">裁剪</button><button class="btn">放大</button><button class="btn">切换页</button></div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title"><h2>字段确认与候选匹配</h2><span class="tag blue">OCR-BATCH-0706-001</span></div>
        <div style="padding:12px;" class="grid">
          ${renderOcrFieldTable()}
          <div>
            <div class="candidate"><div><strong>结构候选 1</strong><div class="muted">G312 / TJ-02 / K10+800-K10+920 路基左幅，桩号范围命中</div></div><button class="btn primary">默认选中</button></div>
            <div class="candidate"><div><strong>结构候选 2</strong><div class="muted">G312 / TJ-02 / K10+850-K11+000 排水边沟，名称部分命中</div></div><button class="btn">选择</button></div>
          </div>
          <div class="inline">
            <button class="btn primary" data-action="confirm-ocr">确认填表并挂接附件</button>
            <button class="btn" data-action="manual-action" data-manual-action="bind">手工绑定已有对象</button>
            <button class="btn" data-action="manual-fallback" data-reason="ocr_low_confidence">低置信度兜底</button>
            <button class="btn" data-action="rebind-ocr">已确认批次改绑</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderOcrFieldTable() {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>字段</th><th>识别值</th><th>分组</th><th>置信</th><th>来源</th></tr></thead>
        <tbody>
          ${sample.ocrFields.map(([a, b, c, d, e]) => `<tr><td>${h(a)}</td><td>${h(b)}</td><td>${h(c)}</td><td>${statusTag(d)}</td><td>${h(e)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderReport() {
  const canExport = can("export");
  return `
    <div class="grid cols-4">
      ${renderMetric("报验/检查总数", "83", "本月有效记录", "green")}
      ${renderMetric("不合格数", "11", "占比 13.3%", "warn")}
      ${renderMetric("待整改", "9", "逾期 3 条", "danger")}
      ${renderMetric("整改闭环率", "76%", "较上月 +8%", "green")}
    </div>
    <div class="grid cols-2" style="margin-top:12px;">
      <div class="panel">
        <div class="panel-title"><h2>直属单位排行</h2><button class="btn ${canExport ? "primary" : ""}" data-action="export-report" ${canExport ? "" : "disabled"}>${canExport ? "导出 Excel/PDF" : "无导出权限"}</button></div>
        <div class="bar-chart">
          ${[
            ["直属一公司", 88, "green"],
            ["直属二公司", 75, "blue"],
            ["直属三公司", 54, "orange"],
          ]
            .map(([name, value, color]) => `<div class="bar-row"><span>${name}</span><div class="bar-track"><div class="bar-fill ${color}" style="width:${value}%"></div></div><strong>${value}%</strong></div>`)
            .join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-title"><h2>四级层级统计</h2><span class="tag blue">集团 -> 公司 -> 项目 -> 实体工程</span></div>
        <div class="table-wrap">
          <table><thead><tr><th>单位</th><th>总数</th><th>合格</th><th>不合格</th><th>待整改</th><th>逾期</th><th>合格率</th></tr></thead><tbody>${sample.reportRows.map((row) => `<tr>${row.map((cell) => `<td>${h(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>
        </div>
      </div>
    </div>
    <div class="panel" style="margin-top:12px;">
      <div class="panel-title"><h2>钻取明细</h2><span class="tag orange">点击明细进入原业务表单只读追溯</span></div>
      <div class="table-wrap">
        <table><thead><tr><th>编号</th><th>类型</th><th>项目</th><th>工程部位</th><th>状态</th><th>责任单位</th><th>发起人</th></tr></thead><tbody>${sample.detailRows.map((row) => `<tr>${row.map((cell) => `<td>${h(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>
      </div>
    </div>
  `;
}

function renderGenui() {
  const schema = {
    component: "ManualFallbackCard",
    schemaVersion: "1.0.5",
    whitelist: ["card", "fieldGroup", "candidateList", "actionButtons"],
    actions: ["selectCandidate", "editField", "openForm", "voidTask"],
    forbidden: ["html", "script", "hiddenSubmitParam"],
  };
  return `
    <div class="grid cols-2">
      <div class="panel pad">
        <div class="section-title"><h2>受控组件渲染</h2><span class="tag green">Schema 校验通过</span></div>
        <div class="grid">
          <div class="task-card"><div class="card-head"><strong>结果卡片</strong><span class="tag blue">GuideResultCard</span></div><div class="task-body">返回指南来源、版本、置信度和表单入口。</div></div>
          <div class="task-card"><div class="card-head"><strong>追问表单</strong><span class="tag orange">QuestionForm</span></div><div class="task-body">一次性补齐项目、部位、类型等关键字段，单次不超过 5 项。</div></div>
          <div class="task-card"><div class="card-head"><strong>人工兜底卡</strong><span class="tag purple">ManualFallbackCard</span></div><div class="task-body">低置信度时展示原因、AI 原值、候选和人工动作。</div></div>
        </div>
      </div>
      <div class="panel pad">
        <div class="section-title"><h2>Schema 片段</h2><button class="btn" data-action="manual-fallback" data-reason="invalid_schema">模拟非法 Schema 降级</button></div>
        <pre class="schema-box">${h(JSON.stringify(schema, null, 2))}</pre>
      </div>
    </div>
  `;
}

function renderFallbackPanel(compact) {
  return `
    <div class="panel">
      <div class="panel-title"><h2>人在回路与人工兜底</h2><span class="tag orange">${h(state.manual.status)}</span></div>
      <div style="padding:12px;" class="grid">
        <div class="fallback-card">
          <strong>${h(state.manual.id)} / ${h(state.manual.taskId)}</strong>
          <div class="muted" style="margin-top:6px;">触发原因：${h(state.manual.reason)}</div>
          <div class="muted">来源模块：${h(state.manual.sourceModule)} / 处理人：${h(state.manual.handler)}</div>
        </div>
        <div class="fallback-state">
          ${["manual_required", "waiting_manual_confirm", "waiting_manual_fill", "waiting_manual_bind", "manual_processing", "manual_completed", "manual_voided"]
            .map((item) => `<div class="state-chip ${state.manual.status === item ? "active" : ""}">${h(item)}</div>`)
            .join("")}
        </div>
        <div class="grid cols-2">
          <div class="field"><div class="field-label">AI 原始结果</div><div class="field-value">${h(state.manual.aiValue)}</div></div>
          <div class="field"><div class="field-label">用户处理结果</div><div class="field-value">${h(state.manual.userValue)}</div></div>
        </div>
        <div class="inline" style="flex-wrap:wrap;">
          <button class="btn" data-action="manual-action" data-manual-action="choose">选择候选</button>
          <button class="btn" data-action="manual-action" data-manual-action="correct">修改字段</button>
          <button class="btn" data-action="manual-action" data-manual-action="fill">补录字段</button>
          <button class="btn" data-action="manual-action" data-manual-action="bind">人工绑定</button>
          <button class="btn" data-action="manual-action" data-manual-action="form">打开半预填表单</button>
          <button class="btn" data-action="manual-action" data-manual-action="retry">重试一次</button>
          <button class="btn" data-action="manual-action" data-manual-action="escalate">转管理员</button>
        </div>
        <div class="inline">
          <button class="btn success" data-action="complete-manual">完成人工兜底</button>
          <button class="btn danger" data-action="void-manual">作废任务</button>
        </div>
        ${compact ? "" : renderManualRecords()}
      </div>
    </div>
  `;
}

function renderManualRecords() {
  return `
    <div class="panel" style="box-shadow:none;">
      <div class="panel-title"><h2>审计轨迹与复核样本</h2><span class="tag blue">可追溯</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>字段</th><th>值</th></tr></thead>
          <tbody>
            <tr><td>兜底ID</td><td>${h(state.manual.id)}</td></tr>
            <tr><td>触发原因</td><td>${h(state.manual.reason)}</td></tr>
            <tr><td>AI 原值</td><td>${h(state.manual.aiValue)}</td></tr>
            <tr><td>用户处理值</td><td>${h(state.manual.userValue)}</td></tr>
            <tr><td>最终业务对象</td><td>${h(state.manual.finalObject)}</td></tr>
            <tr><td>最终状态</td><td>${h(state.manual.status)}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderOpsPanel(compact) {
  return `
    <div class="grid ${compact ? "" : "cols-2"}">
      <div class="panel">
        <div class="panel-title"><h2>运营指标</h2><span class="tag purple">${h(state.configVersion)}</span></div>
        <div class="grid cols-3" style="padding:12px;">
          ${renderMetric("AI 被修改率", "14%", "本周下降 3%", "green")}
          ${renderMetric("人工兜底完成率", "92%", "平均 8 分钟", "green")}
          ${renderMetric("工具失败转人工", "5", "Tool-006 为主", "warn")}
        </div>
        <div class="bar-chart">
          ${[
            ["低置信拦截", 64, "orange"],
            ["人工补录", 42, "blue"],
            ["人工绑定", 36, "green"],
            ["人工作废", 18, "orange"],
          ]
            .map(([name, value, color]) => `<div class="bar-row"><span>${h(name)}</span><div class="bar-track"><div class="bar-fill ${color}" style="width:${value}%"></div></div><strong>${value}</strong></div>`)
            .join("")}
        </div>
        <div class="inline" style="padding:0 12px 12px;"><button class="btn primary" data-action="publish-config" ${can("config") ? "" : "disabled"}>发布配置</button><button class="btn" data-action="rollback-config" ${can("config") ? "" : "disabled"}>回滚配置</button></div>
      </div>
      <div class="panel">
        <div class="panel-title"><h2>复核样本池</h2><span class="tag orange">${state.reviewPool.length} 条</span></div>
        <div class="table-wrap">
          <table><thead><tr><th>ID</th><th>来源</th><th>原因</th><th>状态</th><th>负责人</th></tr></thead><tbody>${state.reviewPool.map((row) => `<tr><td>${h(row.id)}</td><td>${h(row.source)}</td><td>${h(row.reason)}</td><td>${h(row.status)}</td><td>${h(row.owner)}</td></tr>`).join("")}</tbody></table>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title"><h2>Tool 调用日志</h2><span class="tag blue">白名单工具</span></div>
        <div class="table-wrap">
          <table><thead><tr><th>ID</th><th>Tool</th><th>等级</th><th>状态</th><th>耗时</th></tr></thead><tbody>${state.tools.map((row) => `<tr><td>${h(row.id)}</td><td>${h(row.tool)}</td><td>${h(row.level)}</td><td>${statusTag(row.status)}</td><td>${h(row.cost)}</td></tr>`).join("")}</tbody></table>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title"><h2>审计日志</h2><span class="tag green">全链路留痕</span></div>
        <div class="table-wrap">
          <table><thead><tr><th>时间</th><th>操作者</th><th>动作</th><th>对象</th><th>结果</th></tr></thead><tbody>${state.audits.map((row) => `<tr><td>${h(row.time)}</td><td>${h(row.actor)}</td><td>${h(row.action)}</td><td>${h(row.object)}</td><td>${h(row.result)}</td></tr>`).join("")}</tbody></table>
        </div>
      </div>
    </div>
  `;
}

function renderPhone() {
  return `
    <div class="app-phone">
      <div class="phone-head">
        <strong>工序 AI 助手</strong>
        <div class="small">${h(role().name)} / ${h(state.context.project)}</div>
      </div>
      <div class="phone-body">
        <div class="phone-card">
          <strong>常用指令</strong>
          <div class="phone-grid" style="margin-top:8px;">
            <button class="phone-action" data-action="scenario" data-scenario="guide">查指南</button>
            <button class="phone-action" data-action="scenario" data-scenario="acceptance">发起验收</button>
            <button class="phone-action" data-action="scenario" data-scenario="inspection">检查记录</button>
            <button class="phone-action" data-action="scenario" data-scenario="ocr">拍照识别</button>
            <button class="phone-action" data-action="scenario" data-scenario="report">数据简报</button>
            <button class="phone-action" data-action="scenario" data-scenario="fallback">人工兜底</button>
          </div>
        </div>
        <div class="phone-card">
          <strong>移动端任务卡</strong>
          <div class="muted" style="margin-top:6px;">返回原会话与原任务节点；未发送草稿按端隔离。</div>
          ${state.tasks.slice(0, 3).map((task) => `<div class="candidate"><div><strong>${h(task.title)}</strong><div class="muted">${h(task.object)}</div></div>${statusTag(task.status)}</div>`).join("")}
        </div>
        <div class="phone-card">
          <strong>拍照质量引导</strong>
          <div class="muted" style="margin-top:6px;">完整白板、避免反光、文字无遮挡。质量差时建议重拍，但允许继续手工补录。</div>
          <button class="btn primary" style="width:100%; margin-top:8px;" data-action="scenario" data-scenario="ocr">模拟拍照上传</button>
        </div>
      </div>
      <div class="phone-bottom">
        <button>首页</button><button>工序</button><button class="active">AI</button><button>我的</button>
      </div>
    </div>
  `;
}

function renderAiDrawer() {
  return `
    <aside class="ai-drawer">
      <div class="ai-head">
        <div>
          <div class="ai-title">AI 助手</div>
          <div class="ai-subtitle">${h(role().name)} / ${h(role().scope)}</div>
        </div>
        <span class="tag green">SSE 在线</span>
      </div>
      <div class="quick-bar">
        <button class="btn" data-action="scenario" data-scenario="guide">工序报验步骤</button>
        <button class="btn" data-action="scenario" data-scenario="acceptance">发起验收</button>
        <button class="btn" data-action="scenario" data-scenario="ocr">OCR</button>
        <button class="btn" data-action="scenario" data-scenario="fallback">低置信兜底</button>
      </div>
      <div class="chat-flow" id="chatFlow">
        ${state.messages.map((msg) => `<div class="message ${msg.from}">${h(msg.text)}</div>`).join("")}
        ${state.tasks.slice(0, 4).map(renderTaskCard).join("")}
        <div class="panel">
          <div class="panel-title"><h2>SSE 事件流</h2><span class="tag blue">${state.sse.length}</span></div>
          <div style="padding:10px;" class="timeline">
            ${state.sse.slice(0, 5).map((item, index) => `<div class="timeline-item ${index === 0 ? "active" : ""}"><strong>${h(item.event)}</strong><div class="muted">${h(item.time)} / ${h(item.detail)}</div></div>`).join("")}
          </div>
        </div>
      </div>
      <div class="chat-input">
        <input class="input" id="chatInput" placeholder="输入：工序报验步骤 / 发起 XX 项目 K10+887 路基验收申请 / 低置信兜底" />
        <button class="btn primary" data-action="send-chat">发送</button>
      </div>
    </aside>
  `;
}

function renderTaskCard(task) {
  const action = task.type === "fallback" ? "fallback" : task.type === "acceptance" ? "acceptance" : task.type === "ocr" ? "ocr" : task.type === "report" ? "report" : "guide";
  return `
    <div class="task-card">
      <div class="card-head"><strong>${h(task.title)}</strong>${statusTag(task.status)}</div>
      <div class="task-body">
        <div class="muted">${h(task.id)} / ${h(task.source)}</div>
        <div>${h(task.object)}</div>
        <div class="muted">${h(task.result)}</div>
        <button class="btn" data-action="scenario" data-scenario="${action}">定位任务节点</button>
      </div>
    </div>
  `;
}

function statusTag(status) {
  const value = String(status);
  const cls = value.includes("fail") || value.includes("denied") || value === "低" ? "red" : value.includes("waiting") || value.includes("manual") || value === "中" ? "orange" : value.includes("complete") || value === "success" || value === "高" ? "green" : "blue";
  return `<span class="tag ${cls}">${h(value)}</span>`;
}

function renderPrototypeSwitcher() {
  return `
    <div class="prototype-switcher" aria-label="原型变体切换">
      <button data-action="variant-prev" aria-label="上一个变体">&lt;</button>
      <span>${h(variantLabel())}</span>
      <button data-action="variant-next" aria-label="下一个变体">&gt;</button>
    </div>
  `;
}

function changeVariant(direction) {
  const index = variants.findIndex((item) => item.id === state.variant);
  const next = variants[(index + direction + variants.length) % variants.length];
  state.variant = next.id;
  const params = new URLSearchParams(location.search);
  params.set("variant", state.variant);
  history.replaceState(null, "", `${location.pathname}?${params.toString()}`);
  addAudit("切换原型变体", state.variant, next.label);
  render();
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;

  if (action === "scenario") {
    triggerScenario(button.dataset.scenario, button.closest(".app-phone") ? "App AI 一级入口" : "Web 侧边栏");
  }

  if (action === "send-chat") {
    const input = document.querySelector("#chatInput");
    parseChat(input ? input.value : "");
  }

  if (action === "confirm-draft") {
    addAudit("进入固定确认页", "验收申请草稿", "等待用户确认");
    addSse("confirmation.required", "验收申请草稿需要用户确认");
    updateTask("acceptance", "waiting_user_confirm", "已进入固定确认页");
    render();
  }

  if (action === "submit-business") {
    if (!can("submit")) {
      createManualFallback("permission_denied", "SpringAuth", "当前角色无提交权限，不暴露不可见对象存在性");
      state.view = "fallback";
      render();
      return;
    }
    state.draftStatus = "submitted";
    updateTask(state.view === "inspection" ? "inspection" : "acceptance", "submitted", "业务单号已生成并进入原流程");
    addTool("Tool-008 submit_business_form", "submit", "success", "680ms");
    addSse("business.submit.completed", "业务单号 YSSQ-202607-0018");
    addAudit("用户确认提交", "业务表单", "成功生成业务单号");
    render();
  }

  if (action === "submit-inspection") {
    state.view = "inspection";
    addSse("inspection.submit.completed", "检查记录 JCJL-202607-0031");
    addAudit("用户确认提交", "检查记录", "写入项目检查台账");
    updateTask("inspection", "submitted", "检查记录 JCJL-202607-0031 已生成");
    render();
  }

  if (action === "confirm-ocr") {
    state.ocrStatus = "confirmed_filled";
    updateTask("ocr", "confirmed_filled", "已填表并挂接附件");
    addTool("Tool-012 confirm_ocr_fill", "submit", "success", "720ms");
    addSse("ocr.confirm.completed", "批次挂接验收申请草稿");
    addAudit("确认 OCR 填表", "OCR-BATCH-0706-001", "已挂接附件");
    render();
  }

  if (action === "rebind-ocr") {
    if (!can("ocrRebind")) {
      createManualFallback("permission_denied", "SpringAuth", "当前账号无 OCR 改绑权限，不能暴露不可见对象存在性");
      state.view = "fallback";
      render();
      return;
    }
    addAudit("OCR 批次改绑", "OCR-BATCH-0706-001", "已记录改绑原因");
    addSse("ocr.rebind.completed", "管理员改绑已完成");
    render();
  }

  if (action === "manual-fallback") {
    const reason = button.dataset.reason || "low_confidence";
    createManualFallback(reason, "AgentOrTool", `触发人工兜底：${reason}`);
    state.view = "fallback";
    render();
  }

  if (action === "manual-action") {
    manualAction(button.dataset.manualAction);
  }

  if (action === "complete-manual") completeManual();
  if (action === "void-manual") voidManual();

  if (action === "export-report") {
    if (!can("export")) {
      createManualFallback("permission_denied", "SpringAuth", "当前账号无导出权限");
      state.view = "fallback";
      render();
      return;
    }
    state.exportStatus = "created";
    addTool("Tool-010 create_export_task", "submit", "success", "520ms");
    addSse("export.task.created", "下载中心任务 EXPORT-0706-009");
    addAudit("创建导出任务", "EXPORT-0706-009", "Excel/PDF 异步生成");
    render();
  }

  if (action === "publish-config") {
    if (!can("config")) return;
    state.configVersion = "Prompt v1.4.1 / OCR模板 v2.1.4 / GenUI v1.0.5";
    addAudit("发布配置", state.configVersion, "灰度发布");
    addSse("config.published", state.configVersion);
    render();
  }

  if (action === "rollback-config") {
    if (!can("config")) return;
    state.configVersion = "Prompt v1.4.0 / OCR模板 v2.1.3 / GenUI v1.0.5";
    addAudit("回滚配置", state.configVersion, "回滚到上一稳定版本");
    addSse("config.rollback", state.configVersion);
    render();
  }

  if (action === "variant-prev") changeVariant(-1);
  if (action === "variant-next") changeVariant(1);
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (target && target.dataset.action === "role-change") {
    state.role = target.value;
    addAudit("切换演示角色", role().name, role().scope);
    addSse("role.changed", role().name);
    render();
  }
});

document.addEventListener("keydown", (event) => {
  const active = document.activeElement;
  const typing = active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName);
  if (typing) return;
  if (event.key === "ArrowLeft") changeVariant(-1);
  if (event.key === "ArrowRight") changeVariant(1);
});

render();
