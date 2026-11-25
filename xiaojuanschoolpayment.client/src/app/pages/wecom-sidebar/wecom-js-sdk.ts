import { WeComSidebarSignatureDTO } from '../../../interfaces/browse-alert.dto';

/**
 * The WeCom (企业微信) JS-SDK as the chat sidebar uses it. The SDK files come from WeCom's own servers
 * and are loaded only on the sidebar page. Browser-only: never call during prerendering.
 */
const SDK_FILES = [
  'https://res.wx.qq.com/open/js/jweixin-1.2.0.js',
  'https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js',
];
const JS_API_LIST = ['getContext', 'getCurExternalContact', 'sendChatMessage'];

interface WeComResult {
  err_msg?: string;
  [key: string]: unknown;
}

interface WeComJsSdk {
  config(options: Record<string, unknown>): void;
  ready(callback: () => void): void;
  error(callback: (result: WeComResult) => void): void;
  agentConfig(options: Record<string, unknown>): void;
  invoke(name: string, params: Record<string, unknown>, callback: (result: WeComResult) => void): void;
}

export interface WeComNewsCard {
  link: string;
  title: string;
  desc: string;
  imgUrl: string;
}

/** True inside the WeCom app (its browser adds "wxwork" to the user agent). */
export function isInsideWeCom(): boolean {
  return /wxwork/i.test(navigator.userAgent);
}

/** WeCom's silent sign-in: comes back to the sidebar with ?code=…, which the server exchanges for the account. */
export function weComOAuthUrl(corpId: string, agentId: number, returnUrl: string): string {
  const query = new URLSearchParams({
    appid: corpId,
    redirect_uri: returnUrl,
    response_type: 'code',
    scope: 'snsapi_base',
    state: 'sidebar',
    agentid: String(agentId),
  });
  return `https://open.weixin.qq.com/connect/oauth2/authorize?${query.toString()}#wechat_redirect`;
}

export class WeComJs {
  private constructor(private readonly sdk: WeComJsSdk) {}

  /** Loads the SDK and registers this page with the corp (wx.config) and the app (wx.agentConfig). */
  static async connect(sign: (url: string) => Promise<WeComSidebarSignatureDTO>): Promise<WeComJs> {
    for (const src of SDK_FILES) {
      await loadScript(src);
    }
    const sdk = (window as unknown as { wx?: WeComJsSdk }).wx;
    if (!sdk?.agentConfig) {
      throw new Error('企业微信工具没有加载成功，请关掉侧边栏再重新打开。');
    }

    // The signature must be for this exact address without the #fragment.
    const signature = await sign(window.location.href.split('#')[0]);

    // Newer WeCom versions need only agentConfig; older ones need config first, so try it briefly.
    await new Promise<void>((resolve) => {
      const timer = window.setTimeout(resolve, 4000);
      const done = () => {
        window.clearTimeout(timer);
        resolve();
      };
      sdk.ready(done);
      sdk.error(done);
      sdk.config({
        beta: true,
        debug: false,
        appId: signature.corpId,
        timestamp: signature.timestamp,
        nonceStr: signature.nonceStr,
        signature: signature.configSignature,
        jsApiList: JS_API_LIST,
      });
    });

    await new Promise<void>((resolve, reject) => {
      sdk.agentConfig({
        corpid: signature.corpId,
        agentid: String(signature.agentId),
        timestamp: signature.timestamp,
        nonceStr: signature.nonceStr,
        signature: signature.agentSignature,
        jsApiList: JS_API_LIST,
        success: () => resolve(),
        fail: (result: WeComResult) => reject(new Error(describeFailure('agentConfig', result))),
      });
    });
    return new WeComJs(sdk);
  }

  /** Where the sidebar was opened: single_chat_tools, group_chat_tools, contact_profile, … */
  async entry(): Promise<string> {
    const result = await this.invoke('getContext');
    return typeof result['entry'] === 'string' ? result['entry'] : '';
  }

  /** The customer in the current one-to-one chat (external_userid). */
  async currentContact(): Promise<string> {
    const result = await this.invoke('getCurExternalContact');
    const userId = result['userId'];
    if (typeof userId !== 'string' || !userId) {
      throw new Error('读取不到当前学生，请在和学生的单聊窗口里打开。');
    }
    return userId;
  }

  /** Puts a link card into the current chat. */
  async sendNews(card: WeComNewsCard): Promise<void> {
    await this.invoke('sendChatMessage', { msgtype: 'news', enterChat: false, news: card });
  }

  private invoke(name: string, params: Record<string, unknown> = {}): Promise<WeComResult> {
    return new Promise((resolve, reject) => {
      this.sdk.invoke(name, params, (result) => {
        if (result?.err_msg === `${name}:ok`) {
          resolve(result);
        } else {
          reject(new Error(describeFailure(name, result)));
        }
      });
    });
  }
}

function describeFailure(name: string, result: WeComResult | undefined): string {
  const message = String(result?.err_msg ?? result?.['errMsg'] ?? '');
  if (/cancel/i.test(message)) {
    return '已取消。';
  }
  if (/no permission|permission denied|not in white ?list/i.test(message)) {
    return `企业微信没有给这个应用“${name}”的权限，请管理员检查应用的客户联系权限和可信域名。（${message}）`;
  }
  return `企业微信返回：${message || '未知错误'}`;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('企业微信工具加载失败，请检查网络后重新打开侧边栏。'));
    document.head.appendChild(script);
  });
}
