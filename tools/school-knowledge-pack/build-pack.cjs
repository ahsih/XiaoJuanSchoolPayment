#!/usr/bin/env node
/*
 * 思达启航学校资料包：把 G 盘里各学校的原始资料（PDF、Word、Excel、PPT、压缩包里的文档、价目/通知类图片）
 * 转成文字，按 国家/城市/学校 整理成“百问百答”机器人用的知识库。原始文件只读，不改动。
 *
 *   node tools/school-knowledge-pack/build-pack.cjs            # 处理并生成资料包
 *   node tools/school-knowledge-pack/build-pack.cjs --dry-run  # 只统计，不转换
 *
 * 规则（用户决定，2026-11-24）：
 * - 收所有国家的学校资料；学生材料、合同、发票、账号、佣金/代理价一律不放。
 * - 资料日期在 2025 年及以后的放“当前资料”给机器人用；更早的、或同名文件已有更新版本的放“旧资料”，不上传。
 * - 去掉学校的电话、邮箱、网址、社交账号和地址：学生只能通过思达启航报名。
 * 转换结果按文件内容缓存在输出目录的“_处理缓存”里，新增资料后再运行只处理新文件。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync, execFileSync } = require('child_process');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
// 测试用：只处理路径里含这段文字的文件，例如 --only "\\宿务\\CIA\\"。
const ONLY = valueOf('--only');
const OUT = path.resolve(valueOf('--out') || 'G:\\思达启航学校资料包');
const CURRENT_FROM_YEAR = 2025;
const TOOLS = __dirname;
const PDFTOTEXT = valueOf('--pdftotext') || 'C:\\Program Files\\Git\\ucrt64\\bin\\pdftotext.exe';
const CACHE = path.join(OUT, '_处理缓存（不用上传）');
const TEXT_CACHE = path.join(CACHE, 'text');
const ZIP_CACHE = path.join(CACHE, 'zip');

function valueOf(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : null;
}

// ---------- 资料从哪里来 ----------

const PH = '菲律宾';
const ROOTS = [
  { dir: 'G:\\菲律宾游学\\各地区学校', kind: 'regions' },
  { dir: 'G:\\菲律宾游学\\宿务', kind: 'schools', country: PH, city: '宿务' },
  { dir: 'G:\\菲律宾游学\\碧瑶', kind: 'schools', country: PH, city: '碧瑶' },
  { dir: 'G:\\英国游学', kind: 'schools', country: '英国' },
  { dir: 'G:\\爱尔兰学校', kind: 'schools', country: '爱尔兰' },
  { dir: 'G:\\马来西亚学校', kind: 'schools', country: '马来西亚' },
  { dir: 'G:\\新加坡', kind: 'schools', country: '新加坡' },
  { dir: 'G:\\泰国', kind: 'schools', country: '泰国' },
  { dir: 'G:\\美国', kind: 'schools', country: '美国' },
  { dir: 'G:\\加拿大', kind: 'schools', country: '加拿大' },
  ...latestRoots(),
];

// 资料包文件夹里的“学校最新资料（2026-11）”：学校最新发来的资料包，按“城市+学校”分文件夹（如“宿务CG”）。
// 这里的文件都比 G 盘其他地方的旧副本新，所以同名资料以这里为准。
function latestRoots() {
  let names = [];
  try {
    names = fs.readdirSync(OUT, { withFileTypes: true }).filter(e => e.isDirectory() && e.name.startsWith('学校最新资料')).map(e => e.name);
  } catch {
    return [];
  }
  return names.map(name => {
    const dir = path.join(OUT, name);
    const time = new Date(fs.statSync(dir).mtimeMs);
    const received = time.getFullYear() * 10000 + (time.getMonth() + 1) * 100 + time.getDate();
    return { dir, kind: 'schools', country: PH, dateSegment: name, received };
  });
}
// “各地区学校”下的地区文件夹；没列出的（国内、快酷线上、价格）不是海外学校资料，不收。
const REGIONS = {
  宿务: { country: PH, city: '宿务' },
  碧瑶: { country: PH, city: '碧瑶' },
  克拉克: { country: PH, city: '克拉克' },
  马尼拉: { country: PH, city: '马尼拉' },
  巴科洛德: { country: PH, city: '巴科洛德' },
  薄荷岛: { country: PH, city: '薄荷岛' },
  长滩岛: { country: PH, city: '长滩岛' },
  ILOILO: { country: PH, city: '怡朗' },
  斐济: { country: '斐济' },
  泰国: { country: '泰国' },
};
const PH_CITIES = new Set(['宿务', '碧瑶', '克拉克', '马尼拉', '巴科洛德', '薄荷岛', '长滩岛', '怡朗']);
// 其他国家按城市分了文件夹的地方。
const OTHER_CITIES = {
  泰国: new Set(['曼谷', '清迈']),
};
// 只是把几所学校装在一起的外层文件夹（爱尔兰的学校不按城市分，同一所学校只出一个文件）。
const CONTAINER_DIRS = {
  爱尔兰: new Set(['爱尔兰学校', '都柏林', '科克']),
};

// 同一所学校在不同文件夹里的叫法（键为去空格的大写形式）。
const SCHOOL_ALIASES = {
  'IU和ICL': 'IU和ICL',
  'QQ2024-9-23': 'QQ English',
  QQENGLISH: 'QQ English',
  QQ: 'QQ English',
  WINING: 'Winning',
  PHILINTER照片: 'PHILINTER',
  PHILINTER: 'PHILINTER',
  'HELP克拉克学校图片': 'HELP',
  HELP3大校区照片: 'HELP',
  CNS1: 'CNS',
  CNS2: 'CNS',
  克拉克WEACADEMY: 'WE Academy',
  WEACADEMY: 'WE Academy',
  WE: 'WE Academy',
  宿务美国ETHOS: 'ETHOS',
  HANAACADEMY: 'HANA Academy',
  CELLA: 'CELLA',
  IBREEZE: 'I.BREEZE',
  EV资料: 'EV',
  '3DACADEMY资料': '3D Academy',
  FIRSTENGLISH: 'First English',
  BLUEOCEAN: 'Cebu Blue Ocean',
  STGILES: 'St Giles',
  ANJ: 'A&J',
  AJ: 'A&J',
  蓝海CBOA: 'Cebu Blue Ocean',
  CBOA: 'Cebu Blue Ocean',
  蓝海: 'Cebu Blue Ocean',
  ERIN: 'ERIN',
  SEDA: 'SEDA',
  曼谷IH: 'IH',
  清迈IH: 'IH',
  IH曼谷: 'IH',
  UCC: 'UCC 科克大学',
  利莫瑞克: '利莫瑞克大学',
};

// 这些文件夹是学生个人资料、合同、账号或签证个案，整个跳过。
const SKIP_DIR = /已报名|报名记录|报名$|留学申请材料|_files$|成绩|打码|score\s*report|学生材料|学生资料|签证|简历|账号|账户|帐号|帐户|密码|合同|协议|发票|代理加盟|二级代理|发代理|内部资料|不对外|营业执照|business\s*permit|中介须知|代理须知|商业许可|许可证|for\s*agents?\b|\$RECYCLE|System Volume/i;
// 两三个汉字的文件夹名多半是学生姓名；下面这些是地名或常用分类名，不算。
const NOT_A_PERSON = new Set(['宿务', '碧瑶', '克拉克', '马尼拉', '怡朗', '巴科洛德', '薄荷岛', '长滩岛', '科克', '都柏林', '伦敦', '曼谷', '清迈', '沙巴', '报价', '报价单', '价格', '国内', '照片', '图片', '视频', '资料', '课程', '宿舍', '住宿', '活动', '通知', '优惠', '国际学校', '爱尔兰学校', '格里菲斯', '唐道克理工', '冬令营', '夏令营', '亲子营', '青少年', '故事', '杂图', '海报', '宣传', '介绍', '课表', '日历', '假期', '价目表', '学杂费', '新生', '其他', '旧版', '新版', '中文', '英文', '韩文', '日文']);
// 文件名表明是合同、发票、申请表、个人材料或佣金的，不放。
const SKIP_FILE = /报价单|合同|协议|agreement|agreemet|contract|invoice|发票|收据|receipt|报名表|申请表|application\s*form|enquiry\s*form|登记表|护照|passport|名单|账号|账户|密码|bank|佣金|commission|代理加盟|代理信息|简历|\bCV\b|材料清单|个人资料|在职证明|资料表|offer\s*letter|\bLOA\b|\bCOE\b|confirmation\s*letter|visa\s*letter|成绩单|transcript|联系方式|勿传|中介|代理|思达信息|思达启航文化|双签|盖章|会议记录|资料清单|模板|template|帐号|帐户|汇款|未支付|支付明细|\bIOU\b|resume|payroll|salary|工资|薪资|agen(cy|ts?)[\W_]*(handbook|manual|information|info|pack|presentation|guide|webinar)|\bBDO\b|\bBPI\b|metrobank|\bswift\b|\biban\b|折扣指南|discount[\W_]*guidelines?|applicaion|teacher[\W_]*bio|学校分析|简单分析|internal|营业执照|business[\W_]*permit|mayor'?s[\W_]*permit|agency[\W_]*visit|visa[\W_]*email|photo[\W_]*(&|and)?[\W_]*(video[\W_]*)?links?|photolinks?/i;
// 学校给其他国家和地区学生的价目表（如“TW, TH, SAUDI, EU_TUITION FEE”）：价格和中国大陆学生不同。
const OTHER_MARKET_PRICE = /(^|[\W_])(tw|th|saudi|eu|jp|kr|vn)([\W_]|$).*(tuition|price|fee)/i;
// 我们自己给学生做的报价（不是学校资料）放在这些文件夹里。
const QUOTE_DIR = /^报价|报价单/;

const DOC_EXT = /\.(pdf|docx?|rtf|xlsx?|xlsm|pptx|txt|csv)$/i;
const IMAGE_EXT = /\.(jpe?g|png|webp|bmp|gif|tiff?)$/i;
const ZIP_EXT = /\.zip$/i;
// 图片只识别看起来是价目表、通知、海报、课表一类的；照片不识别。
const DOC_IMAGE_HINT = /价|price|fee|费|通知|notice|announce|公告|优惠|promo|活动|event|日历|calendar|holiday|假期|课程|course|schedule|课表|时间表|timetable|规定|rule|policy|介绍|brochure|海报|poster|学杂|local|签证|visa|月报|faq|问答|orientation|guide|指南|说明|折扣|discount|surcharge|附加|旺季|淡季|夏令营|冬令营|camp|报价|quotation|rate|tuition|学费|住宿费|dormitory\s*rule|宿舍规|须知|流程|process|退款|refund|入学|招生|菜单|menu|考试|exam|ielts|toeic|雅思|托业/i;
const PHOTO_DIR = /照片|图片|photo|picture|pic|相册|实拍|房间|room|宿舍|dorm|campus|校园|facility|facilities|设施|合照|参观|视频|video|food|餐/i;

// ---------- 内容检查 ----------

// 学校给代理的价钱和规定（机器人面对学生，这些不能给）。
// “Commission on Higher Education”“Securities and Exchange Commission”是菲律宾的政府机构，不算佣金。
const COMMISSION = String.raw`(?:(?<!(?:exchange|election|civil service)\s)commission(?:able|s)?(?!\s+(?:on|in|of|for)\s+(?:higher|high|technical|the|elections?))(?!\s+registration)|佣金)`;
// 有代理价、NET 价、佣金比例或佣金表格、代理折扣上限的：整份不放（删一行删不干净表格里的数字）。
const AGENCY_PRICE = new RegExp([
  String.raw`\bnet\s*(price|rate|fee|tuition)|\bnett?\s*(USD|US\$|\$)|代理价|代理费|代理折扣|底价|结算价|同行价|返佣|回扣|kickback`,
  String.raw`agent'?s?\s*(price|rate|discount|fee|incentive|nett?)|agency\s*(price|rate|discount|fee|incentive)|代理使用|for\s+agents?\s+only`,
  String.raw`最高折扣(调整|調整)?(为|為)[^\n]{0,8}\d+\s*[%％]|折扣(上限|规范|規範)|discount\s+guidelines?|discounts?\s+must\s+not\s+exceed`,
  // 佣金后面或前面不远处就是比例或金额：“佣金为28～25%”“20% 佣金”。
  String.raw`${COMMISSION}[^\n%]{0,30}?\d+(\.\d+)?\s*[%％]|\d+(\.\d+)?\s*[%％][^\n]{0,30}?${COMMISSION}|佣金[为是:：]?\s*\d`,
  // 我们同事记的学校要点（“3. 佣金：”“中介能给学生的优惠”）。
  String.raw`(^|\n)\s*\d+\s*[.、．]\s*(中介的)?佣金\s*[:：]|中介(是否)?(能|可以)给(到)?学生`,
  // 佣金是表格的一列：“周数   学费   佣金”。
  String.raw`\S {2,}\S*${COMMISSION}|${COMMISSION}\S* {2,}\S`,
].join('|'), 'i');
// 写给中介的话（称呼、提醒中介的句子、提到佣金的句子）：去掉这几行，正文（价格、日期、学校规定）留着。
const AGENCY_LINE = new RegExp([
  String.raw`中介|代理(?!人)|代办|代辦|合作伙伴|合作夥伴|合作代理|合作体系|合作關係|合作关系|报价单|報價單|报价汇率|报价体系|报价政策|价格竞争|低价竞争|压价`,
  COMMISSION,
  String.raw`\bagen(cy|cies|ts?)\b|\bpartner\s+(agenc|agents?)|\b(dear|all|our|valued)\s+(\w+\s+){0,2}partners?\b|\byour\s+(\w+\s+)?partners?\b`,
].join('|'), 'i');
// 一页（或一个工作表）里这么多行都是写给中介的，就整页不放。
const AGENCY_PAGE_RATIO = 0.25;
// 思达启航自己写的公众号文章和宣传稿：不是学校资料。
const OWN_ARTICLE_FILE = /公众号|推文/;
const OWN_ARTICLE_TEXT = /思达(启航)?顾问|联系思达|思达联系方式|思达启航联系方式/;
// 有具体学生个人信息的（发票、录取信、填好的表格）：整份不放。
const PERSONAL_TEXT = /invoice\s*(no|number|#)|student'?s?\s*name\s*[:：]\s*\S|学生姓名\s*[:：]\s*\S|passport\s*(no|number)\s*[:：]\s*\S|护照号码?\s*[:：]\s*\S|date\s*of\s*birth\s*[:：]\s*\d|出生日期\s*[:：]\s*\d/i;
// 学校的联系方式和地址：整行去掉。
const CONTACT_LINE = [
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/i,
  /https?:\/\/|www\./i,
  /\b[A-Za-z0-9-]+\.(com|net|org|ph|kr|jp|ie|edu|my|sg|th|ca|io|co)(\.[a-z]{2})?\b/,
  /(\+|＋)\s?\(?\d{1,3}\)?[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/,
  // 扫描件识别出来的号码中间常夹着“．”“一”和空格：+ 63 ． 919 ． 332 737
  /(\+|＋)\s*\d{1,3}\s*[\s.．·\-—一()]+\s*\d{2,4}\s*[\s.．·\-—一]+\s*\d{3}/,
  /\(0\d{1,3}\)\s?\d{3,4}[\s.-]?\d{3,4}/,
  /(?<![\d,.])0\d{2,4}[\s-]\d{3,4}[\s-]\d{3,4}(?![\d,])/,
  // 菲律宾手机号连写：09456675600
  /(?<!\d)(09|639)\d{9}(?!\d)/,
  // 社交账号和链接；只提到平台名（如 SNS 活动要发 Facebook）的不算。
  /kakao\s*(talk)?\s*(id)?\s*[:：]|whatsapp\s*[:：+]|line\s*id|wechat\s*id|微信号\s*[:：]|skype\s*[:：]|telegram\s*[:：@]|viber\s*[:：]|facebook\.com|fb\.com|instagram\.com|youtube\.com|tiktok\.com|(^|\s)@[A-Za-z0-9_.]{3,}/i,
  /(^|\s)(tel|phone|mobile|fax|hotline)\s*[:：.]/i,
  /(电话|手机|传真|热线|联系方式)\s*[:：]/,
  /(^|\s)(address|add\.)\s*[:：/]/i,
  /地址\s*([:：/]|$)/,
  /\b(street|avenue|ave\.|highway|barangay|brgy\.?|purok|siti[o0])\b.*\b(city|cebu|philippines|manila|baguio|clark|iloilo|bacolod|pampanga|\d{4})\b/i,
  // 门牌那一行和城市那一行常被分开：“CIA Building, Vistamar Avenue, Sitio Dap-dap, Barangay”“Cebu Philippines 6015”
  /^(?=.*\b(avenue|street|road|highway|ave\.?|st\.)\b)(?=.*\b(siti[o0]|barangay|brgy|purok|bui[lI1]ding|bldg|subdivision|village)\b)/i,
  /phi[lI1]{1,2}ipp?ines\s*[,，]?\s*\d{4}\b/i,
  // 学校的公众号、视频号等（学生只能通过思达启航联系学校）。
  /公众号|视频号|小红书号|抖音号|官方微信|客服微信|扫码关注|扫码进入|微信扫码/,
  /\b(wechat|weixin|kakao(talk)?|whatsapp|facebook|instagram|youtube|tiktok|twitter|weibo)\s*[:：@]|(微信|微博|小红书|抖音)\s*[:：@]/i,
  // 二维码旁边只剩平台名的一行：“(WeChat)”。
  /^\s*[(（]?\s*(wechat|微信|whatsapp|line|kakao(talk)?|facebook|instagram)\s*[)）]?\s*$/i,
  // 一行短短地列出几个社交账号：“在校学生服务 LINE 台湾版 Facebook 台湾版 Instagram”。
  { test: line => line.length <= 60 && !/[。！？]/.test(line) && (line.match(/LINE|Facebook|Instagram|YouTube|TikTok|Kakao|WeChat|微信|微博|小红书|抖音/gi) || []).length >= 2 },
  // 其他写法的电话：0044 1244 577995、032.384.4755、0995.950.3848、63-917-717-5509、1-800-663-1441、单独一行的手机号。
  /(?<![\d,.])00\s?[1-9]\d{0,2}[\s.-]\d{2,5}[\s.-]\d{3,7}(?!\d|[,.]\d)/,
  /(?<![\d,.-])\d{3}-\d{3}-\d{4}(?![\d-])/,
  /(^|\s)telephone\s*[:：.]/i,
  /(?<![\d,.])0\d{2,3}\.\d{3}\.\d{4}(?![\d.])/,
  /(?<![\d,.])63[\s.-]\d{2,3}[\s.-]\d{3}[\s.-]\d{4}(?![\d,.])/,
  /\b1-8\d\d-\d{3}-\d{4}\b/,
  /^\D{0,20}(?<!\d)1[3-9]\d[\s-]?\d{4}[\s-]?\d{4}(?!\d)\D{0,20}$/,
  // 银行账户：学费都经思达启航付，不给学校的收款账户。
  /\b(IBAN|SWIFT|BIC|sort\s*code|account\s*(no|number|name)|beneficiary|routing\s*number|bank\s*(name|account|details|code|address))\b|开户(行|名)|收款(人|账号|帐号)|银行(账号|帐号)|銀行帳號/i,
  /\b[A-Z]{2}\d{2}(\s?\d{4}){3,}/,
];

// ---------- 工具函数 ----------

function log(...parts) {
  console.log(new Date().toISOString().slice(11, 19), ...parts);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// A removable or sleeping drive sometimes fails one read (Windows error UNKNOWN); try again before giving up.
function readTextWithRetry(file) {
  if (!fs.existsSync(file)) return '';
  for (let attempt = 1; ; attempt++) {
    try {
      return fs.readFileSync(file, 'utf8');
    } catch (error) {
      if (attempt >= 4) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2000 * attempt);
    }
  }
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeUtf8(file, text) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, text, 'utf8');
}

function normKey(text) {
  return text.replace(/\s+/g, '').toUpperCase();
}

const SURNAMES = '\u738b\u674e\u5f20\u5218\u9648\u6768\u9ec4\u8d75\u5434\u5468\u5f90\u5b59\u9a6c\u6731\u80e1\u90ed\u4f55\u9ad8\u6797\u7f57\u90d1\u6881\u8c22\u5b8b\u5510\u8bb8\u97e9\u51af\u9093\u66f9\u5f6d\u66fe\u8096\u7530\u8463\u8881\u6f58\u4e8e\u848b\u8521\u4f59\u675c\u53f6\u7a0b\u82cf\u9b4f\u5415\u4e01\u4efb\u6c88\u59da\u5362\u59dc\u5d14\u949f\u8c2d\u9646\u6c6a\u8303\u91d1\u77f3\u5ed6\u8d3e\u590f\u97e6\u4ed8\u65b9\u767d\u90b9\u5b5f\u718a\u79e6\u90b1\u6c5f\u5c39\u859b\u95eb\u6bb5\u96f7\u4faf\u9f99\u53f2\u9676\u9ece\u8d3a\u987e\u6bdb\u90dd\u9f9a\u90b5\u4e07\u94b1\u4e25\u8983\u6b66\u6234\u83ab\u5b54\u5411\u6c64\u5e38\u6e29\u5eb7\u65bd\u6587\u725b\u6a0a\u845b\u90a2\u5b89\u9f50\u6613\u4e54\u4f0d\u5e9e\u989c\u502a\u5e84\u8042\u7ae0\u9c81\u5cb3\u7fdf\u6bb7\u8a79\u7533\u6b27\u803f\u5173\u5170\u7126\u4fde\u5de6\u67f3\u7518\u795d\u5305\u5b81\u5c1a\u7b26\u8212\u962e\u67ef\u7eaa\u6885\u7ae5\u51cc\u6bd5\u5355\u5b63\u88f4\u970d\u6d82\u6210\u82d7\u8c37\u76db\u66f2\u7fc1\u5189\u9a86\u84dd\u8def\u6e38\u8f9b\u9773\u7ba1\u67f4\u8499\u9c8d\u534e\u55bb\u7941\u84b2\u623f\u6ed5\u5c48\u9976\u89e3\u725f\u827e\u5c24\u9633\u65f6\u7a46\u519c\u53f8\u5353\u53e4\u5409\u7f2a\u7b80\u8f66\u9879\u8fde\u82a6\u9ea6\u891a\u5a04\u7aa6\u621a\u5c91\u666f\u515a\u5bab\u8d39\u535c\u51b7\u664f\u5e2d\u536b\u7c73\u67cf\u5b97\u77bf\u6842\u5168\u4f5f\u5e94\u81e7\u95f5\u82df\u90ac\u8fb9\u535e\u59ec\u5e08\u548c\u4ec7\u683e\u968b\u5546\u5201\u6c99\u8363\u5deb\u5bc7\u6851\u90ce\u7504\u4e1b\u4ef2\u865e\u6556\u5de9\u660e\u4f58\u6c60\u67e5\u9ebb\u82d1\u8fdf\u909d';

// 以常见姓氏开头的两三个汉字文件夹名，多半是学生姓名。
// 人名里几乎不会出现的字（“单人间”“游泳池”“文件”“房间”这类分类文件夹不是人名）。
// 常见姓氏（周、程、景…）不在里面；拿不准时宁可当人名跳过。
const THING_CHARS = /[间池件房室馆厅楼课费表图片频料营校班报价泳舍餐堂场版册证夹视宿厕浴桌床]/;

function isPersonFolder(name) {
  return /^[\u4e00-\u9fff]{2,3}$/.test(name) && SURNAMES.includes(name[0]) && !NOT_A_PERSON.has(name) && !THING_CHARS.test(name.slice(1));
}

function schoolName(raw, city) {
  let name = raw.trim();
  if (city && name.startsWith(city) && name.length > city.length) name = name.slice(city.length).trim();
  const alias = SCHOOL_ALIASES[normKey(name)];
  if (alias) return alias;
  // “3D Academy资料”“Burlington可寄宿学校”“Avanti都柏林外”：取前面的英文校名。
  const latin = /^([A-Za-z0-9&.'][A-Za-z0-9&.' +-]*[A-Za-z0-9.])\s*[\u4e00-\u9fff（(]/.exec(name);
  if (latin && latin[1].length >= 2) return SCHOOL_ALIASES[normKey(latin[1])] || latin[1];
  return name;
}

// 从路径里找资料日期（文件名或文件夹名里的日期）；找不到用文件修改日期。
// 离文件最近的日期最准：文件名里的日期优先，其次是最近一层带日期的文件夹。
// 外层“2026-11-19”这类往往只是下载日期，所以不取整条路径里最新的日期；还没到的日期不算。
const NOW = new Date();
const TODAY_KEY = NOW.getFullYear() * 10000 + (NOW.getMonth() + 1) * 100 + NOW.getDate();

function datesIn(segment) {
  const text = segment.replace(/T\d{6}Z/g, '');
  const full = [];
  for (const match of text.matchAll(/(?<!\d)(20[12]\d)[-_.年/]?(\d{1,2})[-_.月/]?(\d{1,2})(?!\d)/g)) {
    const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
    const key = y * 10000 + m * 100 + d;
    if (y >= 2010 && m >= 1 && m <= 12 && d >= 1 && d <= 31 && key <= TODAY_KEY) full.push({ y, m, d, key });
  }
  const years = [];
  for (const match of text.matchAll(/(?<!\d)(20[12]\d)(?!\d)/g)) {
    const y = Number(match[1]);
    if (y >= 2010 && y <= NOW.getFullYear() + 1) years.push(y);
  }
  return { full: full.sort((a, b) => b.key - a.key)[0], year: years.sort((a, b) => b - a)[0] };
}

function findDate(segments, mtime) {
  const own = datesIn(segments[segments.length - 1] || '');
  const received = Math.max(0, ...segments.map(segment => (datesIn(segment).full || { key: 0 }).key));
  const result = findLabelDate(segments, own, mtime);
  result.received = Math.max(received, result.sort);
  return result;
}

function findLabelDate(segments, own, mtime) {
  const fullLabel = f => `${f.y}-${String(f.m).padStart(2, '0')}-${String(f.d).padStart(2, '0')}`;
  let folderFull = null;
  let folderYear = null;
  for (let i = segments.length - 2; i >= 0 && !(folderFull && folderYear); i -= 1) {
    const found = datesIn(segments[i]);
    if (!folderFull && found.full) folderFull = found.full;
    if (!folderYear && found.year) folderYear = found.year;
  }
  if (own.full) return { year: own.full.y, sort: own.full.key, label: fullLabel(own.full), from: 'path' };
  if (own.year) {
    // 文件名只写了年份（“CIA2027年假期日历”）：同一年的文件夹日期更精确，否则用这个年份。
    if (folderFull && folderFull.y === own.year) return { year: own.year, sort: folderFull.key, label: fullLabel(folderFull), from: 'path' };
    return { year: own.year, sort: own.year * 10000, label: `${own.year}年`, from: 'path' };
  }
  if (folderFull) return { year: folderFull.y, sort: folderFull.key, label: fullLabel(folderFull), from: 'path' };
  if (folderYear) return { year: folderYear, sort: folderYear * 10000, label: `${folderYear}年`, from: 'path' };
  const date = new Date(mtime);
  const y = date.getFullYear();
  return { year: y, sort: y * 10000 + (date.getMonth() + 1) * 100 + date.getDate(), label: `${date.toISOString().slice(0, 10)}（文件日期）`, from: 'mtime' };
}

// 同一份资料的不同版本：去掉日期、版本号、“副本”等后比较文件名。
function versionKey(fileName) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/t\d{6}z/g, '')
    .replace(/20[12]\d[-_.年/]?\d{1,2}[-_.月/]?\d{1,2}|20[12]\d|\d{6,8}/g, '')
    .replace(/[（(]\s*\d+\s*[)）]|副本|copy|final|updated|update|最新|新版|修改版|revised|v\d+(\.\d+)?/g, '')
    .replace(/[\s_\-.,，、()（）[\]【】]+/g, '');
}

const EXT_RANK = { pdf: 0, docx: 1, doc: 2, xlsx: 3, xls: 4, xlsm: 4, pptx: 5, rtf: 6, txt: 7, csv: 8 };

function cleanText(text) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[\u00a0\u3000]/g, ' ')
    // OCR 的中文引擎在汉字之间加空格。
    .replace(/([\u4e00-\u9fff\uff00-\uffef\u3000-\u303f]) (?=[\u4e00-\u9fff\uff00-\uffef\u3000-\u303f])/g, '$1')
    .replace(/[ \t]{3,}/g, '   ')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function meaningfulChars(text) {
  return (text.match(/[\u4e00-\u9fff\uac00-\ud7af\u3040-\u30ffA-Za-z0-9]/g) || []).length;
}

function scrubContacts(text) {
  let removed = 0;
  const lines = text.split('\n').filter(line => {
    if (CONTACT_LINE.some(pattern => pattern.test(line))) {
      removed += 1;
      return false;
    }
    return true;
  });
  return { text: lines.join('\n'), removed };
}

// 去掉写给中介的话：大部分是写给中介的页整页去掉，其余只去掉那几行（连同断到下一行的半句）。
// 返回 null 表示整份都是写给中介的。
function stripAgency(text) {
  const sections = [];
  let current = [];
  for (const line of text.split('\n')) {
    if (/^(--- .+ ---|## Sheet: .+)$/.test(line) && current.length) {
      sections.push(current);
      current = [];
    }
    current.push(line);
  }
  sections.push(current);
  let removedLines = 0;
  let removedPages = 0;
  const kept = [];
  for (const lines of sections) {
    const body = lines.filter(line => line.trim() && !/^(--- .+ ---|## Sheet: .+)$/.test(line));
    const hits = body.filter(line => AGENCY_LINE.test(line)).length;
    if (body.length && hits >= 2 && hits / body.length >= AGENCY_PAGE_RATIO) {
      removedPages += 1;
      continue;
    }
    const out = [];
    for (let i = 0; i < lines.length; i += 1) {
      if (!AGENCY_LINE.test(lines[i])) {
        out.push(lines[i]);
        continue;
      }
      removedLines += 1;
      // PDF 里一句话常断成几行：这一行是排满的长句、没写完（没有句号），下一行又不是新的一条时，下一行也是同一句。
      let line = lines[i];
      let extra = 0;
      while (extra < 3 && continuesOnNextLine(line, lines[i + 1])) {
        i += 1;
        extra += 1;
        line = lines[i];
        removedLines += 1;
      }
    }
    kept.push(out.join('\n'));
  }
  if (removedPages === sections.length) return null;
  return { text: kept.join('\n'), removedLines, removedPages };
}

function continuesOnNextLine(line, next) {
  if (next === undefined || !next.trim() || /^(--- .+ ---|## Sheet: .+)$/.test(next)) return false;
  if (/[。！？!?.；;:：)）」"]\s*$/.test(line)) return false;
  // 下一行是新的一条：“D-12”“E ”“4.”“二、”“⚫”“* ”。
  if (/^\s*([-*•·⚫●○◆■□✓✔※]|[A-Z](-?\d+)?\s|\d+\s*[.)、．]|[一二三四五六七八九十]+、|[（(]\d+[)）])/.test(next)) return false;
  const cjk = (line.match(/[一-鿿]/g) || []).length;
  if (cjk >= 25) return true;
  // 英文：下一行以小写字母开头才是同一句。
  return cjk === 0 && line.trim().length >= 50 && /^\s*[a-z]/.test(next);
}

// 品牌全称和中国台湾的写法（机器人可能原样引用资料里的话）。
function normalizeWording(text) {
  const out = text
    // 扫描件和 PDF 里残留的控制字符会让平台把文件当成二进制。
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/思达游学/g, '思达启航')
    .replace(/思达(?!启航)/g, '思达启航')
    .replace(/台灣/g, '台湾');
  return out.split('\n').map(line => {
    let l = line;
    // 标题和原文件名里的“中介手册”“代辦”（学校给中介的那一版）不用让机器人说出来。
    if (/^(- 原文件：|#{2,3} 【)/.test(l)) l = l.replace(/中介手册|代理手册/g, '学校资料').replace(/[_\s-]*代(辦|办)(?=\d|\s|$|[_.])/g, '');
    if (!/台湾|Taiwan/i.test(l)) return l;
    if (/台湾/.test(l)) {
      l = l
        .replace(/多国国籍/g, '多个国家和地区')
        .replace(/(?<!中国)台湾籍/g, '中国台湾地区')
        .replace(/(?<!中国)台湾/g, '中国台湾')
        .replace(/中国(?!台湾|大陆|香港|澳门|驻|政府|大使馆|领事馆)/g, '中国大陆')
        .replace(/(?<!中国)(香港|澳门)/g, '中国$1')
        .replace(/国籍/g, '国家和地区')
        .replace(/等国家(?!和地区)/g, '等国家和地区');
    }
    if (/\bTaiwan\b/i.test(l) && !/Taiwan,?\s*China/i.test(l)) {
      l = l.replace(/\bChina\b(?!'s)/g, 'Chinese mainland').replace(/\bTaiwan\b(?!,?\s*China)/gi, "China's Taiwan");
    }
    return l;
  }).join('\n');
}

function runPowerShell(script, listLines, extraArgs = [], timeoutMinutes = 20) {
  const listFile = path.join(CACHE, `list-${process.pid}-${Date.now()}.tsv`);
  writeUtf8(listFile, listLines.join('\n'));
  const result = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(TOOLS, script), '-ListFile', listFile, ...extraArgs], {
    encoding: 'utf8',
    timeout: timeoutMinutes * 60 * 1000,
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  });
  fs.rmSync(listFile, { force: true });
  const status = new Map();
  for (const line of (result.stdout || '').split(/\r?\n/)) {
    const [state, source, detail] = line.split('\t');
    if (source) status.set(source, { state, detail });
  }
  status.timedOut = Boolean(result.error || result.signal);
  return status;
}

// Word or Excel can hang on one bad file. Close only the hidden copies this script started
// (started for automation, "-Embedding"), never Word or Excel windows the user has open.
function killOffice() {
  const command = "Get-CimInstance Win32_Process | Where-Object { $_.Name -in 'WINWORD.EXE','EXCEL.EXE' -and $_.CommandLine -match 'Embedding|Automation' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }";
  spawnSync('powershell.exe', ['-NoProfile', '-Command', command], { windowsHide: true });
}

function sha1(file) {
  const hash = crypto.createHash('sha1');
  const fd = fs.openSync(file, 'r');
  const buffer = Buffer.alloc(1024 * 1024);
  try {
    let read;
    while ((read = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) hash.update(buffer.subarray(0, read));
  } finally {
    fs.closeSync(fd);
  }
  return hash.digest('hex');
}

// ---------- 第一步：找文件 ----------

function collect() {
  const items = [];
  const skipped = [];
  for (const root of ROOTS) {
    if (!fs.existsSync(root.dir)) continue;
    walk(root, root.dir, []);
  }
  return { items, skipped };

  function contextOf(root, dirs) {
    let country = root.country;
    let city = root.city || '';
    let rest = dirs;
    if (root.kind === 'regions') {
      const region = REGIONS[dirs[0]];
      if (!region) return null;
      country = region.country;
      city = region.city || '';
      rest = dirs.slice(1);
    }
    // “爱尔兰学校\爱尔兰学校\UCC”这类只是装学校的外层文件夹，跳过这一层。
    const containers = CONTAINER_DIRS[country];
    while (rest.length && containers && containers.has(rest[0])) rest = rest.slice(1);
    const cities = country === PH ? PH_CITIES : OTHER_CITIES[country];
    if (rest.length && cities && cities.has(rest[0])) {
      city = rest[0];
      rest = rest.slice(1);
    } else if (rest.length && cities) {
      // “宿务CG”：城市和学校写在同一个文件夹名里（schoolName 会去掉城市）。
      const prefix = [...cities].find(c => rest[0].startsWith(c) && rest[0].length > c.length);
      if (prefix) city = prefix;
    }
    const school = rest.length ? schoolName(rest[0], city) : '综合资料';
    return { country, city, school, inner: rest.slice(1) };
  }

  function walk(root, dir, dirs) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIR.test(entry.name)) {
          skipped.push({ path: full, reason: '学生个人、合同、账号或签证个案文件夹' });
          continue;
        }
        if (QUOTE_DIR.test(entry.name)) {
          skipped.push({ path: full, reason: '思达启航给学生做的报价，不是学校资料' });
          continue;
        }
        if (isPersonFolder(entry.name)) {
          skipped.push({ path: full, reason: '疑似学生个人文件夹（以姓名命名）' });
          continue;
        }
        if (root.kind === 'regions' && dirs.length === 0 && !REGIONS[entry.name]) {
          skipped.push({ path: full, reason: '不是海外学校资料（国内、线上课程或报价单）' });
          continue;
        }
        walk(root, full, [...dirs, entry.name]);
        continue;
      }
      // ~$ 是 Office 临时文件，._ 是苹果电脑留下的隐藏文件，都不是资料。
      if (entry.name.startsWith('~$') || entry.name.startsWith('._')) continue;
      if (ONLY && !full.includes(ONLY)) continue;
      const isDoc = DOC_EXT.test(entry.name);
      const isZip = ZIP_EXT.test(entry.name);
      const isImage = IMAGE_EXT.test(entry.name);
      if (!isDoc && !isZip && !isImage) continue;
      const context = contextOf(root, dirs);
      if (!context) continue;
      if (isImage) {
        const parent = dirs[dirs.length - 1] || '';
        if (!DOC_IMAGE_HINT.test(entry.name) && !(DOC_IMAGE_HINT.test(parent) && !PHOTO_DIR.test(parent))) continue;
      }
      if (OWN_ARTICLE_FILE.test(entry.name)) {
        skipped.push({ path: full, reason: '思达启航自己写的公众号文章，不是学校资料' });
        continue;
      }
      if (SKIP_FILE.test(entry.name)) {
        skipped.push({ path: full, reason: '合同、发票、申请表、个人材料或佣金文件' });
        continue;
      }
      if (OTHER_MARKET_PRICE.test(entry.name)) {
        skipped.push({ path: full, reason: '学校给其他国家和地区学生的价目表，不是中国大陆学生的价格' });
        continue;
      }
      // 同一文件夹里已有原文件时，旁边的 .txt 只是别人提取的文字（“06.txt”对应“06-price-list-2027.pdf”）。
      const base = entry.name.replace(/\.[^.]+$/, '').toLowerCase();
      if (/\.txt$/i.test(entry.name) && entries.some(other => other.isFile() && !/\.txt$/i.test(other.name) && DOC_EXT.test(other.name) && other.name.toLowerCase().startsWith(base))) {
        skipped.push({ path: full, reason: '从旁边的原文件提取的文字，已用原文件' });
        continue;
      }
      // 同一份资料有简体（CN）和繁体（TW）两版时只放简体版。
      const twMark = /(^|[\W_])TW([\W_]|$)/;
      if (twMark.test(entry.name)) {
        const cnName = entry.name.replace(/(^|[\W_])TW([\W_]|$)/, '$1CN$2');
        const reason = entries.some(other => other.name === cnName) ? '已有简体版，繁体版不重复放' : '学校给中国台湾学生的版本，价格和政策可能和中国大陆学生不同';
        skipped.push({ path: full, reason });
        continue;
      }
      let stat;
      try {
        stat = fs.statSync(full);
      } catch {
        continue;
      }
      if (stat.size === 0) continue;
      items.push({
        path: full,
        name: entry.name,
        kind: isZip ? 'zip' : isImage ? 'image' : 'doc',
        size: stat.size,
        mtime: stat.mtimeMs,
        ...context,
        segments: [...(root.dateSegment ? [root.dateSegment] : []), ...dirs, entry.name],
        receivedFloor: root.received || 0,
      });
    }
  }
}

// ---------- 第二步：压缩包里的文档 ----------

function expandZips(items, skipped) {
  const zips = items.filter(item => item.kind === 'zip');
  const pending = [];
  for (const zip of zips) {
    const id = crypto.createHash('sha1').update(`${zip.path}|${zip.size}|${zip.mtime}`).digest('hex').slice(0, 16);
    zip.cacheDir = path.join(ZIP_CACHE, id);
    const failed = path.join(zip.cacheDir, '.failed');
    if (fs.existsSync(failed)) skipped.push({ path: zip.path, reason: `压缩包打不开：${fs.readFileSync(failed, 'utf8').trim()}` });
    else if (!fs.existsSync(path.join(zip.cacheDir, '.done'))) pending.push(zip);
  }
  log(`压缩包 ${zips.length} 个，需要解开 ${pending.length} 个（只取文档）`);
  if (pending.length && !DRY_RUN) {
    const pattern = '\\.(pdf|docx?|rtf|xlsx?|xlsm|pptx|txt|csv)$';
    for (let i = 0; i < pending.length; i += 10) {
      const batch = pending.slice(i, i + 10);
      const status = runPowerShell('extract-zip-docs.ps1', batch.map(zip => `${zip.path}\t${zip.cacheDir}`), ['-Pattern', pattern]);
      for (const zip of batch) {
        const result = status.get(zip.path);
        if (!result || result.state !== 'OK') skipped.push({ path: zip.path, reason: `压缩包打不开：${result ? result.detail : '没有结果'}` });
      }
      log(`  已处理压缩包 ${Math.min(i + 10, pending.length)}/${pending.length}`);
    }
  }
  const inner = [];
  for (const zip of zips) {
    if (!fs.existsSync(zip.cacheDir)) continue;
    const zipLabel = zip.name.replace(/\.zip$/i, '');
    const stack = [[zip.cacheDir, []]];
    while (stack.length) {
      const [dir, rel] = stack.pop();
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (SKIP_DIR.test(entry.name) || isPersonFolder(entry.name)) continue;
          stack.push([full, [...rel, entry.name]]);
        } else if (DOC_EXT.test(entry.name) && !entry.name.startsWith('~$') && !entry.name.startsWith('._')) {
          if (SKIP_FILE.test(entry.name) || OWN_ARTICLE_FILE.test(entry.name)) {
            skipped.push({ path: `${zip.path} → ${[...rel, entry.name].join('/')}`, reason: OWN_ARTICLE_FILE.test(entry.name) ? '思达启航自己写的公众号文章，不是学校资料' : '合同、发票、申请表、个人材料或佣金文件' });
            continue;
          }
          const stat = fs.statSync(full);
          if (!stat.size) continue;
          inner.push({
            path: full,
            displayPath: `${zip.path} → ${[...rel, entry.name].join('/')}`,
            name: entry.name,
            kind: 'doc',
            size: stat.size,
            mtime: zip.mtime,
            country: zip.country,
            city: zip.city,
            school: zip.school,
            inner: [...zip.inner, zipLabel, ...rel],
            segments: [...zip.segments.slice(0, -1), zipLabel, ...rel, entry.name],
            receivedFloor: zip.receivedFloor || 0,
          });
        }
      }
    }
  }
  return [...items.filter(item => item.kind !== 'zip'), ...inner];
}

// ---------- 第三步：去重 ----------

function hashAll(items) {
  const indexFile = path.join(CACHE, 'hash-index.json');
  const index = readJson(indexFile, {});
  let done = 0;
  for (const item of items) {
    const key = `${item.path}|${item.size}|${item.mtime}`;
    if (!index[key]) index[key] = sha1(item.path);
    item.hash = index[key];
    done += 1;
    if (done % 200 === 0) {
      log(`  已核对 ${done}/${items.length} 个文件`);
      writeUtf8(indexFile, JSON.stringify(index));
    }
  }
  writeUtf8(indexFile, JSON.stringify(index));
}

// ---------- 第四步：转成文字 ----------

function textFile(hash) {
  return path.join(TEXT_CACHE, `${hash}.txt`);
}
function metaFile(hash) {
  return path.join(TEXT_CACHE, `${hash}.json`);
}

function extractAll(unique) {
  ensureDir(TEXT_CACHE);
  const todo = unique.filter(item => !fs.existsSync(metaFile(item.hash)));
  log(`需要转换 ${todo.length} 个文件（其余 ${unique.length - todo.length} 个已有缓存）`);
  const ocr = [];
  const office = [];
  let pdfDone = 0;
  for (const item of todo) {
    const ext = path.extname(item.name).toLowerCase();
    if (ext === '.pdf') {
      let text = '';
      try {
        text = execFileSync(PDFTOTEXT, ['-layout', '-enc', 'UTF-8', item.path, '-'], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, windowsHide: true, timeout: 180000 });
      } catch (error) {
        text = '';
      }
      const pages = Math.max(1, text.split('\f').length - (text.endsWith('\f') ? 1 : 0));
      if (meaningfulChars(text) / pages >= 60) {
        const paged = text.split('\f').map((page, i) => (page.trim() ? `--- page ${i + 1} ---\n${page}` : '')).filter(Boolean).join('\n\n');
        saveText(item, paged, 'PDF文字');
      } else {
        ocr.push(item);
      }
      pdfDone += 1;
      if (pdfDone % 100 === 0) log(`  PDF ${pdfDone} 个已读`);
    } else if (ext === '.txt' || ext === '.csv') {
      const buffer = fs.readFileSync(item.path);
      let text = buffer.toString('utf8');
      if (text.includes('\ufffd')) text = new TextDecoder('gbk').decode(buffer);
      saveText(item, text, '文本');
    } else if (IMAGE_EXT.test(item.name)) {
      ocr.push(item);
    } else {
      office.push(item);
    }
  }
  batch(office, 20, 'convert-office.ps1', 'Office转换', 1.5);
  // 扫描的 PDF 每页都要识别，给多一点时间。
  batch(ocr, 10, 'ocr.ps1', '文字识别', 4);
}

function batch(list, size, script, method, minutesPerFile) {
  if (!list.length) return;
  log(`${method}：${list.length} 个文件`);
  const queue = [...list];
  let done = 0;
  while (queue.length) {
    const group = queue.splice(0, size);
    // A batch that runs far longer than usual has hung on one file.
    const status = runPowerShell(script, group.map(item => `${item.path}\t${textFile(item.hash)}.raw`), [], Math.max(10, Math.ceil(group.length * minutesPerFile)));
    if (status.timedOut && script === 'convert-office.ps1') killOffice();
    let blamed = false;
    for (const item of group) {
      const raw = `${textFile(item.hash)}.raw`;
      const result = status.get(item.path);
      // The written text file is the real proof; the status line only explains failures.
      if ((!result || result.state === 'OK') && fs.existsSync(raw)) {
        saveText(item, readTextWithRetry(raw), method);
        done += 1;
      } else if (status.timedOut && !result && blamed) {
        // Files are handled in order, so only the first unfinished one hung; retry the rest.
        queue.push(item);
      } else {
        if (status.timedOut && !result) blamed = true;
        writeUtf8(metaFile(item.hash), JSON.stringify({ method, failed: result ? result.detail || result.state : status.timedOut ? '转换超时' : '没有结果' }));
        done += 1;
      }
      fs.rmSync(raw, { force: true });
    }
    log(`  ${method} ${done}/${list.length}`);
  }
}

function saveText(item, text, method) {
  const cleaned = cleanText(text);
  writeUtf8(textFile(item.hash), cleaned);
  writeUtf8(metaFile(item.hash), JSON.stringify({ method, chars: meaningfulChars(cleaned) }));
}

// ---------- 第五步：分类、写资料包 ----------

// 直接放在国家或城市文件夹里的文件，文件名里有同地区某所学校的名字时，归到那所学校。
function assignLooseFiles(items) {
  const schools = new Map();
  for (const item of items) {
    if (item.school === '综合资料') continue;
    const key = `${item.country}|${item.city}`;
    if (!schools.has(key)) schools.set(key, new Set());
    schools.get(key).add(item.school);
  }
  for (const item of items) {
    if (item.school !== '综合资料') continue;
    const name = normKey(item.name.replace(/\.[^.]+$/, ''));
    const candidates = [...(schools.get(`${item.country}|${item.city}`) || [])]
      .filter(school => {
        const key = normKey(school).replace(/[.\\^$*+?()[\]{}|]/g, '\\$&');
        // 短校名（IH、GS、C2）要前后都不是字母数字才算。
        return new RegExp(`(^|[^A-Z0-9])${key}($|[^A-Z0-9])`).test(name);
      })
      .sort((a, b) => b.length - a.length);
    if (candidates.length) item.school = candidates[0];
  }
}

function build(items, skipped) {
  // 内容完全相同的文件只留一份：留日期最新的那个位置。
  for (const item of items) {
    item.date = findDate(item.segments, item.mtime);
    if (item.receivedFloor) item.date.received = Math.max(item.date.received, item.receivedFloor);
  }
  const byHash = new Map();
  for (const item of items) {
    const list = byHash.get(item.hash) || [];
    list.push(item);
    byHash.set(item.hash, list);
  }
  const unique = [];
  const records = [];
  for (const list of byHash.values()) {
    list.sort((a, b) => b.date.received - a.date.received || b.date.sort - a.date.sort || (a.path.includes('各地区学校') ? -1 : 1));
    unique.push(list[0]);
    for (const dup of list.slice(1)) records.push(record(dup, '重复', `和 ${list[0].displayPath || list[0].path} 内容相同`));
  }
  if (DRY_RUN) return { unique, records };

  extractAll(unique);

  // 读出文字，做内容检查。
  const usable = [];
  for (const item of unique) {
    const meta = readJson(metaFile(item.hash), null);
    if (!meta || meta.failed) {
      records.push(record(item, '没有放入', `转换失败：${meta ? meta.failed : '未处理'}`));
      continue;
    }
    let text;
    try {
      text = readTextWithRetry(textFile(item.hash));
    } catch (error) {
      records.push(record(item, '没有放入', `缓存文字读不出来（${error.code || error.message}），下次运行再试`));
      continue;
    }
    const minimum = item.kind === 'image' ? 40 : 30;
    if (meaningfulChars(text) < minimum) {
      if (item.kind !== 'image') records.push(record(item, '没有放入', '没有可用的文字'));
      continue;
    }
    const agencyPrice = AGENCY_PRICE.exec(text);
    if (agencyPrice) {
      records.push(record(item, '没有放入', `含代理佣金、代理价或代理折扣规定（“${agencyPrice[0].replace(/\s+/g, ' ').slice(0, 30)}”），需要的话请人工删掉这部分后再放`));
      continue;
    }
    if (OWN_ARTICLE_TEXT.test(text)) {
      records.push(record(item, '没有放入', '思达启航自己写的文章，不是学校资料'));
      continue;
    }
    const personal = PERSONAL_TEXT.exec(text);
    if (personal) {
      records.push(record(item, '没有放入', `含学生个人信息（“${personal[0].slice(0, 20)}”）`));
      continue;
    }
    const agency = stripAgency(text);
    if (!agency || meaningfulChars(agency.text) < minimum) {
      records.push(record(item, '没有放入', '整份是学校写给中介的通知或规定'));
      continue;
    }
    item.method = meta.method;
    item.agencyNote = agency.removedLines || agency.removedPages
      ? `去掉写给中介的内容（${[agency.removedPages ? `${agency.removedPages} 页` : '', agency.removedLines ? `${agency.removedLines} 行` : ''].filter(Boolean).join('、')}）`
      : '';
    usable.push({ item, text: agency.text });
  }

  // 同一所学校的同名资料只把最新版本放进当前资料。
  const groups = new Map();
  for (const entry of usable) {
    const { item } = entry;
    const key = [item.country, item.city, item.school, versionKey(item.name)].join('|');
    const list = groups.get(key) || [];
    list.push(entry);
    groups.set(key, list);
  }
  const current = [];
  const old = [];
  for (const list of groups.values()) {
    // 新旧版本按收到资料的日期比（外层“2026-11-19”这类文件夹），再按资料本身的日期。
    list.sort((a, b) => b.item.date.received - a.item.date.received || b.item.date.sort - a.item.date.sort || (EXT_RANK[ext(a.item)] ?? 9) - (EXT_RANK[ext(b.item)] ?? 9));
    const newest = list[0];
    const sameBatch = list.filter(entry => entry.item.date.received === newest.item.date.received && entry.item.date.sort === newest.item.date.sort);
    // 同一批里同名的不同格式（如 PDF 和 PPT 各一份）只留一个；同一批里同名但内容不同的都留（如两个校区各一份价目表）。
    const kept = [];
    for (const entry of sameBatch) {
      const twin = kept.find(k => ext(k.item) !== ext(entry.item));
      if (twin) {
        records.push(record(entry.item, '重复', `同一份资料的另一种格式，已用 ${twin.item.name}`));
        continue;
      }
      kept.push(entry);
    }
    for (const entry of kept) (entry.item.date.year >= CURRENT_FROM_YEAR ? current : old).push(entry);
    for (const entry of list.filter(e => !sameBatch.includes(e))) {
      entry.reason = `有更新的版本（${newest.item.date.label} ${newest.item.name}）`;
      old.push(entry);
    }
  }

  writePack('当前资料', current, records);
  writePack('旧资料', old, records);
  return { unique, records, current, old };
}

function ext(item) {
  return path.extname(item.name).slice(1).toLowerCase();
}

function record(item, status, note, packFile = '') {
  return {
    status,
    country: item.country,
    city: item.city,
    school: item.school,
    date: item.date ? item.date.label : '',
    source: item.displayPath || item.path,
    packFile,
    note,
  };
}

function schoolLabel(item) {
  return item.city ? `${item.school}（${item.country} · ${item.city}）` : `${item.school}（${item.country}）`;
}

function safeName(name) {
  return name.replace(/[\\/:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim();
}

function writePack(folder, entries, records) {
  // 每次都从缓存重新生成，先清掉上次的结果（缓存和原始文件不动）。
  fs.rmSync(path.join(OUT, folder), { recursive: true, force: true });
  const bySchool = new Map();
  for (const entry of entries) {
    const key = [entry.item.country, entry.item.city, entry.item.school].join('|');
    const list = bySchool.get(key) || [];
    list.push(entry);
    bySchool.set(key, list);
  }
  for (const list of bySchool.values()) {
    list.sort((a, b) => b.item.date.sort - a.item.date.sort || a.item.name.localeCompare(b.item.name));
    const first = list[0].item;
    const relative = path.join(folder, first.country, ...(first.city ? [first.city] : []), `${safeName(first.school)}.md`);
    const school = first.school;
    const parts = [
      `# ${schoolLabel(first)} 学校资料${folder === '旧资料' ? '（旧资料）' : ''}`,
      '',
      `本文件汇集 ${school} 的学校原始资料，共 ${list.length} 份，按资料日期从新到旧排列。` +
        (folder === '旧资料' ? '这些是 2024 年及以前的资料或已有更新版本的资料，仅供内部查阅，价格和政策可能已经过时。' : '价格、优惠、空房和政策以思达启航顾问的最新确认为准。'),
      '',
    ];
    for (const { item, text, reason } of list) {
      const scrubbed = scrubContacts(text);
      const title = item.name.replace(/\.[^.]+$/, '');
      const where = [...item.inner, item.name].join(' / ');
      parts.push(`## 【${school}】${title}`, '');
      parts.push(`- 学校：${schoolLabel(item)}`);
      parts.push(`- 资料日期：${item.date.label}`);
      parts.push(`- 原文件：${where}`);
      if (item.method === '文字识别') parts.push('- 说明：这份是图片或扫描件，文字由电脑识别，个别字可能识别错。');
      if (reason) parts.push(`- 旧资料原因：${reason}`);
      parts.push('');
      // 每页加上学校名，机器人搜到中间某一页时也知道是哪所学校。
      parts.push(scrubbed.text.replace(/^--- page (\d+) ---$/gm, (match, n) => `### 【${school}】${title} · 第${n}页`));
      parts.push('');
      records.push(record(item, folder === '当前资料' ? '已放入当前资料' : '放入旧资料', [reason, item.agencyNote, scrubbed.removed ? `去掉学校联系方式 ${scrubbed.removed} 行` : '', item.method].filter(Boolean).join('；'), relative));
    }
    writeUtf8(path.join(OUT, relative), normalizeWording(parts.join('\n')));
  }
}

function csvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function writeIndex(records, skipped) {
  const order = { 已放入当前资料: 0, 放入旧资料: 1, 没有放入: 2, 重复: 3, 跳过: 4 };
  const rows = [...records, ...skipped.map(item => ({ status: '跳过', source: item.path, note: item.reason }))];
  rows.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9) || String(a.country).localeCompare(String(b.country)) || String(a.city).localeCompare(String(b.city)) || String(a.school).localeCompare(String(b.school)));
  const header = ['状态', '国家', '城市', '学校', '资料日期', '原文件', '资料包文件', '说明'];
  const lines = [header.map(csvCell).join(','), ...rows.map(row => [row.status, row.country, row.city, row.school, row.date, row.source, row.packFile, row.note].map(csvCell).join(','))];
  fs.writeFileSync(path.join(OUT, '资料目录.csv'), `\ufeff${lines.join('\r\n')}\r\n`, 'utf8');
  const count = status => rows.filter(row => row.status === status).length;
  return { current: count('已放入当前资料'), old: count('放入旧资料'), left: count('没有放入'), dup: count('重复'), skip: count('跳过') };
}

// ---------- 主流程 ----------

function main() {
  log(`输出到 ${OUT}${DRY_RUN ? '（只统计）' : ''}`);
  ensureDir(CACHE);
  log('查找文件…');
  const { items, skipped } = collect();
  log(`找到 文档 ${items.filter(i => i.kind === 'doc').length} 个、图片 ${items.filter(i => i.kind === 'image').length} 个、压缩包 ${items.filter(i => i.kind === 'zip').length} 个；跳过 ${skipped.length} 个文件或文件夹`);
  const all = expandZips(items, skipped);
  assignLooseFiles(all);
  if (DRY_RUN) {
    const bySchool = {};
    for (const item of all) {
      const key = `${item.country}/${item.city || '-'}/${item.school}`;
      bySchool[key] = (bySchool[key] || 0) + 1;
    }
    console.log(Object.entries(bySchool).sort().map(([k, v]) => `${k}: ${v}`).join('\n'));
    console.log('跳过：\n' + skipped.map(s => `${s.reason}｜${s.path}`).join('\n'));
    return;
  }
  log('核对重复文件…');
  hashAll(all);
  const result = build(all, skipped);
  const summary = writeIndex(result.records, skipped);
  fs.copyFileSync(path.join(TOOLS, '使用说明.md'), path.join(OUT, '使用说明.md'));
  log(`完成：当前资料 ${summary.current} 份，旧资料 ${summary.old} 份，没有放入 ${summary.left} 份，重复 ${summary.dup} 份，跳过 ${summary.skip} 项。`);
}

main();
