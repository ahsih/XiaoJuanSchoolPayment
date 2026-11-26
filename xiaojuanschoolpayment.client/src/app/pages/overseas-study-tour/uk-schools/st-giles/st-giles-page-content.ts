// St Giles International page text: the overview page and the five year-round UK campuses.
// Pure data only (no Angular, DOM, storage or regex lookbehind), so the mini program can reuse it.
// Never add the school's phone, email, social accounts, website or street address (user rule
// 2026-11-19); students enrol through Sida. Do not cite where information came from.
import { SIDA_CALLABLE_CONSULTANTS } from '../../../../components/sida-consultants';
import {
  ST_GILES_CAMPUSES,
  ST_GILES_CAMPUS_ORDER,
  ST_GILES_FAMILY_COMMON,
  ST_GILES_FEES,
  ST_GILES_JUNIOR_CENTRES,
  StGilesCampusId,
  StGilesJuniorCentre,
  stGilesCourseRate,
} from './st-giles-pricing';

export interface StGilesPhoto {
  src: string;
  category: string;
  title: string;
  description: string;
}

export interface StGilesSpecialCourse {
  name: string;
  text: string;
  price: string;
}

export interface StGilesCampusProfile {
  id: StGilesCampusId;
  name: string;
  nameEn: string;
  city: string;
  title: string;
  lead: string;
  tags: Array<{ icon: string; text: string }>;
  heroPhoto: string;
  stripPhotos: string[];
  cardText: string;
  facts: Array<{ label: string; value: string }>;
  nationalities: string;
  highlights: Array<{ icon: string; title: string; text: string }>;
  fit: { suitable: Array<{ title: string; text: string }>; lessSuitable: Array<{ title: string; text: string }> };
  gallery: StGilesPhoto[];
  specialCourses: StGilesSpecialCourse[];
  advisor: { heading: string; paragraphs: string[] };
  faq: Array<{ title: string; text: string }>;
}

const photo = (folder: string, name: string, category: string, title: string, description: string): StGilesPhoto =>
  ({ src: `/assets/st-giles/${folder}/${name}.jpg`, category, title, description });

const UK_CONSULTANT_NOTES: Record<string, string> = {
  Lemon: '还没定国家，想把英国和其他国家的费用、时间放在一起比较。',
  Perrin: '想把英国和菲律宾、东南亚的游学方案和预算放在一起比较。',
  Jenny: '英国、爱尔兰游学和留学规划，以后想在英国或爱尔兰继续读书。',
};

/** Lemon, Perrin and Jenny from the shared consultant list; pictures and phones come only from there. */
export const ST_GILES_CONSULTANTS = ['Lemon', 'Perrin', 'Jenny'].map(name => {
  const person = SIDA_CALLABLE_CONSULTANTS.find(item => item.name === name)!;
  return { ...person, description: UK_CONSULTANT_NOTES[name], avatarCrop: { scale: 1, originY: '50%' } };
});

export const ST_GILES_REFERENCE_NOTE = '课程安排、活动、设施和住宿规定仅供参考，学校可能随时调整。';

export const ST_GILES_TRUST = '1955年在伦敦创办，家族经营70多年；英国文化协会认证，English UK成员';

const lcGallery: StGilesPhoto[] = [
  photo('london-central', 'london-central-35', '校园外观', '红砖校舍正门', '伦敦中心校区红砖校舍的正门'),
  photo('london-central', 'london-onsite-81', '校园外观', '校舍街景', '从街对面看学校的红砖大楼'),
  photo('london-central', 'london-central-5', '教室上课', '小班课堂', '学生围坐长桌，老师在白板前上课'),
  photo('london-central', 'london-central-3', '教室上课', '同伴练习', '两名学生在课堂上一起做练习'),
  photo('london-central', 'london-central-15', '教室上课', '老师讲解', '老师在投影屏幕前讲解'),
  photo('london-central', 'london-central-31', '教室上课', '长桌讨论课', '多名学生围着长桌上课交流'),
  photo('london-central', 'london-central-36', '公共区域', '屋顶露台', '学校楼顶露台，摆着木质长桌和长椅'),
  photo('london-central', 'london-central-39', '公共区域', '学生咖啡厅', '绿色墙面的咖啡厅，有桌椅和沙发'),
  photo('london-central', 'london-central-34', '公共区域', '咖啡柜台', '咖啡厅的咖啡机和糕点柜台'),
  photo('london-central', 'london-central-1', '公共区域', '休息学习区', '摆着沙发和长桌的明亮休息区'),
  photo('london-central', 'london-onsite-70', '住宿', '校内宿舍单人间', '带窗户、书桌和衣柜的单人间'),
  photo('london-central', 'london-onsite-33', '住宿', '宿舍书桌', '床边有书桌和抽屉柜'),
  photo('london-central', 'london-onsite-84', '住宿', '带洗手盆的房间', '房间里有书桌、床和洗手盆'),
  photo('london-central', 'london-onsite-7', '住宿', '宿舍公用厨房', '水槽、水壶和烤面包机'),
  photo('london-central', 'london-onsite-5', '住宿', '宿舍卫生间', '淋浴间、洗手盆和马桶'),
  photo('london-central', 'london-onsite-88', '住宿', '宿舍公共区', '摆着桌子和沙发的休息区'),
  photo('london-central', 'iq-london-city-5', '住宿', 'iQ公寓休息区', 'iQ London City公寓的公共休息区'),
  photo('london-central', 'iq-london-city-3', '住宿', 'iQ公寓厨房餐区', '长桌和高脚凳的公共厨房'),
  photo('london-central', 'iq-london-city-16', '住宿', 'iQ公寓卧室', '整洁的卧室'),
  photo('london-central', 'london-central-27', '城市与活动', '伦敦街头', '学生在伦敦街头边走边聊'),
  photo('london-central', 'london-central-20', '城市与活动', '结伴游览', '几名学生靠着栏杆聊天'),
  photo('london-central', 'london-central-22', '城市与活动', '拱廊建筑', '学生站在伦敦红砖拱廊旁'),
  photo('london-central', 'london-central-30', '城市与活动', '露台合影', '学生在屋顶露台合影'),
  photo('london-central', 'london-family-1', '亲子和青少年', '亲子课程合影', '家长和孩子在公园里的大合影'),
  photo('london-central', 'london-family-3', '亲子和青少年', '树下家庭合影', '一家人在公园树荫下合影'),
  photo('london-central', 'london-family-18', '亲子和青少年', '儿童课堂', '孩子们围桌上课'),
  photo('london-central', 'london-family-88', '亲子和青少年', '孩子分组活动', '孩子们在宽敞的教室里分组活动'),
];

const lhGallery: StGilesPhoto[] = [
  photo('london-highgate', 'london-highgate-4', '校园外观', '红砖校舍', '掩映在绿树中的红砖校舍'),
  photo('london-highgate', 'highgate-family-1', '校园外观', '花园望校舍', '从花园望向红砖校舍'),
  photo('london-highgate', 'highgate-family-213', '校园外观', '白色门廊', '校舍的白色木质门廊'),
  photo('london-highgate', 'london-highgate-1', '教室上课', '小组讨论', '学生围坐教室一起看资料'),
  photo('london-highgate', 'london-highgate-6', '教室上课', '老师授课', '老师站在窗边讲解'),
  photo('london-highgate', 'london-highgate-5', '教室上课', '课堂练习', '学生围着资料讨论'),
  photo('london-highgate', 'highgate-family-94', '教室上课', '投影教室', '老师在投影幕前讲课'),
  photo('london-highgate', 'highgate-family-69', '教室上课', '成人班课堂', '学生围坐半圈听老师讲课'),
  photo('london-highgate', 'london-highgate-8', '公共区域', '玻璃花房咖啡厅', '学生在明亮的玻璃花房里聊天'),
  photo('london-highgate', 'london-highgate-15', '公共区域', '花园野餐桌', '学生在花园木桌旁休息'),
  photo('london-highgate', 'london-highgate-11', '公共区域', '草坪游戏', '学生在花园草坪上玩槌球'),
  photo('london-highgate', 'highgate-family-26', '公共区域', '野餐区', '树荫下的野餐桌和遮阳伞'),
  photo('london-highgate', 'highgate-family-211', '公共区域', '学习中心', '带大窗的明亮学习中心'),
  photo('london-highgate', 'highgate-family-259', '城市与活动', '公园湖面', '湖上的天鹅脚踏船'),
  photo('london-highgate', 'london-highgate-14', '城市与活动', '飞盘游戏', '学生在花园里玩飞盘'),
  photo('london-highgate', 'london-highgate-12', '城市与活动', '槌球活动', '学生在花园里一起玩槌球'),
  photo('london-highgate', 'highgate-family-192', '亲子和青少年', '花园家庭时光', '一家四口在花园桌边聊天'),
  photo('london-highgate', 'highgate-family-227', '亲子和青少年', '亲子合影', '父母和两个孩子在花园里合影'),
  photo('london-highgate', 'highgate-family-10', '亲子和青少年', '儿童课堂', '老师带孩子们上课'),
  photo('london-highgate', 'highgate-family-148', '亲子和青少年', '孩子玩槌球', '孩子们在花园里玩槌球'),
  photo('london-highgate', 'highgate-family-184', '亲子和青少年', '花园跳绳', '孩子们在花园里跳绳'),
  photo('london-highgate', 'highgate-family-297', '亲子和青少年', '亲子划船', '一家人在公园湖上划船'),
];

