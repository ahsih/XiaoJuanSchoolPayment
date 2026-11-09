# BESA / CALA 2027 旺季附加费实施审计

依据 2026-10-26 的 BESA 与 CALA 联合通知及用户本次明确启用要求：2026 年及以前继续使用各校既有 40 美元／周规则；从 2027 年开始，通知中的成员学校统一按 60 美元／周收费。

## 本次启用日期

- BESA：2027/06/27–08/22。
- CALA：2027/07/04–08/28。
- 每名学生按课程和住宿实际覆盖的旺季周计算；同一学生同一周课程与住宿重叠只收一次。
- 多人报价逐人计算后汇总。
- 旺季附加费在注册费减免、课程／住宿优惠、长期优惠、代理折扣及其他百分比优惠之外单独相加。

## 品牌—页面—计算对应表

| 协会 | 学校／校区 | 2027 日期与费率 | 运行位置 |
| --- | --- | --- | --- |
| BESA | A&J | 06/27–08/22，60 美元／周 | `anj-school/anj-student-quote.ts` |
| BESA | BECI EOP / Sparta / City | 06/27–08/22，60 美元／周 | `beci-quote/beci-student-quote.ts`、City 独立页 |
| BESA | MONOL Main / Sparta | 06/27–08/22，60 美元／周 | `monol-school/monol-student-quote.ts`、`monol-sparta-school/monol-sparta-student-quote.ts` |
| BESA | PINES Main / IELTS | 06/27–08/22，60 美元／周 | `pines-school/pines-student-quote.ts` |
| BESA | JIC Challenger / Premium | 06/27–08/22，60 美元／周 | `jic-school/jic-student-quote.ts` |
| BESA | WALES | 06/27–08/22，60 美元／周 | `wales-school/wales-student-quote.ts` |
| CALA | Cebu Blue Ocean | 07/04–08/28，60 美元／周 | `cebu-blue-ocean-school/blue-ocean-student-quote.ts` |
| CALA | BTES | 07/04–08/28，60 美元／周 | `btes-school/btes-student-quote.ts` |
| CALA | CWA | 07/04–08/28，60 美元／周 | `curious-world-school/curious-world-school.component.ts` quick quote |
| CALA | CELLA Uni / Premium | 07/04–08/28，60 美元／周 | `cella-quote/cella-student-quote.ts` |
| CALA | CG Banilad / Sparta | 07/04–08/28，60 美元／周 | `cg-banilad-school/cg-banilad-student-quote.ts`、`cg-sparta-school/cg-sparta-student-quote.ts` |
| CALA | EV Academy | 07/04–08/28，60 美元／周 | `ev-school/ev-quote.ts` |
| CALA | Philinter | 07/04–08/28，60 美元／周 | `philinter-school/philinter-quote.ts` |
| CALA | QQ English | 07/04–08/28，60 美元／周 | `qqenglish-beachfront-school/qqenglish-beachfront-school.component.ts` quick quote |
| CALA | Winning | 07/04–08/28，60 美元／周 | `winning-school/winning-school.component.ts` quick quote |

## Published 内容兼容

- `association-peak-surcharge.ts` 强制协会成员 2027 学习周使用 60 美元，旧 Published JSON 中的标量 `40` 不能覆盖新费率。
- A&J、BECI、MONOL、PINES、JIC、WALES、Blue Ocean、BTES、CELLA、CG、EV、Philinter 的配置克隆会一次性恢复／加入本次确认区间，并只更新旺季政策版本；员工编辑的其他课程、房型、优惠、图片及说明保持不变。
- 页面、单人／多人报价、报价图片和后台预览共用同一个学生报价结果，不在图片端另算旺季费。
- CWA、QQ English、Winning 尚无统一员工报价图片工作台；它们的现有 quick quote 已计入旺季费，但没有虚构新的完整报价图片链路。

## 不在本次通知范围

CIA、I.BREEZE、B'Cebu、CPILS、EV La Mer 等不因本通知改变；它们继续使用各自已确认的旺季或套餐规则。
