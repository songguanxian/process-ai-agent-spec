const variants = {
  A: "Web AI 侧边栏",
  B: "App 现场模式",
  C: "运营工作台"
};

const referenceImages = [
  { src: "./assets/reference/web-dashboard.png", label: "Web 首页统计" },
  { src: "./assets/reference/web-form-modal.png", label: "Web 表单弹窗" },
  { src: "./assets/reference/app-home.jpeg", label: "App 首页" },
  { src: "./assets/reference/app-ai.png", label: "App AI 会话" }
];

const roles = {
  fieldWorker: {
    name: "现场作业人员",
    scope: "授权项目",
    allowed: ["guide", "acceptance", "inspection", "whiteboard", "ocr", "report"]
  },
  projectManager: {
    name: "项目管理人员",
    scope: "项目范围",
    allowed: ["guide", "acceptance", "inspection", "whiteboard", "ocr", "report", "audit"]
  },
  groupManager: {
    name: "集团/直属单位管理人员",
    scope: "授权组织范围",
    allowed: ["guide", "report", "groupBrief", "audit"]
  },
  regulator: {
    name: "监管负责人",
    scope: "项目监管范围",
    allowed: ["guide", "ocr", "whiteboard", "report", "audit"]
  },
  configAdmin: {
    name: "业务配置管理员",
    scope: "配置范围",
    allowed: ["guide", "config", "audit"]
  },
  systemAdmin: {
    name: "系统管理员",
    scope: "系统管理范围",
    allowed: ["guide", "config", "audit", "permissionDenied"]
  },
  aiOps: {
    name: "AI/供应商运维",
    scope: "脱敏排障数据",
    allowed: ["guide", "audit"]
  }
};

const userStories = [
  { id: "US-001", label: "操作指南查询", action: "guide", role: "现场作业人员" },
  { id: "US-002", label: "验收申请草稿", action: "acceptance", role: "现场作业人员" },
  { id: "US-003", label: "语音检查记录草稿", action: "inspection", role: "现场作业人员" },
  { id: "US-004", label: "白板照片识别填报", action: "whiteboard", role: "现场作业人员" },
  { id: "US-005", label: "项目级检查统计", action: "report", role: "项目管理人员" },
  { id: "US-006", label: "集团四级简报", action: "groupBrief", role: "集团管理人员" },
  { id: "US-007", label: "责任登记卡/文件 OCR", action: "ocr", role: "监管负责人" },
  { id: "US-008", label: "字段模板和匹配规则配置", action: "config", role: "业务配置管理员" },
  { id: "US-009", label: "审计与失败记录", action: "audit", role: "系统管理员" }
];

