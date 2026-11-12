export type StockStatus = "正常" | "即将缺货" | "缺货";
export type OrderStatus = "待匹配" | "待装箱" | "海运中" | "待到货复核" | "待发货复核" | "异常暂停" | "已完成";

export interface Product {
  sku: string;
  name: string;
  color: string;
  customer: string;
  supplier: string;
  safety: number;
  factory: number;
  sea: number;
  au: number;
  status: StockStatus;
  replenish: number;
}

export interface Order {
  webNo: string;
  wrNo: string;
  pdfNo: string;
  customer: string;
  sku: string;
  product: string;
  qty: number;
  eta: string;
  match: "完全匹配" | "部分匹配" | "未匹配";
  replenish: boolean;
  status: OrderStatus;
  updated: string;
  mapping: "已自动匹配" | "需要人工确认" | "未找到对应 SKU";
  note?: string;
}

export const products: Product[] = [
  { sku: "WR-SOF-101", name: "Arden 三座沙发", color: "岩灰", customer: "Harbour Living", supplier: "桐乡 A 厂", safety: 8, factory: 18, sea: 6, au: 3, status: "缺货", replenish: 5 },
  { sku: "WR-SOF-118", name: "Marlow 双座沙发", color: "燕麦", customer: "North & Co.", supplier: "桐乡 A 厂", safety: 6, factory: 10, sea: 8, au: 7, status: "正常", replenish: 0 },
  { sku: "WR-CHR-204", name: "Luna 休闲椅", color: "焦糖", customer: "Harbour Living", supplier: "海宁软体厂", safety: 10, factory: 22, sea: 0, au: 4, status: "缺货", replenish: 6 },
  { sku: "WR-CHR-219", name: "Nora 扶手椅", color: "墨绿", customer: "Studio Nine", supplier: "海宁软体厂", safety: 5, factory: 4, sea: 10, au: 6, status: "正常", replenish: 0 },
  { sku: "WR-OTT-301", name: "Milo 脚凳", color: "雾蓝", customer: "North & Co.", supplier: "桐乡 B 厂", safety: 6, factory: 9, sea: 4, au: 5, status: "即将缺货", replenish: 1 },
  { sku: "WR-BEN-320", name: "Aster 长凳", color: "沙褐", customer: "Arc & Home", supplier: "桐乡 B 厂", safety: 4, factory: 0, sea: 8, au: 1, status: "缺货", replenish: 3 },
  { sku: "WR-TBL-402", name: "Cove 边几", color: "胡桃木", customer: "Studio Nine", supplier: "嘉善木作厂", safety: 8, factory: 16, sea: 0, au: 12, status: "正常", replenish: 0 },
  { sku: "WR-TBL-416", name: "Piper 咖啡桌", color: "烟熏橡木", customer: "Arc & Home", supplier: "嘉善木作厂", safety: 5, factory: 7, sea: 2, au: 3, status: "缺货", replenish: 2 },
  { sku: "WR-CUS-510", name: "Ridge 腰枕", color: "铜棕", customer: "Harbour Living", supplier: "绍兴软装厂", safety: 20, factory: 48, sea: 20, au: 26, status: "正常", replenish: 0 },
  { sku: "WR-CUS-522", name: "Vale 方枕", color: "云白", customer: "North & Co.", supplier: "绍兴软装厂", safety: 16, factory: 30, sea: 12, au: 14, status: "即将缺货", replenish: 2 },
  { sku: "WR-RUG-601", name: "Tide 羊毛地毯", color: "海盐", customer: "Studio Nine", supplier: "南通家纺厂", safety: 3, factory: 5, sea: 2, au: 4, status: "正常", replenish: 0 },
  { sku: "WR-LMP-710", name: "Rowan 落地灯", color: "哑黑", customer: "Arc & Home", supplier: "中山灯具厂", safety: 4, factory: 6, sea: 0, au: 2, status: "缺货", replenish: 2 },
  { sku: "WR-STL-805", name: "Fawn 吧椅", color: "栗棕", customer: "Harbour Living", supplier: "安吉椅业厂", safety: 8, factory: 12, sea: 14, au: 9, status: "正常", replenish: 0 },
  { sku: "WR-DIN-820", name: "Orla 餐椅", color: "石灰", customer: "Studio Nine", supplier: "安吉椅业厂", safety: 12, factory: 24, sea: 18, au: 8, status: "即将缺货", replenish: 4 },
  { sku: "WR-BED-901", name: "Sable 床尾凳", color: "深海蓝", customer: "North & Co.", supplier: "桐乡 A 厂", safety: 4, factory: 8, sea: 0, au: 5, status: "正常", replenish: 0 },
];

