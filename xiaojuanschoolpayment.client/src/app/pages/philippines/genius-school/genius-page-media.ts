// Genius English Academy photos, videos and room profiles for the shared Philippine school page.
// Every file comes from the school's own 2026-11 media pack (docs/genius-source-2026-11-25.md lists the sources and cuts).
// Keep it pure data (no Angular, DOM or storage) so the WeChat mini program can reuse it.
import type { GalleryImage } from '../cia-school/cia-page-content';
import type { PhAlbumCategory, PhRoomProfile, PhVideoItem, PhVideoTab } from '../school-page/ph-school-profile';

const asset = (folder: string, file: string) => `assets/genius/${folder}/${file}.webp`;
const campus = (file: string) => asset('campus', file);
const food = (file: string) => asset('food', file);
const classes = (file: string) => asset('classes', file);
const activities = (file: string) => asset('activities', file);
const rooms = (file: string) => asset('rooms', file);

/** The photo at the top of the quote image. */
export const GENIUS_QUOTE_IMAGE_HERO = `/${campus('common-area-01')}`;

/**
 * Only Genius's own photos, each labelled with what it surely shows. Left out: the passageway photo (a hotel sign
 * shows in its window reflection), the left edge of one courtyard photo (a hotel sign) and the right part of the
 * lobby panorama (an unprovable "No.1" sign).
 */
