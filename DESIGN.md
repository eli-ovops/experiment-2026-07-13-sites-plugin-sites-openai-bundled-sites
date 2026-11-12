# Design System

## Theme

明亮办公环境下的库存运营控制塔。浅灰工作面、深蓝灰导航和标题，青绿表示正常，蜂蜜琥珀表示待复核，红色表示缺货或异常。颜色策略为 restrained。

## Color Palette

- Background: `oklch(0.975 0.006 240)`
- Surface: `oklch(1 0 0)`
- Ink: `oklch(0.255 0.035 245)`
- Primary: `oklch(0.37 0.065 245)`
- Accent: `oklch(0.70 0.15 68)`
- Success: `oklch(0.59 0.12 170)`
- Danger: `oklch(0.56 0.19 25)`
- Muted: `oklch(0.50 0.025 245)`

## Typography

使用 Geist / 系统无衬线；固定字号比例，数据使用等宽数字。标题克制，不使用营销型大字。

## Components

8–14px 圆角；清晰边框或轻阴影二选一。按钮、输入、标签、表格、抽屉、确认弹窗和 Toast 使用统一状态词汇。

## Layout

桌面为 240px 侧栏 + 内容区；平板缩窄；手机侧栏收为顶部横向导航。首页首屏突出横向库存流与缺货风险，而不是通用指标卡堆叠。

## Motion

150–220ms 状态过渡，仅用于抽屉、弹窗、Toast 与按钮反馈；`prefers-reduced-motion` 下禁用位移动画。
