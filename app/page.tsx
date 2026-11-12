"use client";

import { useMemo, useState } from "react";
import { orders as initialOrders, products, recentActions, type Order, type Product } from "./mockData";

type Page = "dashboard" | "products" | "orders" | "import" | "review" | "reports" | "help" | "404";
type Toast = { tone: "success" | "warning" | "error"; text: string } | null;

const nav: { id: Page; label: string; icon: string }[] = [
  { id: "dashboard", label: "运营总览", icon: "◫" },
  { id: "products", label: "产品与库存", icon: "▦" },
  { id: "orders", label: "订单", icon: "≡" },
  { id: "import", label: "导入订单", icon: "↥" },
  { id: "review", label: "库存动作与复核", icon: "✓" },
  { id: "reports", label: "报表", icon: "↧" },
];

function tone(value: string) {
  if (["正常", "完全匹配", "已完成", "已自动匹配"].includes(value)) return "good";
  if (["缺货", "异常暂停", "未匹配", "未找到对应 SKU"].includes(value)) return "bad";
  return "warn";
}

function Tag({ children }: { children: string }) {
  return <span className={`tag ${tone(children)}`}><i aria-hidden="true" />{children}</span>;
}

function Empty({ text }: { text: string }) {
  return <div className="empty"><span>⌕</span><strong>暂无匹配数据</strong><p>{text}</p></div>;
}

function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="overlay" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><aside className="drawer" role="dialog" aria-modal="true" aria-label={title}><div className="drawer-head"><div><span className="demo-kicker">L0 Mock Demo</span><h2>{title}</h2></div><button className="icon-btn" onClick={onClose} aria-label="关闭详情">×</button></div>{children}</aside></div>;
}

function Confirm({ title, detail, onCancel, onConfirm }: { title: string; detail: React.ReactNode; onCancel: () => void; onConfirm: () => void }) {
  return <div className="overlay center"><div className="modal" role="alertdialog" aria-modal="true"><div className="modal-icon">!</div><h2>{title}</h2><div className="modal-copy">{detail}</div><div className="modal-actions"><button className="btn secondary" onClick={onCancel}>取消</button><button className="btn danger" onClick={onConfirm}>确认 · Demo 模拟操作</button></div></div></div>;
}