const scenarioMap = {
  guide: {
    storyId: "US-001",
    input: "工序报验步骤",
    taskId: "TN-001",
    title: "操作指南查询",
    status: "completed",
    skill: "GuideQASkill",
    tool: "rag_search_guide",
    cardType: "guide",
    response: "已匹配《工序报验操作指南》v3，Top1 置信度 0.91，并找到验收申请入口。",
    fields: [
      ["指南", "工序报验操作指南"],
      ["来源版本", "guide:G-001 / v3"],
      ["关联入口", "验收申请单"],
      ["置信状态", "Top1 高置信"]
    ],
    allowedRoles: ["fieldWorker", "projectManager", "groupManager", "regulator", "configAdmin", "systemAdmin", "aiOps"]
  },
  acceptance: {
    storyId: "US-002",
    input: "发起 XX 项目 K10+887 路基验收申请",
    taskId: "TN-002",
    title: "验收申请草稿",
    status: "waiting_confirm",
    skill: "FormDraftSkill",
    tool: "create_form_draft",
    cardType: "form",
    response: "已生成验收申请草稿。提交前需要你确认项目、桩号、工序类型和申请人信息。",
    fields: [
      ["项目", "广西路桥集团 / 测试一分部"],
      ["桩号", "K10+887"],
      ["工程部位", "路基"],
      ["验收类型", "工序验收"],
      ["申请人", "宋冠先"],
      ["申请时间", "系统当前时间"]
    ],
    allowedRoles: ["fieldWorker", "projectManager"]
  },
  inspection: {
    storyId: "US-003",
    input: "语音：K12+300 防护栏外观缺陷，生成检查记录",
    taskId: "TN-003",
    title: "检查记录草稿",
    status: "waiting_input",
    skill: "SlotFillingSkill",
    tool: "extract_slots",
    cardType: "question",
    response: "已识别检查问题，但缺少检查类型和责任单位。请补齐后生成检查记录草稿。",
    fields: [
      ["桩号", "K12+300"],
      ["问题描述", "防护栏外观缺陷"],
      ["缺失字段", "检查类型、责任单位"],
      ["追问策略", "一次性汇总追问"]
    ],
    allowedRoles: ["fieldWorker", "projectManager"]
  },
  whiteboard: {
    storyId: "US-004",
    input: "App 拍摄白板照片，识别桩号和施工节点",
    taskId: "TN-008",
    title: "白板照片识别",
    status: "waiting_confirm",
    skill: "OCRFillingSkill",
    tool: "create_ocr_task / get_ocr_result",
    cardType: "ocr",
    response: "白板照片已识别：桩号 K10+887，工程部位路基，施工节点工序验收。提交前需要人工确认。",
    fields: [
      ["来源", "App 拍照"],
      ["桩号", "K10+887"],
      ["工程部位", "路基"],
      ["施工节点", "工序验收"],
      ["质量检测", "清晰 / 主体完整"],
      ["确认要求", "AI结果经用户确认后生效"]
    ],
    allowedRoles: ["fieldWorker", "projectManager", "regulator"]
  },
  ocr: {
    storyId: "US-007",
    input: "上传责任登记卡，识别并填入检查记录",
    taskId: "TN-004",
    title: "OCR 识别确认",
    status: "waiting_confirm",
    skill: "OCRFillingSkill",
    tool: "create_ocr_task / get_ocr_result",
    cardType: "ocr",
    response: "识别批次 OB-001 已完成。核心字段置信度高，结构存在 2 个候选，需要选择主结构。",
    fields: [
      ["桩号范围", "K12+300-K12+500"],
      ["工程名称", "广西路桥集团"],
      ["候选结构", "2 个"],
      ["责任人", "李工"],
      ["质量判断", "图片清晰，主体完整"]
    ],
    allowedRoles: ["fieldWorker", "projectManager", "regulator"]
  },
  report: {
    storyId: "US-005",
    input: "统计本季度不合格检查记录",
    taskId: "TN-005",
    title: "项目级数据简报",
    status: "completed",
    skill: "ReportBriefSkill",
    tool: "query_report_stats",
    cardType: "report",
    response: "本季度项目级检查记录 120 条，不合格 12 条，待整改 8 条，逾期 2 条。",
    fields: [
      ["总数", "120"],
      ["不合格", "12"],
      ["待整改", "8"],
      ["逾期未整改", "2"],
      ["合格率", "80%"],
      ["整改闭环率", "33.33%"]
    ],
    allowedRoles: ["fieldWorker", "projectManager", "groupManager", "regulator"]
  },
  groupBrief: {
    storyId: "US-006",
    input: "集团 2026 年 2 月工序简报",
    taskId: "TN-006",
    title: "集团四级简报",
    status: "completed",
    skill: "ReportBriefSkill",
    tool: "parse_report_condition / query_report_stats",
    cardType: "report",
    response: "已按集团、直属单位、项目、实体工程四级汇总，生成历史快照 RS-202602。",
    fields: [
      ["统计层级", "集团"],
      ["时间", "2026-02-01 至 2026-02-28"],
      ["报验记录", "18,260"],
      ["检查记录", "3,420"],
      ["异常单位", "3 个"],
      ["快照", "RS-202602"]
    ],
    allowedRoles: ["groupManager", "systemAdmin"]
  },
  config: {
    storyId: "US-008",
    input: "发布 OCR 字段模板 v4 并查看失败样本",
    taskId: "TN-007",
    title: "配置版本与审计",
    status: "completed",
    skill: "AuditSkill",
    tool: "write_audit_log",
    cardType: "audit",
    response: "字段模板 v4 已进入待发布状态。近 7 天 OCR 人工修正率 18%，候选匹配失败样本 32 条。",
    fields: [
      ["配置类型", "ocr_field_template"],
      ["新版本", "v4"],
      ["人工修正率", "18%"],
      ["匹配失败样本", "32"],
      ["回滚版本", "v3"]
    ],
    allowedRoles: ["configAdmin", "systemAdmin"]
  },
  audit: {
    storyId: "US-009",
    input: "查看 AI 调用审计、失败记录和异常样本",
    taskId: "TN-009",
    title: "审计与失败记录",
    status: "completed",
    skill: "AuditSkill",
    tool: "write_audit_log / query_audit_log",
    cardType: "audit",
    response: "已汇总近 7 天 AI 调用审计：工具失败率 3.2%，OCR 低置信 41 次，权限拦截 16 次。",
    fields: [
      ["工具失败率", "3.2%"],
      ["OCR低置信", "41 次"],
      ["权限拦截", "16 次"],
      ["高风险确认", "100% 拦截"],
      ["留存策略", "至少 1 年"],
      ["证据包", "可导出"]
    ],
    allowedRoles: ["projectManager", "groupManager", "regulator", "configAdmin", "systemAdmin", "aiOps"]
  },
  permissionDenied: {
    input: "导出集团 2026 年 2 月全部明细",
    taskId: "TN-010",
    title: "权限不足兜底",
    status: "failed",
    skill: "ReportBriefSkill",
    tool: "export_report",
    cardType: "error",
    response: "当前角色无集团明细导出权限。系统不会暴露不可见数据存在性，请联系管理员申请权限。",
    fields: [
      ["拦截点", "Spring Tool Gateway"],
      ["错误码", "Error-034"],
      ["用户提示", "当前账号无导出权限"],
      ["兜底路径", "查看授权范围摘要 / 申请权限"]
    ],
    allowedRoles: ["systemAdmin"]
  }
};

