/** Mirrors XiaoJuanSchoolPayment.Server/Data/DTO/BrowseAlertDTO.cs. */
export interface BrowseAlertLinkDTO {
  id: string;
  code: string;
  studentName: string;
  consultantName: string;
  note?: string | null;
  landingPath: string;
  landingPageName?: string | null;
  createdAt: string;
  active: boolean;
  lastViewedAt?: string | null;
  lastPageName?: string | null;
  viewCount: number;
  /** Sent from the WeCom chat sidebar. */
  fromWeCom?: boolean;
}

export interface SaveBrowseAlertLinkDTO {
  studentName: string;
  consultantName: string;
  note?: string | null;
  landingPath: string;
  active?: boolean;
}

export interface BrowseAlertViewDTO {
  path: string;
  pageName: string;
  viewedAt: string;
  notified: boolean;
}

export interface BrowseAlertPageDTO {
  path: string;
  name: string;
}

export interface BrowseAlertChannelDTO {
  consultantName: string;
  hasWebhook: boolean;
  webhookHint?: string | null;
  mention?: string | null;
  weComUserId?: string | null;
}

export interface SaveBrowseAlertChannelDTO {
  consultantName: string;
  /** Omit to keep the saved robot, '' to remove it. */
  webhookUrl?: string | null;
  mention?: string | null;
  weComUserId?: string | null;
}

/** The channel row that holds the robot shared by every consultant. */
export const SHARED_BROWSE_CHANNEL = 'default';

/** The WeCom self-built app as owner Admins see it; the secret itself is never returned. */
export interface WeComAppSettingDTO {
  corpId?: string | null;
  agentId?: number | null;
  hasSecret: boolean;
  secretHint?: string | null;
  complete: boolean;
  checkMessage?: string | null;
  checkOk?: boolean | null;
}

export interface SaveWeComAppSettingDTO {
  corpId?: string | null;
  agentId?: number | null;
  /** Omit to keep the saved secret, '' to remove it. */
  secret?: string | null;
}

export interface WeComSidebarConfigDTO {
  enabled: boolean;
  corpId?: string | null;
  agentId?: number | null;
}

export interface WeComSidebarSessionDTO {
  token?: string | null;
  consultantName?: string | null;
  weComUserId?: string | null;
}

export interface WeComSidebarSignatureDTO {
  corpId: string;
  agentId: number;
  timestamp: number;
  nonceStr: string;
  configSignature: string;
  agentSignature: string;
}

export interface WeComSidebarContactDTO {
  studentName: string;
  hasLink: boolean;
  linkActive: boolean;
  viewCount: number;
  recentViews: BrowseAlertViewDTO[];
}

export interface WeComSidebarCardDTO {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  tracked: boolean;
}

/** The page consultants open from the WeCom chat toolbar (BrowseAlertSidebarController.PagePath). */
export const WECOM_SIDEBAR_PATH = '/wecom-sidebar';