export default function InventoryDemo() {
  const [page, setPage] = useState<Page>("dashboard");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("全部");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState(initialOrders);
  const [toast, setToast] = useState<Toast>(null);
  const [confirmTask, setConfirmTask] = useState<Order | null>(null);
  const [menu, setMenu] = useState(false);

  const notify = (toneValue: NonNullable<Toast>["tone"], text: string) => {
    setToast({ tone: toneValue, text });
    window.setTimeout(() => setToast(null), 2800);
  };

  const go = (target: Page) => { setPage(target); setMenu(false); setQuery(""); setStatus("全部"); };
  const title = nav.find((item) => item.id === page)?.label ?? (page === "help" ? "帮助与待确认" : "页面未找到");

  return <div className="app-shell">
    <aside className={`sidebar ${menu ? "open" : ""}`}>
      <div className="brand"><div className="brand-mark">W</div><div><strong>库存运营台</strong><span>WilliamRock · L0 Demo</span></div></div>
      <nav aria-label="主导航">{nav.map((item) => <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => go(item.id)}><span>{item.icon}</span>{item.label}{item.id === "review" && <b>5</b>}</button>)}</nav>
      <div className="sidebar-note"><div><span className="pulse" />Demo 安全模式</div><p>所有变更仅保留在当前页面，刷新后恢复。</p></div>
      <button className="help-link" onClick={() => go("help")}>? 帮助与待确认</button>
    </aside>
    <div className="main-column">
      <header className="topbar"><button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="打开导航">☰</button><div className="page-title"><span>库存与订单管理系统</span><strong>{title}</strong></div><label className="global-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索 SKU、产品或订单编号" aria-label="全局搜索"/><kbd>⌘ K</kbd></label><div className="today"><span>演示数据截至</span><strong>2026 年 7 月 13 日</strong></div></header>
      <main>
        {page === "dashboard" && <Dashboard go={go} selectOrder={setSelectedOrder} />}
        {page === "products" && <Products query={query} setQuery={setQuery} status={status} setStatus={setStatus} select={setSelectedProduct} />}
        {page === "orders" && <Orders orders={orders} query={query} setQuery={setQuery} status={status} setStatus={setStatus} select={setSelectedOrder} />}
        {page === "import" && <ImportFlow orders={orders} setOrders={setOrders} notify={notify} />}
        {page === "review" && <Review orders={orders} setConfirmTask={setConfirmTask} notify={notify} />}
        {page === "reports" && <Reports notify={notify} />}
        {page === "help" && <Help go={go} />}
        {page === "404" && <NotFound go={go} />}
      </main>
    </div>
    {selectedProduct && <ProductDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    {selectedOrder && <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    {confirmTask && <Confirm title={confirmTask.status === "待到货复核" ? "确认到货并进入人工复核？" : "确认执行库存动作？"} detail={<><p>订单 <strong>{confirmTask.wrNo}</strong> · {confirmTask.sku} · 数量 {confirmTask.qty}</p><div className="stock-delta"><span>本厂 <b>-{confirmTask.qty}</b></span><em>→</em><span>海上 <b>+{confirmTask.qty}</b></span><em>→</em><span>澳洲 <b>复核后更新</b></span></div><small>完成后新增审计记录，不删除原记录。</small></>} onCancel={() => setConfirmTask(null)} onConfirm={() => { notify("success", `已完成 ${confirmTask.wrNo} 的 Demo 模拟操作，并新增审计记录`); setConfirmTask(null); }} />}
    {toast && <div className={`toast ${toast.tone}`} role="status"><strong>{toast.tone === "success" ? "操作成功" : toast.tone === "warning" ? "请注意" : "操作失败"}</strong><span>{toast.text}</span><button onClick={() => setToast(null)} aria-label="关闭通知">×</button></div>}
  </div>;
}

function Dashboard({ go, selectOrder }: { go: (p: Page) => void; selectOrder: (o: Order) => void }) {
  const factory = products.reduce((a, p) => a + p.factory, 0), sea = products.reduce((a, p) => a + p.sea, 0), au = products.reduce((a, p) => a + p.au, 0);
  const shortage = products.filter((p) => p.status === "缺货");
  return <div className="page dashboard-page">
    <section className="control-hero"><div className="hero-copy"><div><Tag>缺货</Tag><span className="demo-label">当前为 L0 Mock Demo</span></div><h1>5 个 SKU 正在影响订单履约</h1><p>优先处理澳洲库存不足、名称映射失败和到货待复核任务。所有库存操作仅为页面内模拟。</p><div className="hero-actions"><button className="btn primary" onClick={() => go("review")}>处理待复核任务 <span>→</span></button><button className="btn ghost" onClick={() => go("import")}>导入新订单</button></div></div><div className="risk-summary"><div><span>高风险订单</span><strong>3</strong><small>其中 1 个已异常暂停</small></div><div><span>待处理任务</span><strong>5</strong><small>2 个需要今日确认</small></div></div></section>
    <section className="inventory-flow" aria-label="三阶段库存流转"><div className="flow-head"><div><h2>库存流转全景</h2><p>订单录入不会立即扣减澳洲库存</p></div><span className="pending-chip">本厂正式名称 · 待确认</span></div><div className="flow-track"><div className="stage"><span className="stage-icon">厂</span><div><small>阶段 1</small><strong>本厂库存</strong><b>{factory} 件</b></div></div><div className="connector"><span>装箱确认</span><i>→</i></div><div className="stage sea"><span className="stage-icon">海</span><div><small>阶段 2</small><strong>海上库存</strong><b>{sea} 件</b></div></div><div className="connector"><span>到货 + 人工复核</span><i>→</i></div><div className="stage au"><span className="stage-icon">澳</span><div><small>阶段 3</small><strong>澳洲库存</strong><b>{au} 件</b></div></div></div></section>
    <div className="dashboard-grid"><section className="panel shortage-panel"><div className="section-head"><div><h2>缺货商品</h2><p>澳洲库存低于安全库存</p></div><button className="text-btn" onClick={() => go("products")}>查看全部 →</button></div><div className="shortage-list">{shortage.slice(0, 5).map((p) => <button key={p.sku} onClick={() => go("products")}><div><strong>{p.name}</strong><span>{p.sku} · {p.color}</span></div><div className="stock-gap"><span>澳洲 <b>{p.au}</b> / 安全 {p.safety}</span><Tag>{p.status}</Tag></div><div className="replenish">建议补货 <b>{p.replenish}</b></div></button>)}</div></section><section className="panel actions-panel"><div className="section-head"><div><h2>最近库存动作</h2><p>模拟审计时间线</p></div></div><div className="timeline">{recentActions.map((a, i) => <div key={i}><i className={i === 3 ? "bad-dot" : ""}/><div><strong>{a[0]}</strong><span>{a[1]}</span><small>{a[2]}</small></div></div>)}</div></section></div>
    <section className="panel arrivals"><div className="section-head"><div><h2>即将到达澳洲</h2><p>未来 14 天需要安排复核的订单</p></div><button className="text-btn" onClick={() => go("orders")}>查看订单 →</button></div><div className="arrival-row">{initialOrders.filter((o) => ["海运中", "待到货复核"].includes(o.status)).slice(0, 3).map((o) => <button key={o.wrNo} onClick={() => selectOrder(o)}><div className="date-block"><strong>{o.eta.slice(8, 10)}</strong><span>7 月</span></div><div><strong>{o.product}</strong><span>{o.wrNo} · {o.qty} 件</span></div><Tag>{o.status}</Tag><span className="chevron">›</span></button>)}</div></section>
    <div className="quick-actions"><button onClick={() => go("import")}><b>↥</b><span>导入订单<small>Excel / PDF 模拟</small></span></button><button onClick={() => go("products")}><b>▦</b><span>查看产品<small>15 个 SKU</small></span></button><button onClick={() => go("orders")}><b>≡</b><span>查看订单<small>9 笔 Mock 订单</small></span></button><button onClick={() => go("reports")}><b>↧</b><span>导出报表<small>缺货与 ETA</small></span></button></div>
  </div>;
}

function Products({ query, setQuery, status, setStatus, select }: { query: string; setQuery: (s: string) => void; status: string; setStatus: (s: string) => void; select: (p: Product) => void }) {
  const rows = useMemo(() => products.filter((p) => `${p.sku}${p.name}`.toLowerCase().includes(query.toLowerCase()) && (status === "全部" || p.status === status)), [query, status]);
  return <div className="page"><PageIntro title="产品与库存" copy="查看三个库存阶段、缺货风险与建议补货数量。点击任意产品查看完整时间线。" /><div className="toolbar"><label className="searchbox">⌕<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索 SKU 或产品名" /></label><Filter value={status} setValue={setStatus} options={["全部", "正常", "即将缺货", "缺货"]}/><select aria-label="库存阶段"><option>全部库存阶段</option><option>本厂有货</option><option>海上有货</option><option>澳洲低库存</option></select><span className="result-count">{rows.length} 个产品</span></div><div className="table-wrap"><table><thead><tr><th>SKU / 产品</th><th>颜色</th><th>客户</th><th>供应商 / 工厂</th><th>安全库存</th><th>本厂</th><th>海上</th><th>澳洲</th><th>状态</th><th>建议补货</th></tr></thead><tbody>{rows.map((p) => <tr key={p.sku} tabIndex={0} onClick={() => select(p)} onKeyDown={(e) => e.key === "Enter" && select(p)}><td><strong>{p.sku}</strong><span>{p.name}</span></td><td>{p.color}</td><td>{p.customer}</td><td>{p.supplier}</td><td>{p.safety}</td><td className="num">{p.factory}</td><td className="num">{p.sea}</td><td className={p.au < p.safety ? "num low" : "num"}>{p.au}</td><td><Tag>{p.status}</Tag></td><td><b>{p.replenish || "—"}</b></td></tr>)}</tbody></table>{!rows.length && <Empty text="尝试清除搜索词或调整缺货筛选。" />}</div></div>;
}

function Orders({ orders, query, setQuery, status, setStatus, select }: { orders: Order[]; query: string; setQuery: (s: string) => void; status: string; setStatus: (s: string) => void; select: (o: Order) => void }) {
  const rows = orders.filter((o) => Object.values(o).join(" ").toLowerCase().includes(query.toLowerCase()) && (status === "全部" || o.status === status));
  return <div className="page"><PageIntro title="订单" copy="统一查看客户网站订单号、WR / 工厂生产编号与 PDF Order Number。" /><div className="toolbar"><label className="searchbox wide">⌕<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索 SKU、产品或任一订单编号" /></label><select value={status} onChange={(e) => setStatus(e.target.value)}><option>全部</option><option>待匹配</option><option>待装箱</option><option>海运中</option><option>待到货复核</option><option>待发货复核</option><option>异常暂停</option><option>已完成</option></select><select><option>全部库存阶段</option><option>本厂</option><option>海上</option><option>澳洲</option></select><span className="result-count">{rows.length} 笔订单</span></div><div className="table-wrap"><table><thead><tr><th>订单编号</th><th>客户</th><th>SKU / 产品</th><th>数量</th><th>ETA</th><th>库存匹配</th><th>补货</th><th>状态</th><th>最近更新</th></tr></thead><tbody>{rows.map((o) => <tr key={o.wrNo} onClick={() => select(o)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && select(o)}><td><strong>{o.webNo}</strong><span>{o.wrNo} · {o.pdfNo}</span></td><td>{o.customer}</td><td><strong>{o.sku}</strong><span>{o.product}</span></td><td className="num">{o.qty}</td><td className={o.eta.includes("延迟") ? "late" : ""}>{o.eta}</td><td><Tag>{o.match}</Tag></td><td>{o.replenish ? <Tag>需要补货</Tag> : "—"}</td><td><Tag>{o.status}</Tag></td><td>{o.updated}</td></tr>)}</tbody></table>{!rows.length && <Empty text="没有订单符合当前搜索与筛选条件。" />}</div></div>;
}

function ImportFlow({ orders, setOrders, notify }: { orders: Order[]; setOrders: (o: Order[]) => void; notify: (t: "success" | "warning" | "error", s: string) => void }) {
  const [step, setStep] = useState(1), [mode, setMode] = useState<"Excel" | "PDF">("Excel"), [mapping, setMapping] = useState(false), [loading, setLoading] = useState(false);
  const advance = () => { setLoading(true); window.setTimeout(() => { setLoading(false); setStep(Math.min(4, step + 1)); }, 550); };
  const create = () => { if (orders.some((o) => o.webNo === "AU-10482")) { notify("error", "重复订单 AU-10482 已被拦截，未生成任何新订单"); return; } notify("success", "已生成 2 笔 Mock 订单；澳洲库存未发生变化"); setOrders([...orders]); setStep(4); };
  return <div className="page import-page"><PageIntro title="导入订单" copy="模拟识别客户订单、映射 SKU 并在人工确认后生成 Mock 订单。原文件不会保存。" /><div className="steps">{["选择来源", "数据预览", "映射确认", "生成结果"].map((s, i) => <div className={step >= i + 1 ? "done" : ""} key={s}><span>{step > i + 1 ? "✓" : i + 1}</span><strong>{s}</strong></div>)}</div><div className="import-card">{loading ? <div className="loading-state"><i/><i/><i/><p>正在模拟解析订单数据…</p></div> : step === 1 ? <><div className="source-tabs"><button className={mode === "Excel" ? "active" : ""} onClick={() => setMode("Excel")}>▦ Excel 导入</button><button className={mode === "PDF" ? "active" : ""} onClick={() => setMode("PDF")}>▤ PDF 识别</button></div><button className="upload-zone" onClick={advance}><span>↥</span><strong>选择一个演示文件</strong><p>点击后使用内置 Mock 数据继续，不会读取或保存真实文件</p><small>{mode === "Excel" ? ".xlsx · 最大 10 MB（演示限制）" : ".pdf · 仅模拟文字识别"}</small></button><div className="safety-note">🔒 Demo 边界：不上传、不解析、不保存任何真实订单或客户文件。</div></> : step === 2 ? <><ImportPreview /><div className="card-actions"><button className="btn secondary" onClick={() => setStep(1)}>返回</button><button className="btn primary" onClick={advance}>检查 SKU 映射 →</button></div></> : step === 3 ? <><div className="mapping-summary"><div><strong>2</strong><span>已自动匹配</span></div><div><strong>1</strong><span>需要人工确认</span></div><div><strong>1</strong><span>重复订单 · 已拦截</span></div></div><div className="mapping-list"><div><span>客户名称</span><b>内部产品 / SKU</b><em>状态</em></div><div><span>Arden 3 Seat / Stone</span><b>Arden 三座沙发 · WR-SOF-101</b><Tag>已自动匹配</Tag></div><div><span>Nora Lounge Moss</span><b>{mapping ? "Nora 扶手椅 · WR-CHR-219" : "等待人工选择"}</b>{mapping ? <Tag>已自动匹配</Tag> : <button className="mini-btn" onClick={() => { setMapping(true); notify("warning", "映射已暂存，生成订单前仍需人工确认"); }}>确认映射</button>}</div><div className="duplicate"><span>AU-10482 / Arden Sofa</span><b>与现有订单 AU-10482 重复</b><Tag>重复订单</Tag></div></div><div className="no-deduct">确认生成订单后，<strong>不会立即减少澳洲库存</strong>。库存只会在对应复核流程中模拟变化。</div><div className="card-actions"><button className="btn secondary" onClick={() => setStep(2)}>返回</button><button className="btn primary" disabled={!mapping} onClick={create}>确认生成 Mock 订单</button></div></> : <div className="success-state"><span>✓</span><h2>Mock 订单已生成</h2><p>本次演示创建 2 笔订单，拦截 1 笔重复订单。库存未发生变化。</p><button className="btn primary" onClick={() => setStep(1)}>继续模拟导入</button></div>}</div></div>;
}

function ImportPreview() { return <><div className="preview-head"><div><h2>数据预览</h2><p>mock_orders_20260713.xlsx · 4 行</p></div><Tag>字段缺失 1</Tag></div><div className="table-wrap embedded"><table><thead><tr><th>客户订单号</th><th>客户产品名</th><th>数量</th><th>ETA</th><th>检查结果</th></tr></thead><tbody><tr><td>AU-10518</td><td>Arden 3 Seat / Stone</td><td>2</td><td>2026-08-12</td><td><Tag>已自动匹配</Tag></td></tr><tr><td>AU-10519</td><td>Nora Lounge Moss</td><td>4</td><td>2026-08-15</td><td><Tag>需要人工确认</Tag></td></tr><tr><td>AU-10482</td><td>Arden Sofa</td><td>5</td><td>2026-07-22</td><td><Tag>重复订单</Tag></td></tr><tr><td>AU-10520</td><td>Unknown Ottoman</td><td>—</td><td>2026-08-18</td><td><Tag>字段缺失</Tag></td></tr></tbody></table></div></> }

function Review({ orders, setConfirmTask, notify }: { orders: Order[]; setConfirmTask: (o: Order) => void; notify: (t: "success" | "warning" | "error", s: string) => void }) {
  const [tab, setTab] = useState("全部待办");
  const tasks = orders.filter((o) => o.status !== "已完成").filter((o) => tab === "全部待办" || o.status === tab);
  return <div className="page"><PageIntro title="库存动作与复核" copy="所有库存变化先说明影响、二次确认并新增审计记录。异常订单会暂停后续动作。" /><div className="review-tabs">{["全部待办", "待装箱", "待到货复核", "待发货复核", "异常暂停", "已完成"].map((t) => <button className={tab === t ? "active" : ""} onClick={() => setTab(t)} key={t}>{t}<span>{t === "全部待办" ? 7 : orders.filter((o) => o.status === t).length}</span></button>)}</div><div className="task-list">{tasks.map((o) => <article key={o.wrNo} className={o.status === "异常暂停" ? "task error-task" : "task"}><div className="task-main"><div><Tag>{o.status}</Tag><span>{o.updated}</span></div><h3>{o.wrNo} · {o.product}</h3><p>{o.customer} · {o.sku} · {o.qty} 件</p></div><div className="route"><span><small>当前阶段</small><strong>{o.status === "待装箱" ? "本厂库存" : o.status === "待到货复核" ? "海上库存" : "澳洲库存"}</strong></span><em>→</em><span><small>目标阶段</small><strong>{o.status === "待装箱" ? "海上库存" : o.status === "待到货复核" ? "待人工复核" : "客户发货"}</strong></span></div><div className="risk"><small>风险提示</small><strong>{o.note ?? (o.replenish ? "完成后仍低于安全库存" : "库存充足，可继续")}</strong></div><div className="operator"><small>操作人</small><strong>{o.status === "异常暂停" ? "系统模拟" : "Eli · 演示"}</strong></div><div className="task-actions">{o.status === "异常暂停" ? <button className="btn secondary" onClick={() => notify("error", "该订单已暂停，请先处理名称映射异常")}>查看异常</button> : <button className="btn primary compact" onClick={() => setConfirmTask(o)}>确认 · Demo 模拟操作</button>}<button className="more" aria-label="更多操作" onClick={() => notify("warning", "此处演示撤销与反向修正入口")}>•••</button></div></article>)}{!tasks.length && <Empty text="此状态下暂无库存动作。" />}</div><button className="reverse-action" onClick={() => notify("success", "已新增反向修正记录：澳洲库存 -2；原记录保留")}>↶ 模拟库存反向修正 · Demo 模拟操作</button></div>;
}

function Reports({ notify }: { notify: (t: "success" | "warning" | "error", s: string) => void }) {
  const [report, setReport] = useState<"shortage" | "eta">("shortage"), [loading, setLoading] = useState(false);
  const exportReport = () => { setLoading(true); window.setTimeout(() => { setLoading(false); notify("success", `${report === "shortage" ? "缺货 / 补货清单" : "订单 ETA 表"}已完成模拟导出`); }, 700); };
  return <div className="page"><PageIntro title="报表" copy="预览、筛选并模拟导出运营清单。最终报表格式仍为待确认。" /><div className="report-switch"><button className={report === "shortage" ? "active" : ""} onClick={() => setReport("shortage")}><b>缺货 / 补货清单</b><span>5 个缺货 SKU · 建议补货 18 件</span></button><button className={report === "eta" ? "active" : ""} onClick={() => setReport("eta")}><b>订单 ETA 表</b><span>9 笔订单 · 1 笔延迟</span></button></div><section className="report-sheet"><div className="report-head"><div><span className="demo-kicker">Mock 报表预览</span><h2>{report === "shortage" ? "缺货 / 补货清单" : "订单 ETA 表"}</h2><p>生成时间：2026-07-13 10:30 · 数据源：演示 Mock Data</p></div><div className="report-actions"><select><option>全部客户</option><option>Harbour Living</option><option>Studio Nine</option></select><button className="btn primary" onClick={exportReport} disabled={loading}>{loading ? "正在模拟导出…" : "↧ 模拟导出"}</button></div></div>{report === "shortage" ? <div className="table-wrap embedded"><table><thead><tr><th>SKU</th><th>产品</th><th>客户</th><th>安全库存</th><th>澳洲库存</th><th>缺口</th><th>建议补货</th><th>状态</th></tr></thead><tbody>{products.filter((p) => p.status === "缺货").map((p) => <tr key={p.sku}><td><strong>{p.sku}</strong></td><td>{p.name}</td><td>{p.customer}</td><td>{p.safety}</td><td className="low num">{p.au}</td><td>{p.safety - p.au}</td><td><b>{p.replenish}</b></td><td><Tag>{p.status}</Tag></td></tr>)}</tbody></table></div> : <div className="table-wrap embedded"><table><thead><tr><th>订单</th><th>客户</th><th>产品</th><th>数量</th><th>ETA</th><th>库存匹配</th><th>状态</th></tr></thead><tbody>{initialOrders.map((o) => <tr key={o.wrNo}><td><strong>{o.wrNo}</strong><span>{o.webNo}</span></td><td>{o.customer}</td><td>{o.product}</td><td>{o.qty}</td><td className={o.eta.includes("延迟") ? "late" : ""}>{o.eta}</td><td><Tag>{o.match}</Tag></td><td><Tag>{o.status}</Tag></td></tr>)}</tbody></table></div>}<div className="report-footer"><span>仅供 L0 Demo 演示，不代表真实库存或订单</span><span>最终报表格式 · 待确认</span></div></section></div>;
}

function PageIntro({ title, copy }: { title: string; copy: string }) { return <div className="page-intro"><div><h1>{title}</h1><p>{copy}</p></div><span className="l0-badge">L0 Mock Demo</span></div> }
function Filter({ value, setValue, options }: { value: string; setValue: (s: string) => void; options: string[] }) { return <div className="segmented">{options.map((o) => <button key={o} className={value === o ? "active" : ""} onClick={() => setValue(o)}>{o}</button>)}</div> }

function ProductDrawer({ product, onClose }: { product: Product; onClose: () => void }) { return <Drawer title={product.name} onClose={onClose}><div className="drawer-body"><div className="detail-meta"><div><span>SKU</span><strong>{product.sku}</strong></div><div><span>皮的颜色</span><strong>{product.color}</strong></div><div><span>客户</span><strong>{product.customer}</strong></div><div><span>供应商 / 工厂</span><strong>{product.supplier}</strong></div></div><section><div className="detail-section-head"><h3>三阶段库存</h3><Tag>{product.status}</Tag></div><div className="drawer-stages"><div><span>本厂</span><b>{product.factory}</b><small>名称待最终确认</small></div><i>→</i><div><span>海上</span><b>{product.sea}</b><small>运输中</small></div><i>→</i><div className={product.au < product.safety ? "risk-stage" : ""}><span>澳洲</span><b>{product.au}</b><small>安全库存 {product.safety}</small></div></div></section><section><h3>库存时间线</h3><div className="detail-timeline"><div><i/><span><b>澳洲库存盘点</b><small>今天 08:40 · 当前 {product.au} 件</small></span></div><div><i/><span><b>海运订单状态更新</b><small>7 月 11 日 · {product.sea} 件运输中</small></span></div><div><i/><span><b>本厂入库模拟记录</b><small>7 月 8 日 · +{Math.min(product.factory, 8)} 件</small></span></div></div></section><section><h3>相关订单</h3>{initialOrders.filter((o) => o.sku === product.sku).map((o) => <div className="related-order" key={o.wrNo}><div><strong>{o.wrNo}</strong><span>{o.customer} · {o.qty} 件</span></div><Tag>{o.status}</Tag></div>) || <Empty text="暂无相关订单" />}</section></div></Drawer> }

function OrderDrawer({ order, onClose }: { order: Order; onClose: () => void }) { return <Drawer title={`订单 ${order.wrNo}`} onClose={onClose}><div className="drawer-body"><div className="order-hero"><div><Tag>{order.status}</Tag><h3>{order.product}</h3><p>{order.customer} · {order.qty} 件</p></div><div><span>ETA</span><strong>{order.eta}</strong></div></div>{order.note && <div className="exception">! <div><strong>异常提示</strong><p>{order.note}</p></div></div>}<section><h3>三个订单编号</h3><div className="detail-meta three"><div><span>客户网站订单号</span><strong>{order.webNo}</strong></div><div><span>WR / 工厂生产编号</span><strong>{order.wrNo}</strong></div><div><span>PDF Order Number</span><strong>{order.pdfNo}</strong></div></div></section><section><h3>匹配与补货判断</h3><div className="match-grid"><div><span>产品名称映射</span><Tag>{order.mapping}</Tag></div><div><span>库存匹配结果</span><Tag>{order.match}</Tag></div><div><span>缺货 / 补货</span><Tag>{order.replenish ? "需要补货" : "无需补货"}</Tag></div></div></section><section><h3>当前流程阶段</h3><div className="process-line">{["订单生成", "装箱确认", "海上运输", "到货复核", "澳洲入库"].map((s, i) => <div className={i <= (["待匹配", "待装箱", "海运中", "待到货复核", "待发货复核", "已完成"].indexOf(order.status)) ? "done" : ""} key={s}><i>{i < 2 ? "✓" : i + 1}</i><span>{s}</span></div>)}</div></section><section><h3>操作记录</h3><div className="detail-timeline"><div><i/><span><b>订单状态更新为“{order.status}”</b><small>{order.updated} · 系统模拟</small></span></div><div><i/><span><b>完成产品名称映射</b><small>2026-07-11 · {order.mapping}</small></span></div></div></section></div></Drawer> }

function Help({ go }: { go: (p: Page) => void }) { const items = ["本厂库存正式显示名称", "客户未来可查看的具体字段", "真实 ETA 计算规则", "真实订单样例和字段映射", "真实 SKU 命名规则", "移动端实际使用强度", "最终报表格式", "客户确认人和确认日期"]; return <div className="page"><PageIntro title="帮助与待确认" copy="此页面集中说明 Demo 边界、库存动作规则与尚未确认的业务事实。"/><div className="help-grid"><section className="panel"><h2>Demo 安全边界</h2><ul className="check-list"><li>不连接真实后端、数据库或第三方系统</li><li>不保存上传文件、账号、密钥或客户隐私</li><li>所有库存变化仅修改页面临时 Mock 状态</li><li>刷新页面后恢复初始数据</li><li>当前不是生产系统，也未经过客户正式验收</li></ul><button className="text-btn help-404" onClick={() => go("404")}>查看 404 状态演示 →</button></section><section className="panel"><h2>待确认项</h2><div className="confirm-list">{items.map((i) => <div key={i}><span>{i}</span><Tag>待确认</Tag></div>)}</div></section><section className="panel full"><h2>三阶段库存规则</h2><div className="rule-grid"><div><b>订单录入</b><p>不会立即减少澳洲库存。</p></div><div><b>装箱确认</b><p>本厂库存减少，海上库存增加。</p></div><div><b>到货确认</b><p>先进入待人工复核；复核后海上减少、澳洲增加。</p></div><div><b>撤销操作</b><p>新增反向修正记录，不删除原记录。</p></div></div></section></div></div> }
function NotFound({ go }: { go: (p: Page) => void }) { return <div className="not-found"><span>404</span><h1>这个页面不在 Demo 范围内</h1><p>页面可能已移动，或尚未纳入本次 L0 Mock Demo。</p><button className="btn primary" onClick={() => go("dashboard")}>返回运营总览</button></div> }