const bnGallery: StGilesPhoto[] = [
  photo('brighton', 'brighton-36', '校园外观', '白色街角教学楼', '布莱顿校区所在的白色街角建筑'),
  photo('brighton', 'george-street-12', '校园外观', '学校门牌', '挂在外墙上的学校标志'),
  photo('brighton', 'george-street-51', '校园外观', '校区入口', '转角建筑和入口台阶'),
  photo('brighton', 'brighton-20', '教室上课', '窗边学习', '两名学生在明亮的窗边一起看书'),
  photo('brighton', 'brighton-22', '教室上课', '师生讨论', '老师和学生围坐桌边交流'),
  photo('brighton', 'brighton-23', '教室上课', '课堂辅导', '老师指导学生用教材和电脑'),
  photo('brighton', 'brighton-32', '教室上课', '小组课堂', '老师带学生围着大桌子上课'),
  photo('brighton', 'brighton-15', '公共区域', '学生休息室', '摆着沙发和地毯的明亮休息室'),
  photo('brighton', 'brighton-17', '公共区域', '学生用餐区', '长桌和高脚凳的室内用餐区'),
  photo('brighton', 'brighton-39', '公共区域', '咖啡休息角', '学生在木质长桌旁看资料'),
  photo('brighton', 'brighton-47', '公共区域', '校内吧台', '校内吧台摆着水果'),
  photo('brighton', 'brighton-3', '住宿', '学生公寓单人间', '学生公寓的单人卧室'),
  photo('brighton', 'brighton-8', '住宿', '房间书桌', '房间里靠窗的书桌'),
  photo('brighton', 'george-street-39', '住宿', 'George Street卧室', '有大窗户、书桌和床的房间'),
  photo('brighton', 'george-street-46', '住宿', 'George Street房间', '床铺和书桌'),
  photo('brighton', 'george-street-33', '住宿', '独立卫生间', '带淋浴的独立卫生间'),
  photo('brighton', 'brighton-10', '住宿', '公寓露台', '学生在公寓露台木桌旁玩游戏'),
  photo('brighton', 'brighton-35', '城市与活动', '公园漫步', '学生在公园大树下一起看平板'),
  photo('brighton', 'brighton-29', '城市与活动', '街头涂鸦墙', '学生在布莱顿彩色涂鸦墙前聊天'),
  photo('brighton', 'george-street-14', '城市与活动', '布莱顿英皇阁', '市中心带穹顶的历史建筑'),
  photo('brighton', 'brighton-27', '城市与活动', '花园散步', '两名学生走在花园旁'),
  photo('brighton', 'brighton-family-5', '亲子和青少年', '儿童英语课', '两名小朋友在教室里做练习'),
  photo('brighton', 'brighton-family-23', '亲子和青少年', '展示作品', '老师和孩子展示海边主题作品'),
  photo('brighton', 'brighton-family-93', '亲子和青少年', '合作绘图', '孩子们在老师带领下一起画图'),
  photo('brighton', 'brighton-family-153', '亲子和青少年', '家庭徒步', '家长和孩子走在乡间步道上'),
  photo('brighton', 'brighton-family-214', '亲子和青少年', '海边家庭活动', '一家人走在海边卵石滩上'),
];

const cbGallery: StGilesPhoto[] = [
  photo('cambridge', 'cambridge-3', '教室上课', '小组课堂', '学生围坐在桌边一起上课'),
  photo('cambridge', 'cambridge-5', '教室上课', '课堂学习', '学生在明亮的教室里学习'),
  photo('cambridge', 'cambridge-6', '公共区域', '学生休息区', '色彩丰富的休息区和桌上足球'),
  photo('cambridge', 'cambridge-11', '公共区域', '户外露台', '学生在遮阳伞下打乒乓球'),
  photo('cambridge', 'cambridge-14', '城市与活动', '剑桥撑篙', '撑篙船经过叹息桥旁的河面'),
  photo('cambridge', 'cambridge-12', '城市与活动', '康河风光', '河边垂柳和河面上的小船'),
  photo('cambridge', 'cambridge-19', '城市与活动', '老城石板街', '学生走在剑桥老城的石板路上'),
  photo('cambridge', 'cambridge-15', '城市与活动', '学院回廊', '学生在学院石柱回廊旁交流'),
  photo('cambridge', 'cambridge-junior-1', '青少年夏校', "St Mary's草坪与主楼", "青少年夏校所在的St Mary's School主楼"),
  photo('cambridge', 'cambridge-junior-12', '青少年夏校', "St Mary's校园建筑", '带雕像的校园建筑和草地'),
  photo('cambridge', 'cambridge-junior-5', '青少年夏校', "St Mary's庭院", '教学楼围合的石板庭院'),
  photo('cambridge', 'cambridge-junior-26', '青少年夏校', '夏校教室', '学生坐在橙色储物柜前的教室里'),
  photo('cambridge', 'cambridge-junior-107', '青少年夏校', '圆圈讨论课', '老师和学生围坐讨论'),
  photo('cambridge', 'cambridge-junior-46', '青少年夏校', '夏校餐厅', '明亮宽敞的学生餐厅'),
  photo('cambridge', 'cambridge-junior-7', '青少年夏校', '人造草球场', '户外人造草运动场'),
  photo('cambridge', 'cambridge-junior-93', '青少年夏校', '室内体育馆', '带篮球架的室内运动馆'),
  photo('cambridge', 'cambridge-junior-77', '青少年夏校', '公共休息厅', '落地窗旁的沙发休息厅'),
  photo('cambridge', 'cambridge-junior-64', '青少年夏校', '活动咖啡厅', '摆着桌上足球的咖啡厅'),
  photo('cambridge', 'cambridge-family-4', '亲子和青少年', '亲子课堂', '老师在桌边指导两位小朋友'),
  photo('cambridge', 'cambridge-family-14', '亲子和青少年', '家庭休息室', '色彩明亮的沙发休息室'),
  photo('cambridge', 'cambridge-family-75', '亲子和青少年', '后院活动', '砖墙小院里的乒乓球桌'),
  photo('cambridge', 'cambridge-family-185', '亲子和青少年', '英式下午茶', '木桌上的司康饼和茶具'),
];

const ebGallery: StGilesPhoto[] = [
  photo('eastbourne', 'eastbourne-87', '校园外观', '白色校舍', '伊斯特本校区的白色校舍和门前花园'),
  photo('eastbourne', 'eastbourne-93', '校园外观', '校舍前小径', '学生走过绿意环绕的小路'),
  photo('eastbourne', 'eastbourne-102', '校园外观', '校舍与花园', '校舍一侧的花园和长椅'),
  photo('eastbourne', 'eastbourne-52', '教室上课', '木屋教室', '老师在木墙教室里上课'),
  photo('eastbourne', 'eastbourne-63', '教室上课', '小班课堂', '学生围坐长桌，老师在屏幕前讲解'),
  photo('eastbourne', 'eastbourne-72', '教室上课', '课上指导', '老师俯身指导学生做练习'),
  photo('eastbourne', 'eastbourne-25', '教室上课', '课堂交流', '两位学生在教室里交流'),
  photo('eastbourne', 'eastbourne-183', '教室上课', '明亮教室', '老师在明亮的教室里讲课'),
  photo('eastbourne', 'eastbourne-45', '公共区域', '玻璃顶咖啡厅', '学生在玻璃顶咖啡厅里分组交流'),
  photo('eastbourne', 'eastbourne-28', '公共区域', '庭院桌上足球', '庭院里的桌上足球台'),
  photo('eastbourne', 'eastbourne-152', '公共区域', '自习中心', '学生在自习中心看书'),
  photo('eastbourne', 'eastbourne-187', '公共区域', '露台', '从高处看校园露台和遮阳伞'),
  photo('eastbourne', 'eastbourne-17', '城市与活动', '海边摩天轮', '学生在摩天轮和花园旁散步'),
  photo('eastbourne', 'eastbourne-16', '城市与活动', '海滨台阶', '三位学生走下海滨花园台阶'),
  photo('eastbourne', 'eastbourne-14', '城市与活动', '海滩与码头', '学生在海滩边聊天，远处是码头'),
  photo('eastbourne', 'eastbourne-12', '城市与活动', '海边漫步', '学生沿着海边草地散步'),
  photo('eastbourne', 'eastbourne-175', '城市与活动', '花园乒乓球', '学生在校园花园打乒乓球'),
  photo('eastbourne', 'eastbourne-2', '亲子和青少年', '青少年足球', '一群青少年在球场合影'),
  photo('eastbourne', 'eastbourne-4', '亲子和青少年', '花园瑜伽', '学生在花园草地上做瑜伽'),
  photo('eastbourne', 'eastbourne-167', '亲子和青少年', '草地下棋', '学生在草地上围坐下棋'),
];