export const GENIUS_GALLERY_IMAGES: GalleryImage[] = [
  { category: '校园', title: '校园广场', description: '宿舍楼前的广场和旗杆。', src: campus('common-area-01') },
  { category: '校园', title: '广场与宿舍楼', description: '宿舍楼前的花园广场。', src: campus('common-area-02') },
  { category: '校园', title: '宿舍楼外', description: '宿舍楼和楼前的步道。', src: campus('common-area-03') },
  { category: '校园', title: '校园花园', description: '宿舍楼之间的花园和步道。', src: campus('common-area-04') },
  { category: '校园', title: '大堂入口', description: 'Genius 大堂入口。', src: campus('main-lobby') },
  { category: '校园', title: '游泳池', description: '校内游泳池，池边有躺椅和树荫。', src: campus('pool-01') },
  { category: '校园', title: '泳池边', description: '游泳池和池边的草地。', src: campus('pool-02') },
  { category: '校园', title: '海滩', description: '离宿舍几步路的海滩，每天08:00–18:00开放。', src: campus('beach-01') },
  { category: '校园', title: '海边', description: '海滩边的树荫和海水。', src: campus('beach-02') },
  { category: '校园', title: '海湾景色', description: '从海滩看出去的海湾。', src: campus('beach-03') },
  { category: '校园', title: '课后活动', description: '晚上的团队游戏。', src: activities('after-class-01') },
  { category: '校园', title: '课后活动', description: '学生和老师一起玩的互动游戏。', src: activities('after-class-02') },
  { category: '校园', title: '桌球比赛', description: '学校办的桌球比赛。', src: activities('billiards') },
  { category: '教室', title: '一对一教室', description: '一对一课的小教室。', src: campus('one-to-one-01') },
  { category: '教室', title: '一对一教室', description: '小教室里有书桌和白板。', src: campus('one-to-one-02') },
  { category: '教室', title: '一对一上课', description: '学生和老师一对一上课。', src: classes('one-to-one') },
  { category: '教室', title: '孩子的一对一课', description: '亲子课程的孩子上一对一课。', src: classes('kid-one-to-one') },
  { category: '教室', title: '外教小组课', description: '孩子们和外教上小组课。', src: classes('kid-group-native') },
  { category: '教室', title: '孩子的美术课', description: '亲子课程的特色课。', src: classes('kid-art') },
  { category: '教室', title: '小组课教室', description: '小组课用的大桌教室。', src: campus('group-class-01') },
  { category: '教室', title: '小组课教室', description: '另一间小组课教室。', src: campus('group-class-02') },
  { category: '教室', title: '小组课教室', description: '墙上有地图和装饰画的小组课教室。', src: campus('group-classroom') },
  { category: '教室', title: '教室走廊', description: '一对一教室所在的走廊。', src: campus('classroom-hallway') },
  { category: '教室', title: '安静自习室', description: '用来做分级测试和安静学习。', src: campus('silent-study') },
  { category: '教室', title: '自习室', description: '可以写作业和自学的大自习室。', src: campus('study-room') },
  { category: '教室', title: '自习室座位', description: '靠墙的长桌座位。', src: campus('study-hall') },
  { category: '住宿', title: '双人间', description: '两张单人床，有空调和阳台。', src: rooms('double-01') },
  { category: '住宿', title: '三人间', description: '三张单人床的房间。', src: rooms('triple-01') },
  { category: '住宿', title: '四人间', description: '四张单人床的房间。', src: rooms('quad-01') },
  { category: '住宿', title: '海景双人间', description: '两张单人床，有沙发和厨房。', src: rooms('double-sea-01') },
  { category: '住宿', title: '海景房阳台', description: '海景房阳台看出去的海湾。', src: rooms('double-sea-view') },
  { category: '住宿', title: '宿舍楼大厅', description: '宿舍楼一层大厅。', src: campus('hall-01') },
  { category: '住宿', title: '宿舍楼大厅', description: '大厅和楼梯。', src: campus('hall-02') },
  { category: '餐厅', title: '学生餐厅', description: '靠窗的学生餐厅。', src: campus('cafeteria-01') },
  { category: '餐厅', title: '学生餐厅', description: '餐厅的长桌座位。', src: campus('cafeteria-02') },
  { category: '餐厅', title: '学生餐厅', description: '餐厅另一侧。', src: campus('cafeteria-03') },
  { category: '餐厅', title: '餐厅座位', description: '餐厅和窗外的花园。', src: campus('dining-hall') },
  { category: '餐厅', title: '自助餐台', description: '三餐是自助餐。', src: campus('buffet') },
  { category: '餐厅', title: '餐食', description: '学校餐厅的炒面。', src: food('noodles') },
  { category: '餐厅', title: '餐食', description: '学校餐厅的小披萨。', src: food('pizza') },
  { category: '餐厅', title: '餐食', description: '学校餐厅的清蒸鱼。', src: food('steamed-fish') },
  { category: '餐厅', title: '餐食', description: '学校餐厅的炖菜。', src: food('stew') },
  { category: '设施', title: '前台', description: '新大堂的前台。', src: campus('reception') },
  { category: '设施', title: '新大堂', description: '前台旁的休息区。', src: campus('new-lobby-01') },
  { category: '设施', title: '新大堂', description: '大堂里的桌椅。', src: campus('new-lobby-02') },
  { category: '设施', title: '休息区', description: '有沙发和电视的公共休息区。', src: campus('lounge-01') },
  { category: '设施', title: '休息区', description: '休息区另一角。', src: campus('lounge-02') },
  { category: '设施', title: '健身房', description: '校内健身房。', src: campus('gym-01') },
  { category: '设施', title: '健身房', description: '跑步机和健身器械。', src: campus('gym-02') },
  { category: '设施', title: '游戏休闲区', description: '有桌上足球和桌球。', src: campus('game-room') },
  { category: '设施', title: '小吧台', description: '休闲区的小吧台。', src: campus('mini-bar') },
  { category: '设施', title: '休闲室', description: '有沙发、电视和飞镖。', src: campus('bar-lounge') },
  { category: '设施', title: '活动大厅', description: '办活动用的大厅。', src: campus('activity-hall') },
  { category: '设施', title: '会议室', description: '会议室。', src: campus('conference-room') },
  { category: '设施', title: '诊所', description: '校内诊所每周开放两次，有医生问诊。', src: campus('clinic') },
];

export const GENIUS_ALBUM_DESCRIPTIONS: Record<PhAlbumCategory, string> = {
  校园: '校园广场、泳池、海滩与课后活动',
  教室: '一对一、小组课、孩子的课和自习室',
  住宿: '各房型与宿舍楼',
  餐厅: '学生餐厅与自助餐',
  设施: '大堂、休息区、健身房、活动大厅与诊所',
};

/**
 * A video from Genius's own media pack. The campus tour is cut before its closing frame with the school's
 * website. Left out: the school's partner-school video, the version made for another market, the long
 * introduction films and the weekend-trip clips (other companies' boats and signs).
 */
interface GeniusVideo {
  name: string;
  title: string;
  text: string;
  duration: string;
  shape: PhVideoItem['shape'];
}

const video = (item: GeniusVideo): PhVideoItem => ({
  title: item.title,
  text: item.text,
  src: `/assets/genius/videos/${item.name}.mp4`,
  poster: `/assets/genius/videos/poster-${item.name}.jpg`,
  duration: item.duration,
  shape: item.shape,
});

