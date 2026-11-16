// Sida Qihang consultants shown in school-page contact sections. One list for the website pages
// that use it and for every school page in the WeChat mini program
// (src/app/mini-program/shared-sections.ts). Pure data only.

export interface SidaConsultant {
  title: string;
  name: string;
  description: string;
  phone: string;
  phoneHref: string;
  avatarSrc: string;
  qrSrc: string;
  buttonLabel: string;
}

export const SIDA_PHILIPPINES_CONSULTANTS: SidaConsultant[] = [
  {
    title: '英爱留学规划',
    name: 'Jenny',
    description:
      '适合爱尔兰/英国本科、硕士、预科、半工半读，以及后续升学规划。',
    phone: '132 4982 7686',
    phoneHref: 'tel:13249827686',
    avatarSrc: '/assets/contact/jenny-avatar.jpg',
    qrSrc: '/assets/contact/jenny-wechat-qr.png',
    buttonLabel: '咨询英爱留学',
  },
  {
    title: '多国家方案规划',
    name: 'Lemon',
    description: '适合还没确定国家，想比较费用、时间、路线和升学路径。',
    phone: '132 9852 9856',
    phoneHref: 'tel:13298529856',
    avatarSrc: '/assets/contact/lemon-avatar-jpg.webp?v=20260901',
    qrSrc: '/assets/contact/lemon-wechat-qr.png',
    buttonLabel: '咨询多国方案',
  },
  {
    title: '菲律宾与东南亚游学',
    name: 'Penin',
    description: '适合 CIA 菲律宾游学、马来西亚、新加坡、越南短期英语课程。',
    phone: '153 6765 9331',
    phoneHref: 'tel:15367659331',
    avatarSrc: '/assets/contact/penin-avatar.jpg',
    qrSrc: '/assets/contact/penin-wechat-qr.png',
    buttonLabel: '咨询游学方案',
  },
];