const baseTasks = [
  { id: "TN-001", type: "guide", title: "操作指南查询", status: "completed", owner: "现场作业人员" },
  { id: "TN-002", type: "form", title: "验收申请草稿", status: "waiting_confirm", owner: "现场作业人员" },
  { id: "TN-003", type: "form", title: "检查记录草稿", status: "waiting_input", owner: "现场作业人员" },
  { id: "TN-004", type: "ocr", title: "OCR 识别确认", status: "waiting_confirm", owner: "监管负责人" },
  { id: "TN-005", type: "report", title: "项目级数据简报", status: "completed", owner: "项目管理人员" },
  { id: "TN-006", type: "report", title: "集团四级简报", status: "completed", owner: "集团管理人员" },
  { id: "TN-007", type: "admin", title: "配置版本与审计", status: "completed", owner: "业务配置管理员" },
  { id: "TN-008", type: "ocr", title: "白板照片识别", status: "waiting_confirm", owner: "现场作业人员" },
  { id: "TN-009", type: "audit", title: "审计与失败记录", status: "completed", owner: "系统管理员" },
  { id: "TN-010", type: "security", title: "权限不足兜底", status: "failed", owner: "系统管理员" }
];

const state = {
  prototype: {
    question: "AI 助手在 Web/App 中如何承载会话、任务节点、确认页、OCR 和简报闭环",
    persistence: "in-memory only",
    variant: getVariant()
  },
  session: {
    conversation_id: "C-20260706-001",
    status: "active",
    terminal: "web",
    context: "广西路桥集团 / 测试一分部 / K12+300",
    idle_reconfirm_minutes: 30
  },
  currentRole: "fieldWorker",
  activeScenario: "acceptance",
  inputHistory: ["发起 XX 项目 K10+887 路基验收申请"],
  taskNodes: JSON.parse(JSON.stringify(baseTasks)),
  sseEvents: [],
  ocrBatch: {
    batch_id: "OB-001",
    status: "waiting_confirm",
    confidence_status: "need_user_confirm",
    result_groups: 2
  },
  reportSnapshot: {
    snapshot_id: "RS-Q3-001",
    total_count: 120,
    unqualified_count: 12,
    overdue_unrectified_count: 2
  },
  confirmation: {
    confirmation_id: "CONF-002",
    risk_level: "high",
    action_type: "submit_form",
    required: true
  },
  auditTrail: [
    "用户确认值覆盖 AI 建议值：验收类型=工序验收",
    "Tool-006 create_form_draft success / 418ms",
    "Prompt-006 form_draft v1 activated"
  ]
};

