# 学校报价规则检查与修复

日期：2026-09-18。范围来自实际 Angular 路由、页面引用和报价／图片计算代码，不以学校文档名单代替代码检查。

## 范围与状态

- 已有完整报价与图片流程：27 组计算器，覆盖 33 个学校／校区配置。普通报价统一按每位学生的总课程周数定价，双向同步住宿与课程，校验周日开始、周六结束及连续覆盖。
- 部分完成：33 个学校页面仍是简易试算／资料展示，未接入完整报价图片流程。本次不新建、不宣称其已修复。
- 未实现：本次路由清点未发现另一个独立的、纯占位报价页；旧碧瑶 TALK 路由跳转城市页，不存在独立完整报价器。JIC、BECI、GITC 的别名和重定向不重复计数。
- MINT 主校页面与独立 `/quote` 页面复用一个组件，只检查一套计算逻辑；它现有的是普通单人及固定／家庭套餐，本次未增加普通多人模式。

## 已完成页面结果

“统一修复”包括：每人满 4 周后不同课程、不同房型按各自四周价格折算；未满 4 周使用该校已有短期比例；不叠加同行者周数；两侧不同分段数仍保持同一段连续住宿／学习时间；无效日期、非周日、重叠、缺段不得导出。缺少已确认短期价格时保留拦截。

| 学校／校区 | 发现的问题 | 修复结果／边界 |
| --- | --- | --- |
| EV | 拆出的 1／3 周住宿误用短期加价；额外输出内部解释 | 已修复逐人价格与同步，移除内部公式／同步说明；多人 4 周＋3 周精确金额验证通过 |
| CIA | 共用分段价格与日期逻辑不统一 | 统一修复；保留年度价格、旺季及优惠 |
| CG Banilad | 同上 | 统一修复；保留当地费用日期切换 |
| CG Sparta | 原“每行短期比例”逻辑与文案冲突 | 统一修复；删除旧逐行算法说明，已发布配置加载时同步清理；保留 52 周范围及独立费用 |
| SMEAG Capital | 共用分段价格与日期逻辑不统一 | 统一修复 |
| CPI | 同上 | 统一修复 |
| CPILS | 原周数选项妨碍短分段组合 | 普通长报价允许短分段；没有确认价格的整段短期报价仍拦截 |
| PINES Main／IELTS | 分段价格与同步不统一 | 两校区独立检查通过；保证班要求保留 |
| MONOL Main／Sparta | 两校区价格及允许周数不同；同步不统一 | 分别验证，不合并校区配置；保留原优惠和费用 |
| PHILINTER | 强制课程住宿逐行对应 | 改为总时间覆盖一致，允许一门课程配多种房型 |
| B’Cebu | 共用分段价格与日期逻辑不统一 | 统一修复；保证班要求保留 |
| I.BREEZE | 原 4 周步长妨碍拆段 | 长报价允许 1／2／3 周分段；年龄、青少年费、促销与旺季保持原规则 |
| BECI EOP／Sparta／City | 共用逻辑存在同类问题，三校区限制不同 | 三校区分别验证；年龄、房型和保证班限制保留 |
| JIC Challenger／Premium | 共用逻辑及图片中短期算法说明 | 两校区分别验证；删除旧图片公式，保留校区自定义文案及明确清空值 |
| GLC | 家庭住宿容易按床位周数混算；共享课程成员日期可脱节 | 按住宿成员分别同步；显式共享家庭课程的成员联动，其他学生不受影响；共同学费不重复计收 |
| A&J | 共用同步不统一；存在整间房及保证班价 | 普通报价统一，整间房／保证班继续专用计价，不拆包 |
| IMS | 普通价格仍受旧逐段周数表限制 | 有四周基价的普通课程和房型统一折算；没有四周基价的特殊课程保留原价与周数限制 |
| IU／ICL | 同样分段导致淡季组合资格丢失；混房组合缺少确认价 | 相同连续类型可合并核对原优惠；普通价统一。缺少套餐组合价的合资格混合方案拦截导出，待确认 |
| CELLA Uni Sparta／Premium | 普通报价只有单组课程住宿，无法实现不同分段 | 接入共用分段表单及图片明细；两校区独立价格；家庭／赠周套餐保留原结构 |
| English Fella First／Second | 共用分段同步不统一 | 两校区分别验证；家庭课程排除项、年龄费和优惠顺序保留 |
| BTES | 强制课程住宿逐段对应；短期比例按段判断 | 普通住宿／走读按时间交集计算，允许不同分段；年龄和课程门槛保留；ALL IN ONE 固定套餐不拆价 |
| Cebu Blue Ocean | 共用分段规则不统一，报价区域展示内部比例说明 | 统一修复，清理报价区域内部算法提示；优惠顺序保留 |
| TARGET | 组合套餐增删段后日期可不连续 | 连续日期、周日校验与删除首段后重排已修复；保留课程＋住宿组合价，不虚构拆分单价 |
| WALES | 共用同步不统一；图片中额外算法解释 | 普通报价统一并清理算法说明；PTE 专项当地费用及保证班周数限制保留 |
| English MINT（主页面／报价页） | 普通报价无法混课混房；编辑到未公布周数时表单报错 | 接入共用分段及图片行；过渡状态正常且拦截未知学杂费报价；固定／家庭套餐不拆包 |