export const ST_GILES_JUNIOR_GALLERY: StGilesPhoto[] = [
  photo('junior', 'canterbury-junior-2', '坎特伯雷夏校', '坎特伯雷夏校校园', "The King's School校园全景"),
  photo('junior', 'canterbury-junior-1', '坎特伯雷夏校', '宿舍双人间', '两张单人床和书桌的宿舍'),
  photo('junior', 'canterbury-junior-7', '坎特伯雷夏校', '夏校课堂', '老师在教室里上课'),
  photo('junior', 'canterbury-junior-29', '坎特伯雷夏校', '拱顶餐厅', '学生在拱顶大厅里用餐'),
  photo('junior', 'canterbury-junior-28', '坎特伯雷夏校', '古建筑草坪', '学生走过古老建筑旁的草坪'),
  photo('junior', 'canterbury-junior-11', '坎特伯雷夏校', '草坪活动', '学生在草坪上玩充气游戏'),
];

export interface StGilesVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  src: string;
  poster: string;
  /** Label above the title; summer-programme videos use the summer zone's blue. */
  tag: { label: string; zone?: 'adult' | 'junior' };
}

const video = (id: string, title: string, description: string, duration: string, tag: StGilesVideo['tag']): StGilesVideo =>
  ({ id, title, description, duration, tag, src: `/assets/st-giles/videos/${id}.mp4`, poster: `/assets/st-giles/videos/poster-${id}.jpg` });

const campusFilm = { label: '校区介绍' };
const studentStory = { label: '学生分享', zone: 'adult' as const };

/**
 * Each campus's film and one student's story. Every clip was checked frame by frame: signs showing a
 * website, phone number or street name are blurred and long logo endings trimmed. Check a new clip the
 * same way before adding it.
 */
export const ST_GILES_CAMPUS_VIDEOS: Record<StGilesCampusId, StGilesVideo[]> = {
  'london-central': [
    video('london-central-film', '伦敦中心校区介绍', '校长和老师介绍学校位置、课程和每周活动，日本学生讲她的学习和住宿（英文字幕）。', '2:05', campusFilm),
    video('london-central-student', '日本学生Mahiro', '从A2初级学到B2，讲课堂、老师和寄宿家庭（英文字幕）。', '1:13', studentStory),
  ],
  'london-highgate': [
    video('london-highgate-film', '伦敦海格特校区介绍', '北伦敦的老宅校舍和花园，校长、老师和西班牙学生讲课程、下午活动和寄宿家庭（英文字幕）。', '2:02', campusFilm),
    video('london-highgate-student', '西班牙学生Miriam', '第二次来海格特，从B1学到B2，讲老师和寄宿家庭（英文字幕）。', '1:11', studentStory),
  ],
  brighton: [
    video('brighton-film', '布莱顿校区介绍', '海边的校舍、课堂、学生公寓和城市生活，老师和法国学生讲在布莱顿学英语。', '1:58', campusFilm),
    video('brighton-student', '法国学生Jules', '住在George Street学生公寓的单人间，讲老师、社交活动和游船派对（英文字幕）。', '1:19', studentStory),
  ],
  cambridge: [
    video('cambridge-film', '剑桥校区介绍', '校长、老师和法国学生讲剑桥的学习生活：撑船、徒步游览和校内活动，学校约90–100名学生（英文字幕）。', '2:10', campusFilm),
    video('cambridge-student', '法国学生Lamya', '18岁，从B2学到C1，讲课程、寄宿家庭和剑桥生活（英文字幕）。', '1:25', studentStory),
  ],
  eastbourne: [
    video('eastbourne-film', '伊斯特本校区介绍', '海边小城的校舍和花园、课堂、皮划艇活动和寄宿家庭晚餐。', '1:58', campusFilm),
    video('eastbourne-student', '沙特学生Saoud', '在伊斯特本学到B2，讲老师、寄宿家庭和周末烧烤（英文字幕）。', '1:00', studentStory),
  ],
};

/** The overview page: the school's own introduction and the Canterbury junior summer centre. */
export const ST_GILES_HUB_VIDEOS: StGilesVideo[] = [
  video('st-giles-film', 'St Giles学校介绍', '1955年在伦敦创办的家族学校：管理层、老师和学生讲学校的历史、课程和住宿（英文字幕）。', '2:29', { label: '学校介绍' }),
  video('canterbury-junior-film', '坎特伯雷青少年夏校', "The King's School校园里的夏校：课堂、运动、出游和宿舍（英文字幕）。", '1:46', { label: '暑期项目', zone: 'junior' }),
];

const fact = (label: string, value: string) => ({ label, value });

