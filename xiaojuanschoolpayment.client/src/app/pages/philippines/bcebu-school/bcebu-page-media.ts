// Photos and videos of the B'Cebu page, in public/assets/bcebu/: photos and the first nine videos from B'Cebu's own
// media library (received 2026-11-23), plus the user's own vertical clips filmed at the school (received
// 2026-11-24). Every item shows exactly what its label says; other businesses in the building, the older campus
// photos and anything with contact details or another company's name were left out. Keep it pure data.
import type { CiaShortVideo, CiaVideoCard, GalleryImage } from '../cia-school/cia-page-content';
import type { PhAlbumCategory, PhRoomProfile, PhVideoItem, PhVideoTab } from '../school-page/ph-school-profile';

const asset = (path: string) => `assets/bcebu/${path}.webp`;

const photo = (category: GalleryImage['category'], title: string, description: string, path: string): GalleryImage =>
  ({ category, title, description, src: asset(path) });

// Left out (2026-11-24): photos showing shop, café, bar, hotel or brand signs (some pool, basketball, dining and
// gym shots, the boxing area), cartoon toys in the kids centre, blurred shots and extreme food close-ups. Two
// photos were cropped to remove a sign at the edge (pool-01 top, dining-hall-02 left).
export const BCEBU_GALLERY_IMAGES: GalleryImage[] = [
  photo('校园', '学校大楼航拍', '白色主楼和周边，远处是大海。', 'campus-building'),
  photo('校园', '主楼另一侧', '从另一个角度看主楼，楼前是街道和球场。', 'campus/building-01'),
  photo('校园', '前台', "学校前台，新生报到和日常事务在这里办理。", 'campus/reception-01'),
  photo('校园', '自习室', '长桌和大窗，课后可以在这里自习。', 'campus/study-hall-01'),
  photo('校园', '休闲区', '台球桌和乒乓球桌。', 'campus/recreation-01'),
  photo('教室', '一对一教室', '小隔间里一对一上课。', 'classes/one-on-one-01'),
  photo('教室', '一对一课', '老师和学生一起看课本。', 'classes/one-on-one-02'),
  photo('教室', '一对一教室', '每个隔间一张小桌，老师和学生面对面。', 'classes/one-on-one-03'),
  photo('教室', '小组课', '老师带四名学生在长桌上课。', 'classes/group-01'),
  photo('教室', '小组课', '学生举手发言，前面是教学屏幕。', 'classes/group-02'),
  photo('教室', '外教课', '外教在白板前讲课。', 'classes/native-01'),
  photo('教室', '外教课', '外教带学生做口语练习。', 'classes/native-02'),
  photo('教室', 'Speaking Prescription 教室', '墙上是口语说明和语法卡片。', 'classes/speaking-prescription-02'),
  photo('教室', '口语学习报告', '老师和学生在电脑前一起看口语学习报告。', 'classes/speaking-prescription-01'),
  photo('教室', '女生2+1宿舍', '两名女生和伙伴老师在宿舍里一起用课本练英语。', 'classes/2plus1-01'),
  photo('教室', '女生2+1宿舍', '宿舍里的英语练习时间。', 'classes/2plus1-02'),
  photo('住宿', '单人间', '一张大床和书桌，落地门外是阳台。', 'rooms/single-02'),
  photo('住宿', '单人间', '书桌、保险箱、小冰箱和衣帽架。', 'rooms/single-01'),
  photo('住宿', '双人间', '两张单人床、两套书桌。', 'rooms/twin-01'),
  photo('住宿', '双人间', '两张单人床，阳台有桌椅。', 'rooms/twin-03'),
  photo('住宿', '双人间+客厅', '客厅有沙发、茶几和书桌。', 'rooms/twin-living-01'),
  photo('住宿', '双人间+客厅', '卧室有两张单人床。', 'rooms/twin-living-02'),
  photo('住宿', '三人间', '一张上下铺加一张单人床，有阳台。', 'rooms/triple-01'),
  photo('住宿', '三人间', '三张书桌，置物架上有三个保险箱。', 'rooms/triple-04'),
  photo('餐厅', '自助餐区', '两侧是保温餐炉，学生在中间取餐。', 'dining/dining-hall-01'),
  photo('餐厅', '用餐大厅', '一排排木桌椅。', 'dining/dining-hall-02'),
  photo('餐厅', '现场炒面', '厨师在餐厅给学生分炒面。', 'dining/meal-01'),
  photo('餐厅', '碗装拌面', '一排配好鸡蛋和酱的拌面。', 'dining/meal-04'),
  photo('设施', '泳池', '池边有桌椅和遮阳伞，角落有儿童滑梯。', 'facilities/pool-01'),
  photo('设施', '泳池', '池边的桌椅和遮阳伞。', 'facilities/pool-02'),
  photo('设施', '健身房', '跑步机、哑铃和力量器械。', 'facilities/gym-01'),
  photo('设施', '健身房', '哑铃架和力量器械。', 'facilities/gym-02'),
  photo('设施', '团体健身', '学员在地垫上用普拉提圈锻炼。', 'facilities/group-exercise-01'),
  photo('设施', '篮球场', '露天篮球场，篮架后是棕榈树。', 'facilities/basketball-01'),
  photo('设施', '篮球场', '篮球场在主楼旁边。', 'facilities/basketball-02'),
  photo('设施', 'Kids Center 幼儿中心', '彩色地垫、矮桌和书架。', 'facilities/kids-center-01'),
  photo('设施', 'Kids Center 手工课', '老师和孩子们围着矮桌做手工。', 'facilities/kids-center-02'),
  photo('设施', 'Kids Center 上课', '老师带孩子们看电脑学英语。', 'facilities/kids-center-03'),
  photo('设施', 'Kids Center 活动室', '宽敞的活动室，老师和孩子坐在地垫上。', 'facilities/kids-center-04'),
  photo('设施', '医务室', '病床和急救箱；周一至周五开放。', 'facilities/clinic-01'),
];