function getVariant() {
  const key = new URLSearchParams(window.location.search).get("variant") || "A";
  return variants[key] ? key : "A";
}

function setVariant(next) {
  const url = new URL(window.location.href);
  url.searchParams.set("variant", next);
  window.history.replaceState({}, "", url);
  state.prototype.variant = next;
  render();
}

function cycleVariant(direction) {
  const keys = Object.keys(variants);
  const current = keys.indexOf(getVariant());
  const next = keys[(current + direction + keys.length) % keys.length];
  setVariant(next);
}

function getCurrentRole() {
  return roles[state.currentRole] || roles.fieldWorker;
}

function switchRole(roleKey) {
  if (!roles[roleKey]) return;
  state.currentRole = roleKey;
  state.auditTrail.unshift(`切换角色：${roles[roleKey].name} / ${roles[roleKey].scope}`);
  render();
}

function canRunScenario(scenario) {
  if (!scenario.allowedRoles) return true;
  return scenario.allowedRoles.includes(state.currentRole);
}

function runScenario(name) {
  const scenario = scenarioMap[name];
  if (!scenario) return;
  state.activeScenario = name;
  state.inputHistory.push(scenario.input);

  if (!canRunScenario(scenario)) {
    state.sseEvents = [
      { event_type: "message_received", payload: scenario.input },
      { event_type: "intent_detected", payload: scenario.skill },
      { event_type: "tool_running", payload: scenario.tool },
      { event_type: "task_failed", payload: "Error-027 / 当前角色无权访问该上下文" }
    ];
    state.confirmation = {
      confirmation_id: `DENY-${scenario.taskId}`,
      risk_level: "high",
      action_type: "permission_denied",
      required: false
    };
    state.taskNodes = state.taskNodes.map((task) =>
      task.id === scenario.taskId ? { ...task, status: "failed", last_input: scenario.input } : task
    );
    state.auditTrail.unshift(`权限拦截：${getCurrentRole().name} -> ${scenario.title}`);
    render();
    return;
  }

  state.sseEvents = [
    { event_type: "message_received", payload: scenario.input },
    { event_type: "intent_detected", payload: scenario.skill },
    { event_type: "action_plan_created", payload: scenario.tool },
    { event_type: "tool_running", payload: scenario.tool },
    { event_type: scenario.status === "waiting_confirm" ? "need_confirmation" : "result_card", payload: scenario.title }
  ];
  state.taskNodes = state.taskNodes.map((task) =>
    task.id === scenario.taskId ? { ...task, status: scenario.status, last_input: scenario.input } : task
  );
  state.confirmation = {
    confirmation_id: `CONF-${scenario.taskId}`,
    risk_level: scenario.status === "waiting_confirm" ? "high" : "low",
    action_type: scenario.cardType === "ocr" ? "bind_ocr_result" : "submit_form",
    required: scenario.status === "waiting_confirm"
  };
  if (scenario.cardType === "ocr") {
    state.ocrBatch.status = scenario.status;
    state.ocrBatch.confidence_status = scenario.title.includes("白板") ? "can_adopt_after_confirm" : "need_user_confirm";
    state.ocrBatch.result_groups = scenario.title.includes("白板") ? 1 : 2;
  }
  state.auditTrail.unshift(`${scenario.tool} -> ${scenario.status} / ${scenario.title}`);
  render();
}