export const ST_GILES_CAMPUS_PROFILES: Record<StGilesCampusId, StGilesCampusProfile> = {
  'london-central': {
    id: 'london-central',
    name: '伦敦中心校区',
    nameEn: 'London Central',
    city: '伦敦',
    title: 'St Giles 伦敦中心校区',
    lead: '学校在伦敦一区，步行约5分钟到大英博物馆，考文特花园和西区剧院区都在附近。百年老楼里有现代化教室，楼上就是校内宿舍，楼顶有学生露台。',
    tags: [
      { icon: 'cake', text: '16岁以上' },
      { icon: 'event', text: '全年每周一开课' },
      { icon: 'apartment', text: '校内宿舍' },
      { icon: 'groups', text: '每班最多12人' },
    ],
    heroPhoto: 'london-central-35',
    stripPhotos: ['london-central-36', 'london-onsite-70', 'london-central-5'],
    cardText: '规模最大的校区，在伦敦一区，楼上就是校内宿舍；课程最全，有30岁以上、50岁以上和高管小班。',
    facts: [fact('学生容量', '约440人'), fact('教室', '40间'), fact('最低年龄', '16岁（高管小班21岁）'),
      fact('平均年龄', '25岁'), fact('平均班级人数', '10人（最多12人）'), fact('离伦敦市中心', '就在市中心')],
    nationalities: '土耳其、法国约各17%，日本10%，中国8%，巴西7%，学生来自50多个国家',
    highlights: [
      { icon: 'apartment', title: '楼上就是宿舍', text: '伦敦市中心少有的校内宿舍，房间有独立或共用卫浴，含早餐，上课下楼就到。' },
      { icon: 'location_city', title: '伦敦一区', text: '步行5分钟到大英博物馆，考文特花园、西区剧院和牛津街都在附近。' },
      { icon: 'deck', title: '屋顶露台和咖啡厅', text: '楼顶露台课间可以休息聊天，楼里有咖啡厅，住宿学生可以加订早餐。' },
      { icon: 'menu_book', title: '课程最全', text: '通用英语、雅思、剑桥考试、30岁以上和50岁以上课程、高管小班和CELTA教师培训都有。' },
      { icon: 'groups', title: '小班教学', text: '每班最多12人，平均10人；入学分级测试，按水平分班。' },
      { icon: 'public', title: '国际化', text: '学生来自50多个国家，中国学生约占8%。' },
    ],
    fit: {
      suitable: [
        { title: '想住市中心的成人', text: '住校内宿舍，不用通勤，课后逛伦敦很方便。' },
        { title: '备考雅思或剑桥英语', text: '有雅思方向课程和固定日期的剑桥考试班。' },
        { title: '30岁以上和职场人士', text: '有30岁以上课程、50岁以上英语文化课和最多5人的高管小班。' },
      ],
      lessSuitable: [
        { title: '16岁以下学生', text: '全年课程16岁起；14–15岁可选海格特、剑桥或伊斯特本校区。' },
        { title: '预算有限', text: '伦敦住宿最贵，伊斯特本和布莱顿的总费用更低。' },
        { title: '想要安静环境', text: '市中心热闹，喜欢安静花园校园可看海格特校区。' },
      ],
    },
    gallery: lcGallery,
    specialCourses: [
      { name: '剑桥考试备考班', text: '剑桥B2 First和C1 Advanced，固定开课日期，课程10–13周，结课后在学校考试，考试费约218–265英镑另付。', price: '强化课程每周512–579英镑' },
      { name: '零基础班', text: '每月一期，4周；1月18日、2月15日、3月15日、4月19日、5月17日、6月14日、7月19日、8月16日、9月13日、10月11日、11月8日开课。', price: '4周每周399英镑' },
      { name: '50岁以上英语与文化', text: '每周20节上午课＋下午和晚间文化活动、5次午餐；4月5日、6月7日、9月6日开课1周，或伦敦＋布莱顿2周。', price: '1周815英镑，2周1,630英镑' },
      { name: '高管小班（21岁以上）', text: '商务英语小班每班最多5人，每周20或30节，也可加一对一。', price: '每周20节751–792英镑' },
      { name: 'CELTA教师培训', text: '剑桥英语教师资格证，4周全日制或12周非全日制。', price: '1,550英镑' },
    ],
    advisor: {
      heading: '住在伦敦市中心学英语，这是最省心的选择',
      paragraphs: [
        '伦敦中心校区最大的优势是楼上的校内宿舍：上课下楼就到，不用每天坐一个小时地铁，晚上出门逛伦敦也方便。宿舍含早餐，房间有独立卫浴和共用卫浴两种，订房以学校确认为准。',
        '这里课程最全，适合目标明确的学生：备考雅思、剑桥考试，或者30岁以上想跟同龄人一起学。要提醒的是伦敦整体住宿贵，寄宿家庭到学校要45–60分钟，预算有限的话可以对比布莱顿或伊斯特本。',
      ],
    },
    faq: [
      { title: '校内宿舍和寄宿家庭怎么选？', text: '想通勤短、方便逛伦敦选校内宿舍；想多练口语、体验英国家庭生活、预算低一些选寄宿家庭，含早晚餐，到学校约45–60分钟。' },
      { title: '16、17岁可以报吗？', text: '可以报成人课程，住寄宿家庭（必须含早晚餐）；暑期还可以住UCL暑期宿舍（含早晚餐）。校内宿舍和iQ公寓只接受18岁以上。' },
    ],
  },
  'london-highgate': {
    id: 'london-highgate',
    name: '伦敦海格特校区',
    nameEn: 'London Highgate',
    city: '伦敦',
    title: 'St Giles 伦敦海格特校区',
    lead: '学校在伦敦北部绿树多、环境安静的海格特区，坐地铁约20分钟到市中心。校舍有大花园、野餐区和玻璃花房咖啡厅；14岁起全年都能报。',
    tags: [
      { icon: 'cake', text: '14岁以上' },
      { icon: 'event', text: '全年每周一开课' },
      { icon: 'park', text: '大花园校园' },
      { icon: 'groups', text: '每班最多12人' },
    ],
    heroPhoto: 'london-highgate-4',
    stripPhotos: ['london-highgate-8', 'london-highgate-15', 'london-highgate-1'],
    cardText: '伦敦北部的花园校园，环境安静，14岁起全年可报；暑期亲子课程适合带5–11岁孩子的家庭。',
    facts: [fact('学生容量', '约296人'), fact('教室', '25间'), fact('最低年龄', '14岁'),
      fact('平均年龄', '25岁'), fact('平均班级人数', '10人（最多12人）'), fact('离伦敦市中心', '坐地铁约20分钟')],
    nationalities: '土耳其19%，阿根廷、意大利各约10%，瑞士9%，中国5%，学生来自40多个国家',
    highlights: [
      { icon: 'park', title: '花园校园', text: '大花园、野餐区和玻璃花房咖啡厅，夏天在花园里烧烤。' },
      { icon: 'verified_user', title: '安静安全', text: '海格特是伦敦北部的绿色住宅区，离市中心约20分钟。' },
      { icon: 'school', title: '14–15岁全年可报', text: '14–15岁上16岁以下强化课程，一般单独分班（人少时可能和成人同班），每周还有3次活动。' },
      { icon: 'family_restroom', title: '亲子课程', text: '暑期亲子课程孩子5–11岁，家长可以陪读或同时上课。' },
      { icon: 'emoji_events', title: '英语＋领导力', text: '2周英语加领导力课程，4月5日和7月26日开课。' },
      { icon: 'groups', title: '小班教学', text: '每班最多12人，平均10人；入学分级测试。' },
    ],
    fit: {
      suitable: [
        { title: '14–17岁想全年来伦敦', text: '伦敦两个校区中只有海格特收14–15岁学生。' },
        { title: '带5–11岁孩子的家庭', text: '花园校园适合小孩，暑期有亲子课程。' },
        { title: '喜欢安静环境的成人', text: '住宅区环境好，下课进城也方便。' },
      ],
      lessSuitable: [
        { title: '想住市中心步行上学', text: '选伦敦中心校区，楼上就是宿舍。' },
        { title: '剑桥考试备考', text: '海格特没有剑桥考试班，可选伦敦中心校区。' },
        { title: '18岁以下想住宿舍', text: '全年只有寄宿家庭；暑期可住UCL暑期宿舍。' },
      ],
    },
    gallery: lhGallery,
    specialCourses: [
      { name: '零基础班', text: '1月4日、3月22日、7月19日、9月20日开课，4周。', price: '强化课程4周每周467英镑' },
      { name: '英语＋领导力', text: '2周，英语课程加领导力和团队合作主题，4月5日、7月26日开课。', price: '每周518英镑' },
    ],
    advisor: {
      heading: '想去伦敦又想要安静环境，海格特很合适',
      paragraphs: [
        '海格特校区在伦敦北部的绿色住宅区，学校有大花园和玻璃花房咖啡厅，环境比市中心安静很多，坐地铁约20分钟就能进城。伦敦两个校区里，只有这里全年接收14–15岁学生，适合想全年来伦敦的中学生。',
        '寄宿家庭到学校坐公交或地铁约45–60分钟。成人想住学生公寓可以选iQ London City，但到学校约40分钟，通勤会长一些。',
      ],
    },
    faq: [
      { title: '14–15岁住哪里？', text: '全年住寄宿家庭（必须含早晚餐）；6月27日–8月1日也可以住UCL暑期宿舍。16岁以下必须订学校接机。' },
      { title: '亲子课程家长能上课吗？', text: '可以。家长可以只陪同参加活动，也可以同时报成人课程，费用请顾问单独报价。' },
    ],
  },
  brighton: {
    id: 'brighton',
    name: '布莱顿校区',
    nameEn: 'Brighton',
    city: '布莱顿',
    title: 'St Giles 布莱顿校区',
    lead: '布莱顿是英国南部的海边城市，坐火车约1小时到伦敦。学校在市中心，步行几分钟到海边，周边餐厅商店多；学校专属的George Street学生公寓步行约4分钟。',
    tags: [
      { icon: 'cake', text: '16岁以上' },
      { icon: 'beach_access', text: '海边城市' },
      { icon: 'apartment', text: '学校专属公寓' },
      { icon: 'groups', text: '每班最多12人' },
    ],
    heroPhoto: 'brighton-36',
    stripPhotos: ['brighton-15', 'george-street-39', 'brighton-29'],
    cardText: '最受欢迎的校区，海边城市、离伦敦1小时；学校专属公寓步行4分钟。',
    facts: [fact('学生容量', '约425人'), fact('教室', '30间'), fact('最低年龄', '16岁（高管小班21岁）'),
      fact('平均年龄', '27岁'), fact('平均班级人数', '10人（最多12人）'), fact('离伦敦', '坐火车约1小时')],
    nationalities: '瑞士15%，土耳其14%，法国11%，沙特9%，韩国7%，学生来自50多个国家',
    highlights: [
      { icon: 'beach_access', title: '海边城市', text: '学校在市中心，步行几分钟到海边，城市氛围轻松，活动多。' },
      { icon: 'apartment', title: '学校专属公寓', text: 'George Street公寓只住St Giles学生，单人间带独立卫浴，步行约4分钟到学校。' },
      { icon: 'star', title: '最受欢迎的校区', text: '学生多、活动丰富，每周有下午、晚上和周末活动。' },
      { icon: 'menu_book', title: '课程全', text: '雅思、剑桥考试、30岁以上和50岁以上课程、高管小班和CELTA教师培训。' },
      { icon: 'train', title: '离伦敦近', text: '坐火车约1小时到伦敦，盖特威克机场约30分钟。' },
      { icon: 'child_care', title: '青少年寄宿家庭夏校', text: '2027年新开，12–17岁住寄宿家庭，在布莱顿校区上课。' },
    ],
    fit: {
      suitable: [
        { title: '想要海边生活的成人', text: '城市不大但很热闹，生活费比伦敦低。' },
        { title: '想住学生公寓', text: 'George Street公寓是学校专属，单人间独立卫浴。' },
        { title: '30岁以上和50岁以上', text: '有30岁以上课程和50岁以上英语文化课。' },
      ],
      lessSuitable: [
        { title: '16岁以下全年课程', text: '布莱顿全年16岁起；14–15岁可选伊斯特本、剑桥或海格特。' },
        { title: '一定要住伦敦', text: '去伦敦一日游方便，但长期住伦敦请选伦敦校区。' },
        { title: '18岁以下想住公寓', text: '学生公寓只接受18岁以上，16–17岁住寄宿家庭。' },
      ],
    },
    gallery: bnGallery,
    specialCourses: [
      { name: '剑桥C1 Advanced备考班', text: '3月22日–6月4日（11周）、7月5日–8月27日（8周）、9月6日–11月26日（12周）。', price: '强化课程每周498–562英镑' },
      { name: '零基础班', text: '1月4日、3月22日、6月1日、6月28日、8月9日、10月4日开课，4周。', price: '4周每周388英镑' },
      { name: '50岁以上英语与文化', text: '4月12日、6月14日、9月13日开课1周，或伦敦＋布莱顿2周；含文化活动和5次午餐。', price: '1周815英镑，2周1,630英镑' },
      { name: '高管小班（21岁以上）', text: '商务英语小班每班最多5人，每周20节，也可加一对一。', price: '每周713–753英镑' },
      { name: 'CELTA教师培训', text: '4周全日制，2月1日、4月5日、6月7日、9月6日、11月1日开课；也有2周TEC课程。', price: '1,595英镑' },
    ],
    advisor: {
      heading: '海边城市＋学校专属公寓，性价比和生活体验兼顾',
      paragraphs: [
        '布莱顿是St Giles最受欢迎的校区：学校在市中心，几分钟走到海边，城市年轻热闹，课后活动多。学校专属的George Street公寓单人间带独立卫浴，步行4分钟到学校，长住12周以上每周还更便宜。',
        '费用比伦敦低一些。要注意全年课程16岁起，16–17岁只能住寄宿家庭；14–15岁可以看伊斯特本或剑桥校区。',
      ],
    },
    faq: [
      { title: 'George Street公寓怎么收费？', text: '18岁以上，单人间独立卫浴，不含餐可用厨房；非暑期每周375英镑，住12周以上每周340英镑，暑期每周410英镑。也可以加学校咖啡厅早餐。' },
      { title: '从机场怎么到布莱顿？', text: '盖特威克机场最近，学校接机单程每车121英镑；希思罗机场每车209英镑。' },
    ],
  },
  cambridge: {
    id: 'cambridge',
    name: '剑桥校区',
    nameEn: 'Cambridge',
    city: '剑桥',
    title: 'St Giles 剑桥校区',
    lead: '剑桥是世界知名的大学城，学校在市中心，步行可到各学院和康河。校区规模小，最多约90名学生；坐火车约1小时到伦敦。',
    tags: [
      { icon: 'cake', text: '14岁以上' },
      { icon: 'account_balance', text: '大学城' },
      { icon: 'favorite', text: '精品小校区' },
      { icon: 'groups', text: '每班最多12人' },
    ],
    heroPhoto: 'cambridge-14',
    stripPhotos: ['cambridge-3', 'cambridge-11', 'cambridge-junior-1'],
    cardText: '大学城里的精品小校区，最多约90名学生；14岁起全年可报，暑期有St Mary\'s青少年夏校和STEM夏校。',
    facts: [fact('学生容量', '约92人'), fact('教室', '8间'), fact('最低年龄', '14岁（团组12岁）'),
      fact('平均年龄', '24岁'), fact('平均班级人数', '10人（最多12人）'), fact('离伦敦', '坐火车约1小时')],
    nationalities: '西班牙20%，土耳其18%，意大利13%，中国10%，乌拉圭8%，学生来自30多个国家',
    highlights: [
      { icon: 'account_balance', title: '大学城', text: '步行可到剑桥各学院、康河和老城，名校氛围浓。' },
      { icon: 'favorite', title: '精品小校区', text: '最多约90名学生、8间教室，规模小，学生之间容易熟悉。' },
      { icon: 'school', title: '14–15岁全年可报', text: '16岁以下强化课程一般单独分班（人少时可能和成人同班），每周28节课加3次活动。' },
      { icon: 'workspace_premium', title: '剑桥考试备考', text: '剑桥B2 First和C1 Advanced固定日期备考班。' },
      { icon: 'science', title: '青少年夏校和STEM营', text: "暑期St Mary's寄宿学校夏校8–17岁，另有14–17岁STEM营。" },
      { icon: 'yard', title: '花园露台', text: '学校有花园露台、图书室，可打乒乓球和桌上足球。' },
    ],
    fit: {
      suitable: [
        { title: '想感受名校氛围', text: '学生和家庭都可以，课后逛学院、撑篙很方便。' },
        { title: '14–17岁中学生', text: '全年有16岁以下课程，暑期有寄宿学校夏校。' },
        { title: '喜欢小校区', text: '人少、照顾细，适合第一次出国的学生。' },
      ],
      lessSuitable: [
        { title: '零基础学生', text: '剑桥零基础班只有4月26日和9月6日开课，其他时间可选伦敦中心或布莱顿。' },
        { title: '想要大城市生活', text: '剑桥是安静的大学城，晚上活动比伦敦少。' },
        { title: '想要很多同国籍以外的同学', text: '校区小，国籍数量比大校区少。' },
      ],
    },
    gallery: cbGallery,
    specialCourses: [
      { name: '剑桥考试备考班', text: 'B2 First：1月4日–3月12日（10周）；C1 Advanced：3月22日–6月18日、9月13日–12月10日（13周）。', price: '强化课程每周460–521英镑' },
      { name: '英语＋领导力', text: '2周，2月22日、10月11日开课。', price: '每周502英镑' },
      { name: '零基础班', text: '4月26日、9月6日开课，4周。', price: '4周每周360英镑' },
      { name: '上午15节轻松课程', text: '每周15节，09:00–12:00，下午自由安排。', price: '每周231–328英镑' },
    ],
    advisor: {
      heading: '小而精的大学城校区，适合中学生和想安静学习的人',
      paragraphs: [
        '剑桥校区最多约90名学生，规模小，很适合第一次出国的学生。14–15岁全年都能来，上16岁以下强化课程，一般单独分班（人少时可能和成人同班），每周还有3次活动；16岁以下抵达和离开都必须订学校接送机（由成年亲友接送的除外）。',
        '课后可以去各学院、康河撑篙，周末去伦敦也只要1小时火车。寄宿家庭到学校约20–45分钟；成人也可以选开间或公寓，暑期14–17岁可住St Mary\'s寄宿学校。',
      ],
    },
    faq: [
      { title: '暑期14–17岁怎么选？', text: "想上全年课程可报16岁以下强化课程＋寄宿家庭或St Mary's暑期宿舍；想要全包（课程、住宿、三餐、出游、照看）就报St Mary's青少年夏校。" },
      { title: '12–13岁可以来吗？', text: '剑桥全年课程14岁起，12–13岁只接受学校团组；个人报名可以选青少年夏校（8–17岁）。' },
    ],
  },
  eastbourne: {
    id: 'eastbourne',
    name: '伊斯特本校区',
    nameEn: 'Eastbourne',
    city: '伊斯特本',
    title: 'St Giles 伊斯特本校区',
    lead: '伊斯特本是英国南部安静的海滨小城，离布莱顿约40分钟、伦敦约90分钟。学校有花园和玻璃顶咖啡厅，学费和住宿是5个校区里最实惠的；14岁起全年都能报。',
    tags: [
      { icon: 'cake', text: '14岁以上' },
      { icon: 'beach_access', text: '海滨小城' },
      { icon: 'savings', text: '费用最实惠' },
      { icon: 'groups', text: '每班最多12人' },
    ],
    heroPhoto: 'eastbourne-87',
    stripPhotos: ['eastbourne-45', 'eastbourne-63', 'eastbourne-14'],
    cardText: '安静的海滨小城，学费和寄宿家庭是5个校区里最实惠的；14岁起全年可报，学生平均年龄最小。',
    facts: [fact('学生容量', '约240人'), fact('教室', '20间'), fact('最低年龄', '14岁'),
      fact('平均年龄', '21岁'), fact('平均班级人数', '10人（最多12人）'), fact('离伦敦', '约90分钟')],
    nationalities: '瑞士30%，西班牙、沙特、土耳其各约10%，意大利8%，学生来自30多个国家',
    highlights: [
      { icon: 'savings', title: '费用最实惠', text: '学费和寄宿家庭都是5个校区里最低的，寄宿家庭单人间含早晚餐每周197英镑起。' },
      { icon: 'beach_access', title: '海滨小城', text: '海滩、码头和海滨花园就在附近，环境安静、节奏慢。' },
      { icon: 'school', title: '14–15岁全年可报', text: '16岁以下强化课程一般单独分班（人少时可能和成人同班）；学生平均年龄21岁，是最年轻的校区。' },
      { icon: 'yard', title: '花园校园', text: '花园、玻璃顶咖啡厅和自习中心，可打乒乓球和桌上足球。' },
      { icon: 'restaurant', title: '校内餐厅', text: '学校有自己的餐厅，课间和午餐都很方便。' },
      { icon: 'family_restroom', title: '亲子课程', text: '2027年新开暑期亲子课程，孩子5–13岁。' },
    ],
    fit: {
      suitable: [
        { title: '预算有限', text: '同样的课程和住宿，比伦敦每周少花一两百英镑。' },
        { title: '第一次出国的青少年', text: '小城安全安静，14岁起全年可报。' },
        { title: '想专心学英语', text: '城市节奏慢，干扰少，适合长期课程。' },
      ],
      lessSuitable: [
        { title: '想要大城市生活', text: '伊斯特本是小城，购物和夜生活少，可选伦敦或布莱顿。' },
        { title: '想住学生公寓', text: '只有两处小型学生屋，只接受18岁以上学生；主要住寄宿家庭。' },
        { title: '50岁以上课程', text: '50岁以上英语文化课只在伦敦和布莱顿开。' },
      ],
    },
    gallery: ebGallery,
    specialCourses: [
      { name: '剑桥考试备考班', text: 'C1 Advanced：1月4日–3月12日；B2 First：3月22日–6月11日、7月5日–8月27日、9月6日–11月26日。', price: '强化课程每周456–516英镑' },
      { name: '零基础班', text: '1月18日、4月26日、6月28日、7月26日、9月6日、11月1日开课，4周。', price: '上午课程4周每周356英镑' },
      { name: '英语＋领导力', text: '2周，2月1日、6月28日开课。', price: '每周498英镑' },
      { name: '大学预备英语', text: '强化课程方向之一：上午20节通用英语，下午8节为在英国读大学做准备的学习技能课；英语B1以上。', price: '强化课程每周338–498英镑' },
    ],
    advisor: {
      heading: '预算有限、想安心学英语，伊斯特本最划算',
      paragraphs: [
        '伊斯特本校区的学费和寄宿家庭都是St Giles五个校区里最低的，同样4周课程加寄宿家庭，比伦敦能省出不少钱。小城安静安全，学生平均年龄21岁，14岁起全年都能来，很适合第一次出国的中学生。',
        '要注意这里是海滨小城，购物和夜生活不多；周末可以坐火车去布莱顿（约40分钟）或伦敦（约90分钟）。住宿以寄宿家庭为主，到学校坐公交约15–60分钟。',
      ],
    },
    faq: [
      { title: '寄宿家庭单人间和双人间怎么选？', text: '双人间只限一起报名、同行的两位学生；6–8月伊斯特本单人间很少，18岁以下学生会安排与同龄、不同国籍的学生同住双人间。' },
      { title: '伊斯特本有青少年夏校吗？', text: '伊斯特本暑期有亲子课程；12–17岁全包夏校可以选布莱顿、伦敦、剑桥、坎特伯雷或牛津。' },
    ],
  },
};