export const BCEBU_ALBUM_DESCRIPTIONS: Record<PhAlbumCategory, string> = {
  校园: '学校大楼与校园',
  教室: '一对一、小组和宿舍课教室',
  住宿: '单人间到三人间',
  餐厅: '学生餐厅与每日餐食',
  设施: '泳池、健身房、篮球场与幼儿中心',
};

/**
 * A B'Cebu video, transcoded to 720p H.264 (30 fps) in public/assets/bcebu/videos/. Opening and end
 * cards with contact details and anything showing another company were cut; check every frame of a new clip.
 * Landscape clips are big cards ('tour'); vertical clips go in the short-clip row ('life').
 */
export interface BCebuVideo {
  name: string;
  title: string;
  description: string;
  duration: string;
  orientation: 'landscape' | 'portrait';
  section: 'tour' | 'life';
  /** Badge on a big card. */
  label?: string;
  details?: string[];
}

export const bcebuVideoSrc = (video: BCebuVideo) => `/assets/bcebu/videos/${video.name}.mp4`;
export const bcebuVideoPoster = (video: BCebuVideo) => `/assets/bcebu/videos/poster-${video.name}.jpg`;

// Cut from the school's files (2026-11-24): shop and café signs, other companies' logos and uniforms, a QR-code
// poster, airline and food-court signs at the airport, a cartoon opening and "thanks for watching" end cards. A
// nationality clip (country labels including Taiwan), the golf range and B'Tral Park clips (businesses in the
// building, not the school) and clips ending in sign-up cards were left out.
export const BCEBU_VIDEOS: BCebuVideo[] = [
  {
    name: 'school-intro', title: "B'Cebu 学校介绍片", duration: '3:27', orientation: 'landscape', section: 'tour', label: 'SCHOOL FILM',
    description: "一支片子看完B'Cebu：教学区、餐厅、健身房、幼儿中心、各类宿舍房型，以及校内外活动。",
    details: ['教学区与公共设施', '宿舍房型与校内外活动'],
  },
  {
    name: 'campus-tour', title: '校园参观', duration: '1:44', orientation: 'landscape', section: 'tour', label: 'CAMPUS TOUR',
    description: '跟着两位学生走一遍前台、餐厅、运动场、图书馆、教室和单人间宿舍。',
    details: ['前台、餐厅与运动场', '图书馆、教室与单人间'],
  },
  {
    name: 'one-to-one-class', title: '一对一课堂', duration: '1:45', orientation: 'landscape', section: 'tour', label: '1:1 CLASS',
    description: '两节真实的一对一课：老师讲解近义词怎么用。',
    details: ['真实课堂片段', '英文原声，英文字幕'],
  },
  {
    name: 'airport-pickup', title: '机场接机', duration: '0:36', orientation: 'landscape', section: 'tour', label: 'AIRPORT PICKUP',
    description: '学校工作人员举牌在宿务机场接学生，坐学校的车回校。',
    details: ['宿务马克坦机场接机', '学校工作人员陪同'],
  },
  { name: 'meals', title: '学校餐食', duration: '0:48', orientation: 'portrait', section: 'life', description: '学校餐厅的自助餐：主菜、面食、汉堡、水果和饮料。' },
  { name: 'student-vlog', title: '学生的一天', duration: '0:57', orientation: 'portrait', section: 'life', description: '一位日本学生记录一天：宿舍起床、上课、午餐、跳舞和晚餐。' },
  { name: 'island-day', title: '海岛活动日', duration: '0:23', orientation: 'portrait', section: 'life', description: '学生坐船出海去小岛，在沙滩上做游戏。' },
  { name: 'ace-teacher', title: '老师自我介绍', duration: '0:20', orientation: 'portrait', section: 'life', description: '一位老师在学生休息区用英语介绍自己。' },
  { name: 'teacher-poses', title: '师生合影', duration: '0:18', orientation: 'portrait', section: 'life', description: '学生和老师在教学楼走廊里一起摆姿势拍照。' },
  // The user's own vertical clips filmed at B'Cebu (received 2026-11-24), checked frame by frame. Left out: the
  // campus-surroundings clip (a street banner and the guard's visitor logbook), the golf range (a business in the
  // building), and the one-to-one class and airport pickup clips, which repeat the school's videos above. The gym
  // clip stops at 6.5 s, before the boxing room with its brand sign and string of national flags.
  { name: 'room-single', title: '单人间实拍', duration: '0:14', orientation: 'portrait', section: 'life', description: '独立卫浴、单人床、书桌、小冰箱、衣帽架和带桌椅的阳台。' },
  { name: 'room-twin', title: '双人间实拍', duration: '0:17', orientation: 'portrait', section: 'life', description: '两张单人床、书桌、小冰箱和衣帽架，阳台有桌椅。' },
  { name: 'room-twin-living', title: '双人间+客厅实拍', duration: '0:33', orientation: 'portrait', section: 'life', description: '进门是客厅：长书桌、沙发和保险箱，阳台有桌椅；里面的卧室有两张单人床。' },
  { name: 'room-triple', title: '三人间实拍', duration: '0:37', orientation: 'portrait', section: 'life', description: '上下铺加一张单人床，独立卫浴、书桌、小冰箱，阳台有桌椅。' },
  { name: 'classes', title: '上课实拍', duration: '0:20', orientation: 'portrait', section: 'life', description: '一对一教室、小组课和大班课的上课场景。' },
  { name: 'dining-hall', title: '餐厅自助餐', duration: '0:38', orientation: 'portrait', section: 'life', description: '学生餐厅自助取餐：米饭、炒饭、肉菜、蔬菜、汤、水果和饮料。' },
  { name: 'reception', title: '教学区与前台', duration: '0:11', orientation: 'portrait', section: 'life', description: '教学区走廊、学生等候区和前台。' },
  { name: 'library', title: '图书馆与自习区', duration: '0:20', orientation: 'portrait', section: 'life', description: '图书馆的书架和自习桌，以及靠窗的自习区。' },
  { name: 'lounge', title: '二楼休息区', duration: '0:09', orientation: 'portrait', section: 'life', description: '二楼的沙发休息区。' },
  { name: 'pool', title: '泳池', duration: '0:22', orientation: 'portrait', section: 'life', description: '校内泳池和池边的桌椅、躺椅。' },
  { name: 'gym', title: '健身房', duration: '0:07', orientation: 'portrait', section: 'life', description: '健身房的器械区。' },
  { name: 'courts', title: '篮球场与乒乓球', duration: '0:14', orientation: 'portrait', section: 'life', description: '户外篮球场和室内乒乓球区。' },
  { name: 'sky-garden', title: '空中花园', duration: '0:20', orientation: 'portrait', section: 'life', description: '宿舍楼之间的空中花园，有草坪和桌椅。' },
];

