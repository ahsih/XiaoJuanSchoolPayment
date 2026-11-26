# Phone top-up guide

Moved verbatim from AGENTS.md on 2026-11-26. This is the record for this page only; record new decisions about it here.

## Overseas phone top-up (2026-11-26)

`/study-tour-guide/phone-top-up` (海外手机话费充值, menu 游学指南 and 留学指南) links students to the third-party 小啦全球充 top-up platform for Philippine, Irish and UK numbers. The links are 思达启航's distribution links from the agent backend (tai.95cxmd.com → 分销链接): `https://www.95cxmd.com/h5/#/home/view?source=saavyo&id=<country>`, where `source=saavyo` credits the order to 思达启航 and the country ids are 15 (菲律宾), 164 (爱尔兰) and 62 (英国). Text and links live in the pure `pages/phone-top-up/phone-top-up-content.ts`; the mini program has the same links in its `miniprogram/data/top-up.ts` (page `pages/top-up`, opened from the home 话费充值 tool and from 我的). The platform's domain is not a mini program 业务域名, so the mini program copies the link instead of opening it in web-view. Change both files together when a link changes. Never put the backend login in the repository.