export const ST_GILES_COMMON_FAQ = [
  { title: '多久开课？', text: '成人课程全年每周一开课（零基础班和剑桥考试班有固定日期）。住宿周日入住、周日离开。' },
  { title: '暑期为什么更贵？', text: '6月21日–8月20日小组课程每周加31英镑（大学预备英语方向不加）；住宿6月20日–8月22日按暑期价格。' },
  { title: '哪些日子不上课？', text: '2026年12月28日，2027年1月1日、3月26日、3月29日、5月3日、5月31日、8月30日为公共假日；2027年12月27日–31日圣诞停课。只报1周通用英语课程的，假日不收学费；其他课程缺的课不补也不退费。' },
  { title: '长期课程可以中途休假吗？', text: '9–23周课程可在上满8周后休1周；24周以上每12周可休1周。' },
  { title: '需要什么签证？', text: '6个月以内的英语课程一般办标准访问签证；16岁以上读6–11个月英语课程可办短期学习签证。具体以签证要求为准，顾问会协助准备材料。' },
  { title: '怎么付款？', text: '成人课程报名时先付注册费、课程订金100英镑，订住宿的再付住宿安排费和1周房费，开课前21天付清；青少年夏校每周100英镑订金，开课前28天付清；亲子课程订金每人100英镑。具体付款方式顾问会告知。' },
];

