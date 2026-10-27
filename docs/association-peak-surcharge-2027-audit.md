# BESA / CALA 2027 旺季附加费实施审计

依据 2026-10-26 的 BESA 与 CALA 联合通知：成员学校的旺季附加费在 2026 年及以前维持 40 美元／周，从 2027 年开始调整为 60 美元／周。通知中的 `6/27–8/22` 与 `7/4–8/28` 只是协会参考区间，实际日期仍以每所学校资料为准。

## 统一计算边界

- 每名学生独立计算实际覆盖旺季的学习／住宿周。
- 同一名学生同一周同时有课程和住宿时只收一次。
- 多人报价先逐人计算，再汇总。
- 旺季费在课程费、住宿费以及全部固定／百分比优惠之外单独相加。
- 已发布内容可维护学校确认的旺季日期，但不能把协会成员的 2027 费率改回 40 美元。
- 没有明确 2027 日期的学校不自动收费；历史推算日期在加载旧 Published 内容时会被停用。

## 品牌—页面—规则对应表

| 协会 | 学校／校区 | 公开页面 | 仓库既有日期与费率 | 2027 状态 | 实际计算位置 |
| --- | --- | --- | --- | --- | --- |
| BESA | A&J | `/philippines-study/baguio/anj-e-edu-english-academy` | 2026/06/28–08/22，40 美元／周 | 日期待确认；旧推算 2027/06/27–08/21 已停用 | `anj-school/anj-student-quote.ts` |
| BESA | BECI EOP / Sparta | `/philippines-study/baguio/beci-eop-campus`、`beci-sparta-campus` | 2026/06/28–08/22，40 美元／周 | 日期待确认；旧推算 2027/06/27–08/21 已停用 | `beci-quote/beci-student-quote.ts` |
| BESA | BECI City | `/philippines-study/baguio/api-beci-city-campus` | 2026/06/28–08/22，40 美元／周 | 日期待确认；不启用 2027 费率行 | 独立旧页面，仅保留 2026 提示 |
| BESA | MONOL Main | `/philippines-study/baguio/monol` | 无普通旺季附加费区间 | 日期待确认；不启用 | `monol-school/monol-content-config.ts` |
| BESA | MONOL Sparta | `/philippines-study/baguio/monol-sparta-campus` | 无普通旺季附加费区间 | 日期待确认；不启用 | `monol-sparta-school/monol-sparta-content-config.ts` |
| BESA | PINES Main / IELTS | `/philippines-study/baguio/pines-international-academy` | 2026/06/28–08/22，40 美元／周 | 日期待确认；旧推算 2027/06/27–08/21 已停用 | `pines-school/pines-student-quote.ts` |
| BESA | JIC Challenger / Premium | `/philippines-study/baguio/baguio-jic-challenger`、`baguio-jic-premium` | 2026/06/28–08/22，40 美元／周 | 日期待确认；不启用 | `jic-school/jic-student-quote.ts` |
| BESA | WALES | `/philippines-study/baguio/wales-academy` | 2026/06/28–08/08 仅用于削减长期优惠，不是独立 40 美元旺季费 | 2027 独立收费日期待确认；不启用 | `wales-school/wales-student-quote.ts` |
| CALA | Cebu Blue Ocean | `/philippines-study/cebu/cebu-blue-ocean-academy` | 2026/06/28–08/22，40 美元／周 | **启用：2027/06/27–08/21，60 美元／周** | `cebu-blue-ocean-school/blue-ocean-student-quote.ts` |
| CALA | BTES | `/philippines-study/cebu/btes-english-academy` | 没有旺季附加费区间 | 日期待确认；不启用 | `btes-school/btes-student-quote.ts`（当前无旺季行） |
| CALA | CWA | `/philippines-study/cebu/curious-world-academy` | 页面只有约 5,000 日元／周的 2026 参考提示，未进入完整报价／图片计算 | 日期、美元规则及完整报价链路均待确认；不新建 | `curious-world-school/curious-world-school.component.ts` |
| CALA | CELLA Uni Sparta | `/philippines-study/cebu/cella-uni-sparta-campus` | 2026/07/05–08/29，40 美元／周 | **启用：2027/07/04–08/28，60 美元／周** | `cella-quote/cella-student-quote.ts` |
| CALA | CELLA Premium | `/philippines-study/cebu/cella-premium-campus` | 2026/07/05–08/29，40 美元／周 | **启用：2027/07/04–08/28，60 美元／周** | `cella-quote/cella-student-quote.ts` |
| CALA | CG Banilad | `/philippines-study/cebu/cg-academy-banilad-campus` | 2026/07/05–08/30，40 美元／周 | 日期待确认；不启用 | `cg-banilad-school/cg-banilad-student-quote.ts` |
| CALA | CG Sparta | `/philippines-study/cebu/cg-academy-sparta-campus` | 2026/07/05–08/30，40 美元／周 | 日期待确认；不启用 | `cg-sparta-school/cg-sparta-student-quote.ts` |
| CALA | EV Academy | `/philippines-study/cebu/ev-academy` | 当前资料没有已启用的 2026 普通旺季日期 | **启用：2027/07/04–08/28，60 美元／周** | `ev-school/ev-quote.ts` |
| CALA | EV La Mer | `/philippines-study/cebu/ev-la-mer` | 独立普通／家庭套餐旺季价格，不是联合通知中的普通 40 美元统一行 | 不凭品牌相似自动改动 | `la-mer-school/la-mer-quote.ts` |
| CALA | Philinter | `/philippines-study/cebu/philinter-academy` | 2026/07/05–08/29，40 美元／周 | 日期待确认；旧推算 2027/07/04–08/28 已停用 | `philinter-school/philinter-quote.ts` |
| CALA | QQ English | `/philippines-study/cebu/qqenglish-beachfront-campus` | 有快速主费报价，但没有旺季费及完整报价图片计算 | 日期与报价链路待确认；不新建 | `qqenglish-beachfront-school/qqenglish-beachfront-school.component.ts` |
| CALA | Winning | `/philippines-study/cebu/winning-english-academy` | 2026/07/05–08/29 的 40 美元／周只作页面提示，明确未自动加总 | 2027 日期与完整报价图片链路待确认；不新建 | `winning-school/winning-school.component.ts` |

## 非联合通知学校

CIA、I.BREEZE、B'Cebu、CPILS、EV La Mer 等不因本次联合通知自动改变。即使仓库中存在其他 40 美元金额或独立旺季规则，也保持原样，等待该校自己的正式通知。

## Published 内容兼容

- 协会成员的运行时费率由 `association-peak-surcharge.ts` 按学习周年份决定，旧 Published JSON 中的标量 `40` 不能覆盖 2027 的 60 美元。
- A&J、BECI、PINES 与 Philinter 的旧 Published 2027 推算区间会在配置克隆时自动停用，但其他课程、住宿、优惠、图片和员工说明保持不变。
- EV 旧 Published 优惠范围会升级为只作用于课程与住宿，旺季费不会进入百分比折扣基数。