function confirmActive() {
  const scenario = scenarioMap[state.activeScenario];
  if (!scenario) return;
  state.taskNodes = state.taskNodes.map((task) =>
    task.id === scenario.taskId ? { ...task, status: "completed", confirmed_at: "2026-07-06 10:48" } : task
  );
  state.confirmation = {
    ...state.confirmation,
    required: false,
    action_type: "confirmed"
  };
  if (scenario.cardType === "ocr") {
    state.ocrBatch.status = "confirmed";
  }
  state.sseEvents.push({ event_type: "task_completed", payload: scenario.title });
  state.auditTrail.unshift(`用户显式确认：${scenario.title}`);
  render();
}

function markManual() {
  const scenario = scenarioMap[state.activeScenario];
  state.sseEvents.push({ event_type: "task_failed", payload: "转人工处理" });
  state.auditTrail.unshift(`转人工处理：${scenario ? scenario.title : "当前任务"}`);
  render();
}

function render() {
  const variant = getVariant();
  state.prototype.variant = variant;
  const root = document.getElementById("app");
  root.innerHTML = `
    <div class="prototype-root">
      <div class="top-alert">
        <strong>PROTOTYPE</strong>
        <span>一次性 PoC，不连接真实后端；所有状态保存在浏览器内存中。</span>
        <span class="mono">?variant=${variant}</span>
        <span class="tag green">当前角色：${getCurrentRole().name}</span>
      </div>
      ${variant === "A" ? renderVariantA() : ""}
      ${variant === "B" ? renderVariantB() : ""}
      ${variant === "C" ? renderVariantC() : ""}
      ${renderSwitcher(variant)}
    </div>
  `;
  bindEvents(root);
}

function renderVariantA() {
  return `
    <div class="layout-web">
      ${renderSidebar()}
      <main class="main-shell">
        ${renderHeader("首页 / 统计报表 / AI 助手 PoC")}
        <section class="dashboard">
          <div class="section-title">
            <span>今日统计</span>
            <div class="split-actions">
              <button class="btn" data-action="guide">指南</button>
              <button class="btn" data-action="acceptance">验收草稿</button>
              <button class="btn" data-action="inspection">检查草稿</button>
              <button class="btn" data-action="whiteboard">白板识别</button>
              <button class="btn" data-action="ocr">OCR识别</button>
              <button class="btn" data-action="report">项目简报</button>
            </div>
          </div>
          ${renderMetrics()}
          ${renderUserStoryPanel()}
          <div class="content-grid">
            ${renderReportPanel()}
            ${renderReferencePanel()}
          </div>
        </section>
      </main>
      ${renderAiDrawer()}
    </div>
  `;
}

function renderVariantB() {
  return `
    <section class="mobile-stage">
      <div class="phone">
        <div class="phone-top">工序管控</div>
        <div class="phone-body">
          <div class="phone-section">
            <div class="notice">测试一分部 · 当前上下文会在提交前重新确认</div>
          </div>
          <div class="phone-section">
            <h2 class="section-title">AI 常用指令</h2>
            <div class="app-command-grid">
              <button class="app-command" data-action="guide">操作指南</button>
              <button class="app-command" data-action="inspection">语音检查</button>
              <button class="app-command" data-action="whiteboard">现场拍照</button>
              <button class="app-command" data-action="acceptance">工序报验</button>
              <button class="app-command" data-action="report">项目简报</button>
              <button class="app-command" data-action="groupBrief">集团简报</button>
            </div>
          </div>
          <div class="phone-section">
            ${renderActiveTask()}
          </div>
        </div>
        <nav class="bottom-nav">
          <button>首页</button>
          <button>待办</button>
          <button class="active">现场拍照</button>
          <button>统计</button>
          <button>我的</button>
        </nav>
      </div>
      <aside class="mobile-side">
        ${renderUserStoryPanel("compact")}
        ${renderAiCompact()}
        ${renderStatePanel()}
      </aside>
    </section>
  `;
}