export const ST_GILES_SERVICE = [
  { icon: 'route', title: '选校区和方案', text: '按年龄、英语水平、预算和想去的城市，对比5个校区的课程、住宿和费用。' },
  { icon: 'calculate', title: '算清费用', text: '必付费用和可选费用分开算，生成报价单，方便家人一起看。' },
  { icon: 'assignment', title: '报名和确认学位', text: '跟学校确认学位和房间，协助填写报名资料、核对付款信息。' },
  { icon: 'flight_takeoff', title: '出发前准备', text: '签证材料、机票、保险、接机和行李清单逐项提醒。' },
  { icon: 'forum', title: '在英国学习期间', text: '学生到校后，顾问继续和学校保持沟通；遇到学习、住宿或生活问题，帮你跟学校协调。' },
  { icon: 'home', title: '学成回国', text: '课程结束、学生平安回国，服务才算结束。' },
];

export const ST_GILES_CONTACT = {
  title: '找思达启航顾问报名 St Giles',
  text: '扫码添加微信，发学生年龄、想去的校区、出发时间和英语水平，顾问帮你确认学位和正式报价。',
};

/** Lowest four-week weekly price of a 20-lesson morning course, for the overview cards. */
export function stGilesCardPrice(campus: StGilesCampusId): string {
  const pricing = ST_GILES_CAMPUSES[campus];
  const course = pricing.courses.find(item => item.id === 'morning20') ?? pricing.courses[0];
  return `上午20节课程，4周每周${stGilesCourseRate(course, 4)}英镑`;
}

export const ST_GILES_HUB = {
  title: 'St Giles International 英国语言学校',
  breadcrumb: '海外游学 / 英国游学 / St Giles',
  lead: '1955年在伦敦创办的家族经营语言学校，英国有5个全年校区：伦敦中心、伦敦海格特、布莱顿、剑桥和伊斯特本。暑期另有5个城市的青少年夏校和5个亲子课程。',
  tags: [
    { icon: 'history_edu', text: '1955年创办' },
    { icon: 'verified', text: '英国文化协会认证' },
    { icon: 'location_on', text: '5个城市校区' },
    { icon: 'groups', text: '每班最多12人' },
  ],
  heroPhoto: '/assets/st-giles/london-central/london-central-36.jpg',
  campusIntro: '每个校区都有自己的页面，课程、住宿和费用分开介绍，也能单独在线报价。',
  compareColumns: ['校区', '城市', '最低年龄', '规模', '平均年龄', '住宿', '暑期项目'],
  juniorIntro: '6–8月的全包夏校：每周20节英语课、住宿、三餐、下午和晚间活动、每周出游、保险和24小时照看都含在套餐里。',
  juniorIncludes: ['每周20节英语课，每班最多15人', '住宿和一日三餐（布莱顿为寄宿家庭）', '下午、晚间活动和每周出游', '旅行和医疗保险、24小时照看', '教材、证书和老师评语'],
  familyIntro: '孩子上午上课，家长可以陪读、只参加活动，或同时报成人课程；每周3个下午活动和1次全天出游全家一起参加。',
  advisor: {
    heading: '5个校区怎么选？',
    paragraphs: [
      '想住伦敦市中心、课程选择最多，选伦敦中心校区；想去伦敦又想要安静的花园校园，或者学生只有14–15岁，选海格特。喜欢海边城市，选布莱顿（热闹，学生公寓好）或伊斯特本（安静，费用最低）；想感受大学城氛围、喜欢小校区，选剑桥。',
      '暑期带孩子去，8–17岁可以选5个城市的全包夏校；5–15岁的孩子还可以和家长一起报亲子课程。告诉顾问学生年龄、预算和出发时间，我们帮你挑校区、算清费用。',
    ],
  },
};

export const ST_GILES_JUNIOR_NOTES = [
  '套餐费以外：13岁以下独自接送机须付无人陪伴费，每程63英镑，航空公司按无人陪伴儿童安排的学生也要付；周日以外的日期到达或离开，另收112英镑和多住的房费，只有部分夏校可以安排。',
  '到校当天所有学生交80英镑现金押金，用于损坏赔偿和医疗保险自付部分，丢失钥匙会扣除，其余离开时退还。',
  ST_GILES_REFERENCE_NOTE,
];

export const ST_GILES_JUNIOR_FAQ = [
  { title: '青少年夏校和亲子课程有什么区别？', text: '青少年夏校是孩子独自参加的全包夏令营（8–17岁），工作人员24小时照看；亲子课程是家长陪同，孩子（5–15岁，各校区不同）上午上课，下午和周末全家一起活动。' },
  { title: '住校和走读怎么选？', text: '住校全包含住宿、三餐、保险和24小时照看；在当地有亲友可以住的学生可以选走读，不含住宿和保险，具体包含哪些活动、出游和餐食请顾问确认。' },
];