const CAMPUS_TOUR = video({ name: 'campus-tour', title: 'Genius 校园一览', text: '大堂、前台、餐厅、咖啡吧、休闲区、健身房、一对一教室和自习室。', duration: '0:30', shape: 'tall' });
const FUN_GAMES = video({ name: 'fun-games', title: '晚间趣味活动', text: '学生晚上在校园广场玩团队游戏。', duration: '0:41', shape: 'tall' });
const GENERAL_ENGLISH = video({ name: 'general-english', title: '一般英语课程介绍', text: '学校老师介绍一般英语课程，英文原声；可以看到一对一上课和课上用的教材。', duration: '0:33', shape: 'wide' });
const BUSINESS_ENGLISH = video({ name: 'business-english', title: '商务英语课程介绍', text: '学校老师介绍商务英语课程，英文原声；可以看到演讲练习和小组课。', duration: '0:32', shape: 'wide' });
const TOEIC = video({ name: 'toeic', title: '托业备考课程介绍', text: '学校老师介绍托业备考课程，英文原声。', duration: '0:19', shape: 'wide' });
const FAMILY_PROGRAM = video({ name: 'family-program', title: '亲子课程介绍', text: '学校老师介绍亲子课程，英文原声；可以看到孩子的小组课、美术课和一对一课。', duration: '0:25', shape: 'wide' });
const ONE_TO_ONE = video({ name: 'one-to-one', title: '一对一课堂', text: '不同年龄的学生上一对一课。', duration: '0:30', shape: 'wide' });
const KID_READING = video({ name: 'kid-reading', title: '6岁孩子的一对一阅读课', text: '6岁的孩子和老师一对一读英语绘本。', duration: '0:25', shape: 'wide' });
const GROUP_CLASS = video({ name: 'group-class', title: '外教小组课', text: '外教带的小组课。', duration: '0:21', shape: 'tall' });
const ROOM_DOUBLE_SEA = video({ name: 'room-double-sea', title: '海景双人间（604房）', text: '两张单人床、沙发、餐桌、厨房和卫浴。', duration: '0:21', shape: 'wide' });
const ROOM_TRIPLE = video({ name: 'room-triple', title: '三人间（713房）', text: '床、三套书桌椅、小厨房和卫浴，阳台外是校园广场。', duration: '0:38', shape: 'wide' });
const DINNER = video({ name: 'dinner', title: '学校餐厅晚餐', text: '自助餐形式的晚餐。', duration: '0:57', shape: 'tall' });

/** Videos in the hero album; the campus tour opens it. */
export const GENIUS_VIDEO_TABS: PhVideoTab[] = [
  { label: '校园视频', icon: 'videocam', items: [CAMPUS_TOUR, FUN_GAMES] },
  { label: '课程视频', icon: 'videocam', items: [GENERAL_ENGLISH, BUSINESS_ENGLISH, TOEIC, FAMILY_PROGRAM] },
  { label: '课堂视频', icon: 'videocam', items: [ONE_TO_ONE, KID_READING, GROUP_CLASS] },
  { label: '宿舍视频', icon: 'videocam', items: [ROOM_DOUBLE_SEA, ROOM_TRIPLE] },
  { label: '餐厅视频', icon: 'videocam', items: [DINNER] },
];

/** Each room clip shows exactly the room type whose album it opens. */
export const GENIUS_ROOM_VIDEOS: Record<string, PhVideoItem> = {
  'double-sea': ROOM_DOUBLE_SEA,
  triple: ROOM_TRIPLE,
};

const ROOM_FACTS = ['小厨房、冰箱、空调、WiFi', '阳台、冷热水淋浴、保险箱', '含三餐'];
const ROOM_SERVICE = '每周打扫2次、洗衣2次，床单每周换1次';

/**
 * Genius changes a room's type by adding or removing beds (school brochure), so each profile shows one room
 * whose photos show that many beds, desks and safes. Photos are per room number in the school's pack.
 */