function renderVariantC() {
  return `
    <section class="workflow-board">
      <aside class="rail">
        ${renderRolePanel()}
        ${renderUserStoryPanel("compact")}
        ${renderReferencePanel()}
      </aside>
      <main class="board-center">
        <div class="panel">
          <div class="panel-head">
            <strong>任务节点工作台</strong>
            <div class="split-actions">
              <button class="btn" data-action="guide">指南</button>
              <button class="btn" data-action="acceptance">表单</button>
              <button class="btn" data-action="inspection">检查</button>
              <button class="btn" data-action="ocr">OCR</button>
              <button class="btn" data-action="groupBrief">集团简报</button>
              <button class="btn" data-action="audit">审计</button>
            </div>
          </div>
          <div class="panel-body">
            ${renderKanban()}
          </div>
        </div>
        ${renderActiveTask()}
      </main>
      <aside class="rail">
        ${renderAuditPanel()}
        ${renderStatePanel()}
      </aside>
    </section>
  `;
}

function renderSidebar() {
  const items = ["交竣工台账", "我的工作", "机构检查管理", "工程检查管理", "重点监管管理", "工序进度管理", "统计报表", "大数据统计", "业务设置"];
  return `
    <aside class="sidebar">
      <div class="brand"><span class="mark">工</span><span>工序管控系统</span></div>
      <nav class="nav">
        ${items.map((item) => `<div class="nav-item ${item === "统计报表" ? "active" : ""}"><span>□</span><span>${item}</span></div>`).join("")}
      </nav>
    </aside>
  `;
}

function renderHeader(path) {
  return `
    <header class="app-header">
      <div class="breadcrumb"><button class="btn icon">≡</button><span>${path}</span></div>
      <div class="header-actions">
        <input class="search-box" value="广西路桥集团" aria-label="当前组织" />
        <select class="role-select" data-role-select aria-label="切换角色">
          ${Object.entries(roles)
            .map(([key, role]) => `<option value="${key}" ${key === state.currentRole ? "selected" : ""}>${role.name}</option>`)
            .join("")}
        </select>
        <button class="btn icon">⌕</button>
        <button class="btn">宋冠先</button>
      </div>
    </header>
  `;
}

function renderMetrics() {
  return `
    <div class="metrics-grid">
      <div class="metric blue"><strong>2个</strong><span>今日问题(工程检查)</span></div>
      <div class="metric teal"><strong>1人次</strong><span>今日整改(工程检查)</span></div>
      <div class="metric purple"><strong>0个</strong><span>今日申请(工序报验)</span></div>
      <div class="metric amber"><strong>0人次</strong><span>今日验收(工序报验)</span></div>
    </div>
  `;
}