/** Campus summary rows for the overview comparison table. */
export const ST_GILES_COMPARE_ROWS = ST_GILES_CAMPUS_ORDER.map(id => {
  const profile = ST_GILES_CAMPUS_PROFILES[id];
  const pricing = ST_GILES_CAMPUSES[id];
  const facts = Object.fromEntries(profile.facts.map(item => [item.label, item.value]));
  const onsite = pricing.residences.some(item => item.name === '校内宿舍');
  const stays = ['寄宿家庭', onsite ? '校内宿舍' : '',
    pricing.residences.some(item => !item.window && item.name !== '校内宿舍') ? '学生公寓' : '',
    pricing.residences.some(item => item.window) ? '暑期宿舍' : ''].filter(Boolean);
  const summer = [pricing.juniorCentres.length ? '青少年夏校' : '', '亲子课程'].filter(Boolean).join('、');
  return {
    id,
    name: profile.name,
    city: id === 'london-central' ? '伦敦市中心' : id === 'london-highgate' ? '伦敦北部，离市中心约20分钟'
      : `${profile.city}，离伦敦${facts['离伦敦'].replace(/^坐火车/, '')}`,
    minAge: `${pricing.minAge}岁`,
    size: facts['学生容量'],
    averageAge: facts['平均年龄'],
    stay: stays.join('、'),
    summer,
  };
});

// ---------------------------------------------------------------------------------------------
// Display rows built from the price data, shared by the campus pages and the overview page.

const monthDay = (value: string) => {
  const [, month, day] = value.split('-').map(Number);
  return `${month}月${day}日`;
};
const gbp = (value: number) => `${value.toLocaleString('en-US')}英镑`;
const peakText = (off: number | null, peak: number | null) => {
  if (off === null) return peak === null ? '请顾问报价' : `暑期每周${gbp(peak)}`;
  if (peak === null || peak === off) return `每周${gbp(off)}`;
  return `每周${gbp(off)}，暑期${gbp(peak)}`;
};

export const ST_GILES_SECTIONS = {
  overview: { eyebrow: '校区概况', title: '学校规模和学生' },
  highlights: { eyebrow: '校区亮点', title: '为什么选这个校区' },
  fit: { eyebrow: '适合人群', title: '适合谁，不适合谁' },
  gallery: { eyebrow: '校园照片', title: '看看教室、公共区域和住宿' },
  videos: { eyebrow: '学校视频', title: '看看校区和学生的日常', intro: '视频为英文原声，大多带英文字幕；课程、设施和活动仅供参考，最终以学校安排为准。' },
  hubVideos: { eyebrow: '学校视频', title: '学校介绍和青少年夏校', intro: '视频为英文原声，带英文字幕；课程、设施和活动仅供参考，最终以学校安排为准。' },
  adult: { eyebrow: '课程和学费', title: '全年英语课程', intro: '每周价格按课程总周数计算，适用于全部周数；每节课50分钟。' },
  stay: { eyebrow: '住宿', title: '寄宿家庭和学生公寓', intro: '住宿周日入住、周日离开；6月20日–8月22日的住宿按暑期价格。' },
  junior: { eyebrow: '青少年夏校', title: '全包夏令营', intro: '课程、住宿、三餐、活动、出游、保险和24小时照看都含在每周套餐里。' },
  family: { eyebrow: '亲子课程', title: '孩子上课，家长陪同', intro: '孩子上午上英语课，下午和周末全家一起参加活动和出游。' },
  quote: { eyebrow: '在线报价', title: '算算我的费用', intro: '选择项目、日期和住宿，最多3个方案并排对比；勾选的可选服务会计入合计。' },
  fees: { eyebrow: '其他费用', title: '注册、接机和其他费用' },
  faq: { eyebrow: '常见问题', title: '报名前常问的问题' },
  service: { eyebrow: '思达启航服务', title: '从选校区到学成回国', intro: '思达启航顾问全程跟进，学生在英国期间也能随时找到我们。' },
};

export interface StGilesCourseCard {
  name: string;
  hours: string;
  schedule: string;
  age: string;
  focuses: string;
  price: string;
}

export function stGilesCourseCards(campus: StGilesCampusId): StGilesCourseCard[] {
  return ST_GILES_CAMPUSES[campus].courses.map(course => ({
    name: course.name,
    hours: course.hoursText,
    schedule: course.schedule,
    age: course.maxAge ? `${course.minAge}–${course.maxAge}岁，最长${course.maxWeeks}周` : `${course.minAge}岁以上`,
    focuses: course.focuses.join('、'),
    price: `4周每周${gbp(stGilesCourseRate(course, 4))}`,
  }));
}

/** Weekly tuition table: one row per course, one column per duration tier. */
export function stGilesTierRows(campus: StGilesCampusId): Array<{ name: string; prices: string[] }> {
  return ST_GILES_CAMPUSES[campus].courses.map(course => ({
    name: course.name,
    prices: [0, 1, 2, 3, 4].map(tier => course.prices[tier] === undefined ? '—'
      : tier === 3 && course.maxWeeks ? `${gbp(course.prices[tier])}（最多${course.maxWeeks}周）` : gbp(course.prices[tier])),
  }));
}

export function stGilesOneToOneRows(campus: StGilesCampusId): Array<{ name: string; prices: string[] }> {
  const prices = ST_GILES_CAMPUSES[campus].oneToOne;
  return [
    { name: '一对一（每周20节）', prices: prices.twenty.map(gbp) },
    { name: '一对一（每周15节）', prices: prices.fifteen.map(gbp) },
  ];
}

export function stGilesOneToOneNote(campus: StGilesCampusId): string {
  const prices = ST_GILES_CAMPUSES[campus].oneToOne;
  return `小组课程也可以每周加5节一对一，每周${gbp(prices.addOnFive)}，再多每节${gbp(prices.addOnExtra)}。`;
}

const BOARD_NAMES = { hb: '含早晚餐', bb: '只含早餐', self: '不含餐' } as const;

/** Twin-room, under-18 and lunch rules shown under a campus's homestay table. */
export function stGilesHomestayRules(campus: StGilesCampusId): string[] {
  const pricing = ST_GILES_CAMPUSES[campus];
  const parts = [`${pricing.homestayTravel}；18岁以下必须含早晚餐`, pricing.twinRule.replace(/。$/, '')];
  if (pricing.summerMinorSharing === 'will') parts.push('6–8月单人间很少，18岁以下会安排与同龄、不同国籍的学生同住双人间');
  if (pricing.summerMinorSharing === 'may') parts.push('6–8月18岁以下订单人间，可能安排与同龄、不同国籍的学生同住双人间');
  if (pricing.homestayLunch) parts.push('可加午餐：工作日每周48英镑，周末每周15英镑；14–15岁建议加工作日午餐');
  parts.push('12月25日和26日另付40英镑圣诞全餐费');
  return parts.map(part => part + '。');
}

export function stGilesHomestayRows(campus: StGilesCampusId): Array<{ type: string; age: string; single: string; twin: string }> {
  return ST_GILES_CAMPUSES[campus].homestay.map(item => ({
    type: `${item.tier === 'superior' ? '精选（独立卫浴）' : '标准（共用卫浴）'}·${BOARD_NAMES[item.board]}`,
    age: item.age === 'minor' ? '18岁以下' : '18岁以上',
    single: peakText(item.single[0], item.single[1]),
    twin: item.twin ? peakText(item.twin[0], item.twin[1]) : '—',
  }));
}

export interface StGilesResidenceCard {
  name: string;
  /** Facts shared by every room of the residence. */
  facts: Array<{ label: string; value: string }>;
  rooms: Array<{ room: string; price: string }>;
  note?: string;
}

/** One card per residence; its room types are listed with their weekly prices. */
export function stGilesResidenceCards(campus: StGilesCampusId): StGilesResidenceCard[] {
  const residences = ST_GILES_CAMPUSES[campus].residences;
  const names = [...new Set(residences.map(item => item.name))];
  return names.map(name => {
    const items = residences.filter(item => item.name === name);
    const same = (value: (item: typeof items[number]) => string) => new Set(items.map(value)).size === 1;
    const sameMeals = same(item => item.meals);
    const first = items[0];
    const notes = new Set<string>();
    items.forEach(item => {
      if (item.window) notes.add(`只在${monthDay(item.window.start)}–${monthDay(item.window.end)}开放`);
      if (item.offPeakLong !== undefined) notes.add(`非暑期住满${item.offPeakLongWeeks}周每周${gbp(item.offPeakLong)}`);
      if (item.offPeak === null && !item.window) notes.add(`${item.room}暑期以外的价格需学校单独报价`);
      if (item.breakfastPerWeek) notes.add(`可加学校咖啡厅早餐，每周${gbp(item.breakfastPerWeek)}`);
    });
    return {
      name,
      facts: [
        { label: '年龄', value: same(item => item.ageText) ? first.ageText : items.map(item => item.ageText).join('／') },
        ...(sameMeals ? [{ label: '餐食', value: first.meals }] : []),
        { label: '位置', value: first.distance },
      ],
      rooms: items.map(item => ({
        room: sameMeals ? item.room : `${item.room.replace(/，含早晚餐/, '')}·${item.meals}`,
        price: item.window ? `每周${gbp(item.peak ?? 0)}` : peakText(item.offPeak, item.peak),
      })),
      note: [...notes].join('；') || undefined,
    };
  });
}