学校基价、注册费、优惠金额、旺季费、当地费用和年龄条件没有统一套用另一学校的配置。原有校园介绍、价格目录和必要的付款／优惠条件不扩写。共用动态短期算法说明、EV 同步说明及已识别的旧逐段计价提示已移除，未新增学生可见内部公式。

## 特殊结构与待确认事项

| 范围 | 保留的处理 | 仍需确认才能扩展的情况 |
| --- | --- | --- |
| IU／ICL 淡季课程＋住宿优惠套餐 | 完整已知组合保留套餐价和注册费减免；相同类型的连续拆段不丢优惠 | 活动期内实际换课／换房而没有对应组合价时，阻止导出；需学校确认组合价及优惠适用方式 |
| CELLA 家庭套餐、6+2／9+3 | 保留整包金额、实际住宿周数、赠周和原优惠义务 | 与普通课／房混合需要确认；不自行拆价或取消赠周。原有短期比例未改，短期正式账单仍需顾问核实 |
| MINT 固定两周／家庭套餐 | 原整包价和包含项目保持原样 | 不拆分固定套餐。普通报价目前只有 4／8／12／16／20／24 周完整当地费用；其他总周数需要学校费用数据 |
| A&J／IMS 保证班、BTES ALL IN ONE、TARGET 组合价、GLC 家庭共享课程 | 保留各自价格结构；GLC 已确认共享课程仅收费一次；TARGET 以组合段表达换课换房 | 不能凭普通四周均价规则虚构不存在的拆分价格或改变套餐组成 |
| WALES PTE、各校保证班／有最低课程长度的考试课程 | 原有完整费用表、开课周期、最低周数限制保留 | 若要短于该课程已确认周期的混合安排，需要对应课程资格／专项费用数据 |
| 缺少真实短期价的学校 | 可在满四周的普通报价中选择短分段；整份报价不足四周则拦截 | 例如 A&J、CPILS、I.BREEZE、English Fella、MONOL Sparta，以及 PINES 未确认的一周总报价，不新增猜测比例 |

## 验证记录

| 检查 | 结果 |
| --- | --- |
| 跨校共同规则与图片检查 | 134 项通过，包含所有 33 个完成配置、1＋3、2＋2、超过四周、多类型、多人独立定价、双向日期／周数／增删同步、周日及无效日期拦截 |
| 原有学校回归测试 | 142 项通过；覆盖 EV、IMS、BTES、MINT、GLC、PHILINTER、CELLA、A&J 的原金额、费用及套餐行为 |
| 专项／已发布配置 | 75 项通过；覆盖 IU／ICL、JIC、GLC、独立校区配置、旧说明清理及显式空文案保留。包含与回归组重复的 GLC 检查，不将三组相加作为独立测试总数 |
| TARGET 原有套餐回归 | 11 项通过，保留学校组合价格、独立多人报价及完整多人 PNG |
| 真实 PNG 生成 | EV 原回归及 CELLA／MINT 新检查生成 PNG，核对实际绘制金额、日期和内部算法文案缺失 |
| 网页／员工预览一致性 | 各校图片数据复用实际计算结果，员工预览沿用同一页面／渲染器；校区及已发布文案配置通过专项检查。未登录线上员工后台执行发布 |
| 桌面／手机 | 本地 CELLA 与 MINT 在 1440×1050、390×844 检查；分段输入无横向溢出，日期双向联动正确；MINT 编辑期间不再出现金额格式化异常 |
| Angular 生产构建 | 通过 |

EV 精确验收例：第一位学生两门课各 2 周，课程费 490＋515＝1,005 美元；住宿 1 周三人间＋3 周四人间为 237.5＋675＝912.5 美元。第二位学生独立 3 周，所选课程为 833 美元、四人间为 765 美元，均采用其本人的 85% 档位。以上是优惠前分项，最终优惠和应付金额继续由原规则计算。

复现入口在客户端目录：