function renderUserStoryPanel(mode = "full") {
  return `
    <section class="panel story-panel ${mode === "compact" ? "compact" : ""}">
      <div class="panel-head">
        <strong>9 个用户故事入口</strong>
        <span class="tag">${getCurrentRole().scope}</span>
      </div>
      <div class="panel-body story-grid">
        ${userStories
          .map((story) => {
            const scenario = scenarioMap[story.action];
            const allowed = scenario ? canRunScenario(scenario) : false;
            return `
              <button class="story-card ${allowed ? "" : "disabled"}" data-action="${story.action}">
                <span>${story.id}</span>
                <strong>${story.label}</strong>
                <em>${story.role}</em>
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderRolePanel() {
  return `
    <section class="panel role-panel">
      <div class="panel-head"><strong>角色与权限</strong><span class="tag green">${getCurrentRole().name}</span></div>
      <div class="panel-body role-grid">
        ${Object.entries(roles)
          .map(
            ([key, role]) => `
              <button class="role-card ${key === state.currentRole ? "active" : ""}" data-role="${key}">
                <strong>${role.name}</strong>
                <span>${role.scope}</span>
                <small>${role.allowed.length} 个可办场景</small>
              </button>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderReportPanel() {
  return `
    <section class="panel">
      <div class="panel-head"><strong>报验/检查简报</strong><span class="tag green">快照 RS-Q3-001</span></div>
      <div class="panel-body">
        <div class="chart-bars">
          ${[
            ["长兴公司", 40, 55],
            ["建筑公司", 18, 22],
            ["道桥公司", 88, 82],
            ["路面分公司", 44, 38],
            ["市政分公司", 12, 16],
            ["交建集团", 70, 32]
          ]
            .map(
              ([name, a, b]) => `
                <div class="bar-col">
                  <div class="bar orange" style="height:${a}%"></div>
                  <div class="bar blue" style="height:${b}%"></div>
                  <span>${name}</span>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function renderReferencePanel() {
  return `
    <section class="panel">
      <div class="panel-head"><strong>截图参考</strong><span class="tag">来自 extracted-docx-images</span></div>
      <div class="panel-body">
        <div class="reference-strip">
          ${referenceImages.map((img) => `<img src="${img.src}" alt="${img.label}" title="${img.label}" />`).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderAiDrawer() {
  return `
    <aside class="ai-drawer">
      <div class="ai-titlebar">
        <strong>AI 助手</strong>
        <div class="split-actions"><button class="btn icon">↺</button><button class="btn icon">×</button></div>
      </div>
      <div class="ai-context">
        <span class="tag">Web</span>
        <span class="tag">当前项目：测试一分部</span>
        <span class="tag">角色：${getCurrentRole().name}</span>
        <span class="tag green">上下文已授权</span>
      </div>
      <div class="conversation">
        ${renderMessages()}
        ${renderActiveTask()}
        ${renderSseTimeline()}
        ${renderStatePanel()}
      </div>
      ${renderComposer()}
    </aside>
  `;
}

function renderAiCompact() {
  return `
    <section class="panel">
      <div class="panel-head"><strong>移动端 AI 会话</strong><span class="tag">同一会话 C-20260706-001</span></div>
      <div class="panel-body">
        ${renderMessages()}
        ${renderSseTimeline()}
      </div>
    </section>
  `;
}

function renderMessages() {
  const scenario = scenarioMap[state.activeScenario];
  return `
    <div class="message user"><div class="bubble">${scenario.input}</div></div>
    <div class="message"><div class="bubble">${scenario.response}</div></div>
  `;
}

function renderActiveTask() {
  const scenario = scenarioMap[state.activeScenario];
  const allowed = canRunScenario(scenario);
  const statusClass = !allowed || scenario.status === "failed" ? "red" : scenario.status === "waiting_confirm" ? "red" : "green";
  return `
    <article class="task-card active">
      <div class="task-head">
        <div>
          <h3 class="task-title">${scenario.storyId ? `${scenario.storyId} · ` : ""}${scenario.title}</h3>
          <div class="task-meta">${scenario.skill} · ${scenario.tool} · ${scenario.status}</div>
        </div>
        <span class="tag ${statusClass}">${allowed ? scenario.status : "permission_denied"}</span>
      </div>
      ${
        allowed
          ? ""
          : `<div class="permission-banner">当前角色「${getCurrentRole().name}」无权执行该场景。系统只展示兜底说明，不暴露不可见数据。</div>`
      }
      <div class="field-grid">
        ${scenario.fields.map(([label, value]) => `<div class="field"><label>${label}</label><strong>${value}</strong></div>`).join("")}
      </div>
      <div class="split-actions">
        ${
          allowed && scenario.status === "waiting_confirm"
            ? `<button class="btn primary" data-action="confirm">确认并执行</button>`
            : `<button class="btn primary" data-action="${state.activeScenario}">刷新结果</button>`
        }
        <button class="btn" data-action="manual">转人工处理</button>
      </div>
    </article>
  `;
}

function renderSseTimeline() {
  return `
    <section class="task-card">
      <div class="task-head">
        <h3 class="task-title">SSE 事件流</h3>
        <span class="tag">Spring → Web/App</span>
      </div>
      <table class="table">
        <tbody>
          ${state.sseEvents
            .map((event, index) => `<tr><td>${index + 1}</td><td>${event.event_type}</td><td>${event.payload}</td></tr>`)
            .join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderComposer() {
  return `
    <div class="ai-composer">
      <div class="quick-grid">
        <button class="btn" data-action="guide">工序报验步骤</button>
        <button class="btn" data-action="acceptance">发起验收申请</button>
        <button class="btn" data-action="inspection">语音检查记录</button>
        <button class="btn" data-action="whiteboard">白板照片</button>
        <button class="btn" data-action="ocr">上传OCR资料</button>
        <button class="btn" data-action="report">项目简报</button>
        <button class="btn" data-action="groupBrief">集团简报</button>
        <button class="btn" data-action="config">配置版本</button>
        <button class="btn" data-action="audit">审计失败</button>
      </div>
      <div class="input-row">
        <input value="${scenarioMap[state.activeScenario].input}" aria-label="模拟输入" />
        <button class="btn icon" data-action="ocr">＋</button>
        <button class="btn primary" data-action="acceptance">发送</button>
      </div>
    </div>
  `;
}

function renderKanban() {
  const lanes = [
    ["待补齐", "waiting_input"],
    ["待确认", "waiting_confirm"],
    ["已完成", "completed"]
  ];
  return `
    <div class="kanban">
      ${lanes
        .map(
          ([label, status]) => `
            <div class="lane">
              <h3>${label}</h3>
              ${state.taskNodes
                .filter((task) => task.status === status)
                .map(
                  (task) => `
                    <div class="mini-card">
                      <strong>${task.title}</strong>
                      <div class="task-meta">${task.owner} · ${task.id}</div>
                    </div>
                  `
                )
                .join("")}
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderAuditPanel() {
  return `
    <section class="panel">
      <div class="panel-head"><strong>审计与版本</strong><span class="tag">1年留存</span></div>
      <div class="panel-body audit-list">
        ${state.auditTrail.slice(0, 8).map((item) => `<div class="audit-item"><strong>${item}</strong><span class="task-meta">trace_id=TR-20260706-001</span></div>`).join("")}
      </div>
    </section>
  `;
}

function renderStatePanel() {
  const visible = {
    session: state.session,
    currentRole: {
      key: state.currentRole,
      name: getCurrentRole().name,
      scope: getCurrentRole().scope,
      allowed: getCurrentRole().allowed
    },
    activeScenario: state.activeScenario,
    taskNodes: state.taskNodes,
    ocrBatch: state.ocrBatch,
    reportSnapshot: state.reportSnapshot,
    confirmation: state.confirmation,
    sseEvents: state.sseEvents,
    auditTrail: state.auditTrail.slice(0, 5)
  };
  return `
    <section class="state-panel">
      <header><strong>Prototype State</strong><span class="mono">${state.prototype.variant}</span></header>
      <pre>${escapeHtml(JSON.stringify(visible, null, 2))}</pre>
    </section>
  `;
}

function renderSwitcher(current) {
  return `
    <div class="variant-switcher" aria-label="prototype variant switcher">
      <button data-variant-prev aria-label="上一个变体">‹</button>
      <div class="variant-label">${current} — ${variants[current]}</div>
      <button data-variant-next aria-label="下一个变体">›</button>
    </div>
  `;
}

function bindEvents(root) {
  root.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-action");
      if (action === "confirm") confirmActive();
      else if (action === "manual") markManual();
      else runScenario(action);
    });
  });
  root.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => switchRole(button.getAttribute("data-role")));
  });
  const roleSelect = root.querySelector("[data-role-select]");
  if (roleSelect) roleSelect.addEventListener("change", (event) => switchRole(event.target.value));
  const prev = root.querySelector("[data-variant-prev]");
  const next = root.querySelector("[data-variant-next]");
  if (prev) prev.addEventListener("click", () => cycleVariant(-1));
  if (next) next.addEventListener("click", () => cycleVariant(1));
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

window.addEventListener("keydown", (event) => {
  const tag = document.activeElement ? document.activeElement.tagName : "";
  const editable = document.activeElement && document.activeElement.isContentEditable;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(tag) || editable) return;
  if (event.key === "ArrowLeft") cycleVariant(-1);
  if (event.key === "ArrowRight") cycleVariant(1);
});

window.addEventListener("popstate", render);

runScenario("acceptance");