const videoCard = (video: BCebuVideo): CiaVideoCard => ({
  code: "B'Cebu",
  label: video.label ?? "B'Cebu",
  title: video.title,
  text: video.description,
  poster: bcebuVideoPoster(video),
  videoSrc: bcebuVideoSrc(video),
  contentType: 'video/mp4',
  details: [...(video.details ?? []), `时长 ${video.duration}`],
});
const shortVideo = (video: BCebuVideo): CiaShortVideo => ({
  title: video.title,
  text: video.description,
  src: bcebuVideoSrc(video),
  poster: bcebuVideoPoster(video),
  duration: video.duration,
  ...(video.orientation === 'landscape' ? { shape: 'wide' as const } : {}),
});
const albumVideo = (name: string): PhVideoItem => {
  const video = BCEBU_VIDEOS.find(item => item.name === name) as BCebuVideo;
  return {
    title: video.title,
    text: video.description,
    src: bcebuVideoSrc(video),
    poster: bcebuVideoPoster(video),
    duration: video.duration,
    shape: video.orientation === 'landscape' ? 'wide' : 'tall',
  };
};
const videosIn = (section: BCebuVideo['section']) => BCEBU_VIDEOS.filter(video => video.section === section);

export const BCEBU_VIDEO_CARDS: CiaVideoCard[] = videosIn('tour').map(videoCard);
export const BCEBU_CAMPUS_LIFE_VIDEOS: CiaShortVideo[] = videosIn('life').map(shortVideo);