export const orders: Order[] = [
  { webNo: "AU-10482", wrNo: "WRP-7721", pdfNo: "PDF-58802", customer: "Harbour Living", sku: "WR-SOF-101", product: "Arden 三座沙发", qty: 5, eta: "2026-07-22", match: "部分匹配", replenish: true, status: "待装箱", updated: "今天 09:42", mapping: "已自动匹配" },
  { webNo: "AU-10486", wrNo: "WRP-7725", pdfNo: "PDF-58810", customer: "North & Co.", sku: "WR-SOF-118", product: "Marlow 双座沙发", qty: 3, eta: "2026-07-18", match: "完全匹配", replenish: false, status: "海运中", updated: "今天 08:16", mapping: "已自动匹配" },
  { webNo: "AU-10491", wrNo: "WRP-7730", pdfNo: "PDF-58817", customer: "Studio Nine", sku: "WR-CHR-219", product: "Nora 扶手椅", qty: 4, eta: "2026-07-20", match: "完全匹配", replenish: false, status: "待到货复核", updated: "昨天 17:40", mapping: "需要人工确认" },
  { webNo: "AU-10494", wrNo: "WRP-7733", pdfNo: "PDF-58821", customer: "Arc & Home", sku: "WR-BEN-320", product: "Aster 长凳", qty: 3, eta: "2026-07-16 · 延迟 4 天", match: "未匹配", replenish: true, status: "异常暂停", updated: "昨天 15:08", mapping: "未找到对应 SKU", note: "名称映射失败，后续动作已暂停，请人工处理。" },
  { webNo: "AU-10499", wrNo: "WRP-7738", pdfNo: "PDF-58828", customer: "Harbour Living", sku: "WR-CHR-204", product: "Luna 休闲椅", qty: 6, eta: "2026-08-02", match: "部分匹配", replenish: true, status: "待发货复核", updated: "昨天 13:25", mapping: "已自动匹配" },
  { webNo: "AU-10503", wrNo: "WRP-7742", pdfNo: "PDF-58835", customer: "Studio Nine", sku: "WR-TBL-402", product: "Cove 边几", qty: 2, eta: "2026-07-14", match: "完全匹配", replenish: false, status: "已完成", updated: "7 月 12 日", mapping: "已自动匹配" },
  { webNo: "AU-10507", wrNo: "WRP-7746", pdfNo: "PDF-58839", customer: "North & Co.", sku: "WR-CUS-522", product: "Vale 方枕", qty: 10, eta: "2026-07-28", match: "完全匹配", replenish: true, status: "待匹配", updated: "7 月 12 日", mapping: "需要人工确认" },
  { webNo: "AU-10511", wrNo: "WRP-7750", pdfNo: "PDF-58844", customer: "Arc & Home", sku: "WR-LMP-710", product: "Rowan 落地灯", qty: 4, eta: "2026-08-06", match: "部分匹配", replenish: true, status: "待装箱", updated: "7 月 11 日", mapping: "已自动匹配" },
  { webNo: "AU-10514", wrNo: "WRP-7753", pdfNo: "PDF-58848", customer: "Studio Nine", sku: "WR-DIN-820", product: "Orla 餐椅", qty: 12, eta: "2026-07-25", match: "完全匹配", replenish: true, status: "海运中", updated: "7 月 11 日", mapping: "已自动匹配" },
];

export const recentActions = [
  ["装箱确认", "WRP-7725 · 本厂 -3 / 海上 +3", "今天 08:16"],
  ["到货待复核", "WRP-7730 · 海上库存暂未扣减", "昨天 17:40"],
  ["反向修正", "WRP-7708 · 澳洲 +2 → -2 修正", "昨天 11:05"],
  ["异常暂停", "WRP-7733 · SKU 映射失败", "昨天 10:24"],
];