```powershell
npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.quote-rules.spec.json --include=src/app/pages/philippines/school-quote-rules.spec.ts --progress=false
npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.quote-regression.spec.json --include=src/app/pages/philippines/ev-school/*.spec.ts --include=src/app/pages/philippines/ims-school/*student*.spec.ts --include=src/app/pages/philippines/btes-school/*.spec.ts --include=src/app/pages/philippines/english-mint-school/*.spec.ts --include=src/app/pages/philippines/glc-school/*.spec.ts --include=src/app/pages/philippines/philinter-school/*.spec.ts --include=src/app/pages/philippines/cella-quote/*.spec.ts --include=src/app/pages/philippines/anj-school/*student*.spec.ts --progress=false
npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.quote-special-cases.spec.json --include=src/app/pages/philippines/iu-school/*.spec.ts --include=src/app/pages/philippines/jic-school/*.spec.ts --include=src/app/pages/philippines/glc-school/*.spec.ts --include=src/app/pages/philippines/unified-school-content-config.spec.ts --progress=false
npx ng test --watch=false --browsers=ChromeHeadlessNoSandbox --ts-config=tsconfig.target-spec.json --include=src/app/pages/philippines/target-school/*.spec.ts --progress=false
npx ng build --configuration production
```

未提交、未推送、未部署。未改服务端、数据库、无关媒体及原有非本任务修改。

## 部分完成页面（本次跳过）

以下实际路由已有学校内容或简易试算，但没有完整的报价图片流程，未将其升级为新报价页。

| 学校／页面 | 实际路由 | 跳过原因 |
| --- | --- | --- |
| First English | /philippines-study/cebu/first-english-global-college | 未完成完整报价图片流程，本次不新建 |
| CIEC | /philippines-study/cebu/ciec | 未完成完整报价图片流程，本次不新建 |
| ELSA | /philippines-study/cebu/elsa-international-language-school | 未完成完整报价图片流程，本次不新建 |
| ETHOS | /philippines-study/cebu/ethos-language-school | 未完成完整报价图片流程，本次不新建 |
| CIJ Premium | /philippines-study/cebu/cij-academy-premium-campus | 未完成完整报价图片流程，本次不新建 |
| Curious World | /philippines-study/cebu/curious-world-academy | 未完成完整报价图片流程，本次不新建 |
| QQEnglish Beachfront | /philippines-study/cebu/qqenglish-beachfront-campus | 未完成完整报价图片流程，本次不新建 |
| Stargate | /philippines-study/cebu/stargate-global-education | 未完成完整报价图片流程，本次不新建 |
| Winning | /philippines-study/cebu/winning-english-academy | 未完成完整报价图片流程，本次不新建 |
| GLANT | /philippines-study/cebu/glant | 未完成完整报价图片流程，本次不新建 |
| 3D Academy | /philippines-study/cebu/3d-academy | 未完成完整报价图片流程，本次不新建 |
| Genius | /philippines-study/cebu/genius-english-academy | 未完成完整报价图片流程，本次不新建 |
| Howdy | /philippines-study/cebu/howdy-english-academy | 未完成完整报价图片流程，本次不新建 |
| Lapulapu | /philippines-study/cebu/lapulapu | 未完成完整报价图片流程，本次不新建 |
| HELP Longlong | /philippines-study/baguio/help-english-longlong-campus | 未完成完整报价图片流程，本次不新建 |
| CIP | /philippines-study/clark/cip-english-kepos | 未完成完整报价图片流程，本次不新建 |
| EG | /philippines-study/clark/eg-academy | 未完成完整报价图片流程，本次不新建 |
| Clark WE | /philippines-study/clark/clark-we-academy | 未完成完整报价图片流程，本次不新建 |
| Clark TALK | /philippines-study/clark/talk-academy | 未完成完整报价图片流程，本次不新建 |
| HELP Clark | /philippines-study/clark/help-english-clark | 未完成完整报价图片流程，本次不新建 |
| AELC | /philippines-study/clark/aelc-native-focused-clark-schools | 未完成完整报价图片流程，本次不新建 |
| Hana | /philippines-study/clark/hana-academy | 未完成完整报价图片流程，本次不新建 |
| Enderun | /philippines-study/manila/enderun-extension | 未完成完整报价图片流程，本次不新建 |
| American English | /philippines-study/manila/american-english-skills-development-center | 未完成完整报价图片流程，本次不新建 |
| Berlitz | /philippines-study/manila/berlitz-philippines | 未完成完整报价图片流程，本次不新建 |
| Manila Business College | /philippines-study/manila/manila-business-college | 未完成完整报价图片流程，本次不新建 |
| Boracay COCO | /philippines-study/boracay/boracay-coco-english-academy | 未完成完整报价图片流程，本次不新建 |
| Paradise English | /philippines-study/boracay/paradise-english-boracay-language-institute | 未完成完整报价图片流程，本次不新建 |
| E-Room | /philippines-study/bacolod/e-room-language-center | 未完成完整报价图片流程，本次不新建 |
| GITC | /philippines-study/iloilo/gitc-college-international-language-center | 未完成完整报价图片流程，本次不新建 |
| Iloilo WE | /philippines-study/iloilo/we-academy | 未完成完整报价图片流程，本次不新建 |
| PIA | /philippines-study/iloilo/polyglot-international-academy | 未完成完整报价图片流程，本次不新建 |
| MK | /philippines-study/iloilo/mk-language-training-center | 未完成完整报价图片流程，本次不新建 |