/**
 * Videos in the hero album, one chip per topic; the school film opens the album. Four short chip names, so the
 * video chips stay on one row on a 360px phone.
 */
export const BCEBU_VIDEO_TABS: PhVideoTab[] = [
  {
    label: '校园视频',
    names: ['school-intro', 'campus-tour', 'reception', 'library', 'lounge', 'pool', 'gym', 'courts', 'sky-garden', 'teacher-poses'],
  },
  { label: '宿舍视频', names: ['room-single', 'room-twin', 'room-twin-living', 'room-triple'] },
  { label: '课程视频', names: ['one-to-one-class', 'classes', 'ace-teacher'] },
  { label: '生活视频', names: ['meals', 'dining-hall', 'student-vlog', 'island-day', 'airport-pickup'] },
].map(tab => ({ label: tab.label, icon: 'videocam', items: tab.names.map(albumVideo) }));

/**
 * Room videos showing exactly one room type, keyed by room profile id; each opens that room's photo album. The
 * triple-room clip also stands for the 2+1 dorm, which uses the same rooms.
 */
export const BCEBU_ROOM_VIDEOS: Record<string, PhVideoItem> = {
  single: albumVideo('room-single'),
  'twin-living': albumVideo('room-twin-living'),
  twin: albumVideo('room-twin'),
  triple: albumVideo('room-triple'),
};

/**
 * No `variants`: B'Cebu has no booking codes, so the template would show a variant's internal room id as its badge.
 * Each profile's note names the price cards it covers instead.
 */
const roomProfile = (
  id: string, label: string, gallery: string[], suitable: string, note: string, highlights: string[], rateIds: readonly string[],
): PhRoomProfile => ({
  id, label, location: '校内', suitable, note, highlights, rateIds,
  image: asset(gallery[0] ?? ''), gallery: gallery.map(asset), imageAlt: `B'Cebu${label}实景`,
});

const ROOM_HIGHLIGHTS = ['一日三餐，周末也供应', '空调、热水器', '每周打扫2次（预约）'];

/** Photos come only from B'Cebu's own room folders and match the labelled room. */
export const BCEBU_ROOM_PROFILES: PhRoomProfile[] = [
  roomProfile('single', '单人间', ['rooms/single-02', 'rooms/single-01', 'rooms/single-03', 'rooms/single-05', 'rooms/single-04'], '重视隐私、需要安静学习空间的学生',
    '一人一间，分花园景和外景（朝马克坦新城）两种；50岁以上只可住单人间。', ROOM_HIGHLIGHTS,
    ['single-garden-view', 'single-newtown-view']),
  roomProfile('twin-living', '双人间+客厅', ['rooms/twin-living-01', 'rooms/twin-living-02', 'rooms/twin-living-03', 'rooms/twin-living-04'], '夫妻、亲子家庭或同行朋友（须同时报名）',
    '卧室外另有客厅；亲子3人（一位家长两个孩子，或两位家长一个孩子）可加床。旺季只接受家庭。', ROOM_HIGHLIGHTS,
    ['double-living-room', 'family-triple-extra-bed']),
  roomProfile('twin', '双人间', ['rooms/twin-01', 'rooms/twin-02', 'rooms/twin-03', 'rooms/twin-05', 'rooms/twin-04'], '朋友同行或想兼顾预算的学生', '两人一间。', ROOM_HIGHLIGHTS, ['double']),
  roomProfile('triple', '三人间', ['rooms/triple-01', 'rooms/triple-02', 'rooms/triple-03', 'rooms/triple-05', 'rooms/triple-04'], '预算优先的学生',
    '三人一间；同样的房间也用作女生2+1宿舍（淡季开放），在宿舍里也多练口语。', ROOM_HIGHLIGHTS,
    ['triple-bunk', 'two-plus-one']),
];