export interface StGilesJuniorCard {
  id: StGilesJuniorCentre['id'];
  name: string;
  isNew: boolean;
  facts: Array<{ label: string; value: string }>;
  residential: string;
  dayOnly: string;
  excursions: string;
  sampleWeek: string;
  evenings: string;
  extra?: string;
  campusLink?: string;
}

export function stGilesJuniorCards(centres: StGilesJuniorCentre[]): StGilesJuniorCard[] {
  return centres.map(centre => ({
    id: centre.id,
    name: centre.name,
    isNew: !!centre.isNew,
    facts: [
      { label: '年龄', value: `${centre.ages}，英语${centre.level}` },
      { label: '日期', value: centre.fixedWeeks
        ? `${monthDay(centre.start)}–${monthDay(centre.end)}，固定${centre.fixedWeeks}周`
        : `${monthDay(centre.start)}–${monthDay(centre.end)}，1周起报` },
      { label: '地点', value: `${centre.city}·${centre.venue}` },
      { label: '住宿', value: centre.id === 'brighton-homestay' ? centre.stay : `${centre.stay}；${centre.bathroom}` },
      { label: '规模', value: centre.capacity },
    ],
    residential: `${centre.id === 'brighton-homestay' ? '寄宿家庭' : '住校'}全包每周${gbp(centre.residential)}`,
    dayOnly: `走读每周${gbp(centre.dayOnly)}`,
    excursions: centre.excursions,
    sampleWeek: centre.sampleWeek,
    evenings: centre.evenings,
    extra: centre.sports?.map(item => `${item.name}每周${gbp(item.price)}`).join('；'),
    campusLink: centre.campus ? `/overseas-study-tour/uk/st-giles/${centre.campus}` : undefined,
  }));
}

export function stGilesFamilyCard(campus: StGilesCampusId) {
  const family = ST_GILES_CAMPUSES[campus].family;
  return {
    facts: [
      { label: '孩子年龄', value: family.ages },
      { label: '日期', value: `${monthDay(family.start)}–${monthDay(family.end)}，1周起报` },
      { label: '课程', value: '孩子每周20节，09:00–13:00，每班最多15人' },
      { label: '活动', value: `每周3个下午活动＋1次全天出游；例如${family.activities}` },
    ],
    rows: [
      { label: '孩子全包（寄宿家庭、早餐、午餐、课程、活动）', price: `每周${gbp(family.childFull)}` },
      { label: '家长全包（寄宿家庭、早餐、午餐、活动，不上课）', price: `每周${gbp(family.adultHomestay)}` },
      { label: '不住宿：孩子课程＋活动＋午餐', price: `每周${gbp(family.childDayPlus)}` },
      { label: '不住宿：孩子课程＋活动', price: `每周${gbp(family.childDayOnly)}` },
      { label: '不住宿：家长活动＋午餐', price: `每周${gbp(ST_GILES_FAMILY_COMMON.adultNoHomestay)}` },
      { label: '不住宿：家长只参加活动', price: `每周${gbp(ST_GILES_FAMILY_COMMON.adultSocialOnly)}` },
    ],
    note: `每个家庭另收注册费${gbp(ST_GILES_FAMILY_COMMON.registrationPerFamily)}，住寄宿家庭再收住宿安排费${gbp(ST_GILES_FAMILY_COMMON.placementPerFamily)}；`
      + `寄宿家庭可升级早晚餐，每人每周${gbp(ST_GILES_FAMILY_COMMON.halfBoardPerPerson)}。`,
  };
}

export function stGilesFeeRows(campus: StGilesCampusId): Array<{ item: string; amount: string; note: string }> {
  const pricing = ST_GILES_CAMPUSES[campus];
  const transfers = pricing.transfers;
  return [
    { item: '注册费', amount: gbp(ST_GILES_FEES.registration), note: '成人课程一次性收取' },
    { item: '住宿安排费', amount: gbp(ST_GILES_FEES.accommodationPlacement), note: '订学校住宿时一次性收取' },
    { item: '暑期课程附加费', amount: `每周${gbp(ST_GILES_FEES.highSeasonSupplement)}`,
      note: `${monthDay(ST_GILES_FEES.highSeasonStart)}–${monthDay(ST_GILES_FEES.highSeasonEnd)}上小组课的周` },
    { item: '机场接送机', amount: `单程${gbp(Math.min(...transfers.map(item => item.price)))}起`,
      note: `${transfers.map(item => `${item.name.replace(/机场$|火车站$/, '')}${item.price}`).join('、')}英镑；${pricing.transferNote}` },
    { item: '教材', amount: pricing.materials, note: '按实际使用的教材购买' },
    { item: '特殊饮食', amount: `每周${gbp(ST_GILES_FEES.specialDiet)}`, note: '寄宿家庭素食以外的特殊饮食要求' },
    { item: '雅思考试', amount: `${gbp(ST_GILES_FEES.ieltsExamFrom)}起`, note: '在英国参加考试，按考点实际收费' },
  ];
}

export const ST_GILES_CAMPUS_NAV = [
  { target: 'overview', label: '概况', icon: 'info' },
  { target: 'gallery', label: '照片', icon: 'photo_library' },
  { target: 'videos', label: '视频', icon: 'smart_display' },
  { target: 'adult', label: '课程', icon: 'menu_book' },
  { target: 'stay', label: '住宿', icon: 'hotel' },
  { target: 'summer', label: '暑期', icon: 'wb_sunny' },
  { target: 'quote', label: '报价', icon: 'calculate' },
  { target: 'faq', label: '问答', icon: 'help' },
  { target: 'contact', label: '顾问', icon: 'support_agent' },
];

export const ST_GILES_HUB_NAV = [
  { target: 'campuses', label: '校区', icon: 'location_on' },
  { target: 'compare', label: '对比', icon: 'compare_arrows' },
  { target: 'videos', label: '视频', icon: 'smart_display' },
  { target: 'junior', label: '夏校', icon: 'wb_sunny' },
  { target: 'family', label: '亲子', icon: 'family_restroom' },
  { target: 'quote', label: '报价', icon: 'calculate' },
  { target: 'faq', label: '问答', icon: 'help' },
  { target: 'service', label: '服务', icon: 'verified' },
  { target: 'contact', label: '顾问', icon: 'support_agent' },
];

/** Family-course summary for the overview page. */
export const ST_GILES_FAMILY_ROWS = ST_GILES_CAMPUS_ORDER.map(id => {
  const family = ST_GILES_CAMPUSES[id].family;
  return {
    id,
    name: ST_GILES_CAMPUS_PROFILES[id].name,
    ages: family.ages,
    dates: `${monthDay(family.start)}–${monthDay(family.end)}`,
    child: `每周${gbp(family.childFull)}`,
    adult: `每周${gbp(family.adultHomestay)}`,
  };
});

/** One entry per city in the UK study-tour list, so a student picking a city sees every St Giles option there. */
export interface StGilesTourSchool {
  name: string;
  city: string;
  route: string;
  fragment?: string;
  image?: string;
  text: string;
  tags: string[];
}

export function stGilesTourSchools(): StGilesTourSchool[] {
  const campuses = ST_GILES_CAMPUS_ORDER.map((id): StGilesTourSchool => {
    const profile = ST_GILES_CAMPUS_PROFILES[id];
    const hero = profile.gallery.find(image => image.src.endsWith(`/${profile.heroPhoto}.jpg`)) ?? profile.gallery[0];
    return {
      name: `St Giles ${profile.name}`,
      city: profile.city,
      route: `/overseas-study-tour/uk/st-giles/${id}`,
      image: hero?.src,
      text: profile.cardText,
      tags: [`${ST_GILES_CAMPUSES[id].minAge}岁以上全年课程`, ...profile.tags.slice(2, 3).map(tag => tag.text),
        ...(ST_GILES_JUNIOR_CENTRES.some(centre => centre.campus === id) ? ['暑期青少年夏校'] : []), '暑期亲子课程'],
    };
  });
  // Canterbury and Oxford only run summer centres, shown on the overview page.
  const summerOnly = ST_GILES_JUNIOR_CENTRES.filter(centre => !centre.campus).map((centre): StGilesTourSchool => {
    const photo = ST_GILES_JUNIOR_GALLERY.find(image => image.src.includes(`/${centre.id}-junior-`));
    return {
      name: `St Giles ${centre.name}`,
      city: centre.city,
      route: '/overseas-study-tour/uk/st-giles',
      fragment: `junior-${centre.id}`,
      image: photo?.src,
      text: `${centre.venue}，${monthDay(centre.start)}–${monthDay(centre.end)}暑期开放；课程、住宿、三餐、活动和出游全包。`,
      tags: ['仅暑期', centre.ages, '住校全包'],
    };
  });
  return [...campuses, ...summerOnly];
}