export const GENIUS_ROOM_PROFILES: PhRoomProfile[] = [
  {
    id: 'single', label: '单人间', englishName: 'SINGLE ROOM', location: '校内', bed: '一张床', service: ROOM_SERVICE,
    suitable: '想要自己空间的学员', note: '照片为514房。', highlights: ROOM_FACTS,
    image: rooms('single-01'), gallery: [rooms('single-01'), rooms('single-02'), rooms('single-bath')],
    imageAlt: 'Genius单人间实景', rateIds: ['single'],
  },
  {
    id: 'double', label: '双人间', englishName: 'DOUBLE ROOM', location: '校内', bed: '两张单人床', service: ROOM_SERVICE,
    suitable: '想有室友练口语、也想控制预算的学员', note: '照片为201B房。', highlights: ROOM_FACTS,
    image: rooms('double-01'),
    gallery: [rooms('double-01'), rooms('double-02'), rooms('double-desk'), rooms('double-kitchen'), rooms('double-bath')],
    imageAlt: 'Genius双人间实景', rateIds: ['double'],
  },
  {
    id: 'triple', label: '三人间', englishName: 'TRIPLE ROOM', location: '校内', bed: '三张单人床', service: ROOM_SERVICE,
    suitable: '结伴报名或想省住宿费的学员', note: '照片和视频为713房。', highlights: ROOM_FACTS,
    image: rooms('triple-01'),
    gallery: [rooms('triple-01'), rooms('triple-02'), rooms('triple-03'), rooms('triple-kitchen'), rooms('triple-bath')],
    imageAlt: 'Genius三人间实景', rateIds: ['triple'],
  },
  {
    id: 'quad', label: '四人间', englishName: 'QUAD ROOM', location: '校内', bed: '四张单人床，或两张上下铺', service: ROOM_SERVICE,
    suitable: '预算优先的学员', note: '前三张为401房（四张单人床），最后一张为606房（两张上下铺）。', highlights: ROOM_FACTS,
    image: rooms('quad-01'), gallery: [rooms('quad-01'), rooms('quad-02'), rooms('quad-bath'), rooms('quad-bunk')],
    imageAlt: 'Genius四人间实景', rateIds: ['quad'],
  },
  {
    id: 'single-sea', label: '海景单人间', englishName: 'SEA VIEW SINGLE', location: '校内', bed: '一张床', service: ROOM_SERVICE,
    suitable: '想看海、要自己空间的学员', note: '照片为404房。海景房视空房安排，空调为分体式或窗式。', highlights: ROOM_FACTS,
    image: rooms('single-sea-01'),
    gallery: [rooms('single-sea-01'), rooms('single-sea-02'), rooms('single-sea-kitchen'), rooms('single-sea-bath'), rooms('single-sea-view')],
    imageAlt: 'Genius海景单人间实景', rateIds: ['single-sea'],
  },
  {
    id: 'double-sea', label: '海景双人间', englishName: 'SEA VIEW DOUBLE', location: '校内', bed: '两张单人床', service: ROOM_SERVICE,
    suitable: '两人结伴、想看海的学员', note: '照片和视频为604房。海景房视空房安排，空调为分体式或窗式。', highlights: ROOM_FACTS,
    image: rooms('double-sea-01'),
    gallery: [rooms('double-sea-01'), rooms('double-sea-02'), rooms('double-sea-bath'), rooms('double-sea-view')],
    imageAlt: 'Genius海景双人间实景', rateIds: ['double-sea'],
  },
  {
    id: 'triple-sea', label: '海景三人间', englishName: 'SEA VIEW TRIPLE', location: '校内', bed: '三张单人床', service: ROOM_SERVICE,
    suitable: '结伴报名、想看海的学员', note: '照片为716房。海景房视空房安排，空调为分体式或窗式。', highlights: ROOM_FACTS,
    image: rooms('triple-sea-01'),
    gallery: [rooms('triple-sea-01'), rooms('triple-sea-02'), rooms('triple-sea-bath'), rooms('triple-sea-view')],
    imageAlt: 'Genius海景三人间实景', rateIds: ['triple-sea'],
  },
  {
    id: 'quad-sea', label: '海景四人间', englishName: 'SEA VIEW QUAD', location: '校内', bed: '两张上下铺', service: ROOM_SERVICE,
    suitable: '预算优先、想看海的学员', note: '照片为605B房。海景房视空房安排，空调为分体式或窗式。', highlights: ROOM_FACTS,
    image: rooms('quad-sea-01'),
    gallery: [rooms('quad-sea-01'), rooms('quad-sea-desk'), rooms('quad-sea-bath'), rooms('quad-sea-view')],
    imageAlt: 'Genius海景四人间实景', rateIds: ['quad-sea'],
  },
];
