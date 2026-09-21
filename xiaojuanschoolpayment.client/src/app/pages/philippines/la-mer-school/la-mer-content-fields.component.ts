import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CiaContentConfig } from '../cia-school/cia-content-config';
import { LA_MER_FAMILY_WEEKS } from './la-mer-content-config';
import { LaMerFamilyVersion } from './la-mer-types';

@Component({
  selector: 'app-la-mer-content-fields', standalone: true, imports: [CommonModule, FormsModule],
  template: `
  <div class="lamer-fields" *ngIf="content.laMerPage && content.quoteSettings.laMer">
    <h3>La Mer学校介绍与亲子套餐</h3><p>这些字段与课程、房型、费用和优惠一同保存到本校区草稿，审核发布后生效。</p>
    <details open data-editor-section="lamer-intro" (focusin)="selected.emit('lamer-intro')"><summary>首屏介绍</summary>
      <label>学校标题<input [(ngModel)]="page.title"></label><label>首屏介绍<textarea [(ngModel)]="page.lead"></textarea></label>
      <label *ngFor="let tag of page.tags; let i = index; trackBy: trackIndex">特点标签{{ i + 1 }}<input [(ngModel)]="page.tags[i]"></label>
    </details>
    <details data-editor-section="lamer-overview" (focusin)="selected.emit('lamer-overview')"><summary>学校概况与顾问建议</summary>
      <label>学校概况<textarea [(ngModel)]="page.intro"></textarea></label><label>顾问建议<textarea [(ngModel)]="page.advisor"></textarea></label>
      <div *ngFor="let fact of page.facts; let i = index" class="row"><label>卡片名称<input [(ngModel)]="fact.label"></label><label>重点内容<input [(ngModel)]="fact.value"></label><label>说明<textarea [(ngModel)]="fact.note"></textarea></label></div>
      <label *ngFor="let value of page.fit; let i = index; trackBy: trackIndex">适合人群{{ i + 1 }}<input [(ngModel)]="page.fit[i]"></label>
      <label *ngFor="let value of page.considerations; let i = index; trackBy: trackIndex">报名注意{{ i + 1 }}<input [(ngModel)]="page.considerations[i]"></label>
    </details>
    <details data-editor-section="lamer-family" (focusin)="selected.emit('lamer-family')"><summary>亲子课程、价格版本与整包费用</summary>
      <label>儿童课时安排<input [(ngModel)]="page.familyChildSchedule"></label><label>监护人课时安排<input [(ngModel)]="page.familyGuardianSchedule"></label><label>亲子课程介绍<textarea [(ngModel)]="page.familyIntro"></textarea></label>
      <div class="grid"><label>订金（美元/人）<input type="number" min="0" [(ngModel)]="policy.familyDepositPerPerson"></label><label>最低儿童年龄<input type="number" min="1" max="17" [(ngModel)]="policy.minimumChildAge"></label></div>
      <p>已确认：至少1名监护人与1名儿童，2–4人按总人数选套餐；签证续签和可退押金按人另付。</p>
      <h4>套餐包含项目</h4><label class="check" *ngFor="let fee of content.localFees"><input type="checkbox" [ngModel]="policy.familyIncludedFeeIds.includes(fee.id)" (ngModelChange)="setIncluded(fee.id, $event)">{{ fee.name }}</label>
      <details *ngFor="let version of policy.familyVersions; let vi = index"><summary>{{ version.name }}</summary>
        <label class="check"><input type="checkbox" [(ngModel)]="version.enabled">启用此版本</label><label>版本名称<input [(ngModel)]="version.name"></label>
        <div class="grid"><label>适用开始<input type="date" [(ngModel)]="version.start"></label><label>适用结束<input type="date" [(ngModel)]="version.end"></label><label>重叠时版本优先级<input type="number" [(ngModel)]="version.priority"></label></div>
        <h4>旺季日期</h4><div class="row" *ngFor="let range of version.peakRanges; let i = index"><div class="grid"><label>开始<input type="date" [(ngModel)]="range.start"></label><label>结束<input type="date" [(ngModel)]="range.end"></label></div><button (click)="version.peakRanges.splice(i, 1); changed.emit()">删除该档期</button></div><button (click)="version.peakRanges.push({ start: '', end: '' }); changed.emit()">添加旺季日期</button>
        <h4>不适用日期</h4><div class="row" *ngFor="let range of version.exclusions; let i = index"><div class="grid"><label>开始<input type="date" [(ngModel)]="range.start"></label><label>结束<input type="date" [(ngModel)]="range.end"></label></div><button (click)="version.exclusions.splice(i, 1); changed.emit()">删除</button></div><button (click)="version.exclusions.push({ start: '', end: '' }); changed.emit()">添加不适用日期</button>
        <details *ngFor="let pack of version.packages; let pi = index"><summary>{{ pack.name }} · {{ pack.people }}人 · {{ pack.season === 'peak' ? '旺季' : pack.season === 'off' ? '普通档期' : '适用档期' }}</summary>
          <label class="check"><input type="checkbox" [(ngModel)]="pack.enabled">启用套餐</label><label>房型名称<input [(ngModel)]="pack.name"></label><div class="grid"><label>房型标识<input [(ngModel)]="pack.id"></label><label>家庭人数<select [(ngModel)]="pack.people"><option [ngValue]="2">2</option><option [ngValue]="3">3</option><option [ngValue]="4">4</option></select></label><label>季节<select [(ngModel)]="pack.season"><option value="all">版本适用期</option><option value="off">普通档期</option><option value="peak">旺季</option></select></label></div>
          <div class="grid"><label *ngFor="let w of weeks">{{ w }}周套餐总价（美元）<input type="number" min="0" [(ngModel)]="pack.prices[w]"></label></div><button (click)="version.packages.splice(pi, 1); changed.emit()">删除套餐</button>
        </details><button (click)="addPackage(version)">新增明确价格的套餐</button>
      </details><button (click)="addVersion()">新增亲子价格版本</button>
    </details>
    <details data-editor-section="lamer-schedule" (focusin)="selected.emit('lamer-schedule')"><summary>日常作息</summary><div class="row" *ngFor="let item of page.schedule"><label>时段<input [(ngModel)]="item.time"></label><label>名称<input [(ngModel)]="item.title"></label><label>安排<textarea [(ngModel)]="item.text"></textarea></label></div></details>
    <details *ngFor="let section of textSections" [attr.data-editor-section]="section.id" (focusin)="selected.emit(section.id)"><summary>{{ section.label }}</summary><div class="row" *ngFor="let item of textRows(section.key); let i = index"><label>标题<input [(ngModel)]="item.title"></label><label>内容<textarea rows="4" [(ngModel)]="item.text"></textarea></label><button (click)="textRows(section.key).splice(i, 1); changed.emit()">删除</button></div><button (click)="textRows(section.key).push({ title: '新增内容', text: '' }); changed.emit()">添加内容</button></details>
    <details data-editor-section="lamer-gallery" (focusin)="selected.emit('lamer-gallery')"><summary>内置校园素材、顺序与显示</summary><p>首张启用的“校园与泳池”图片同时用作页面首图和报价图片。新上传的照片、视频请使用“照片与视频”标签，发布前不会公开。</p><details *ngFor="let photo of page.gallery; let i = index"><summary>{{ photo.title }}</summary><label class="check"><input type="checkbox" [(ngModel)]="photo.enabled">显示</label><label>名称<input [(ngModel)]="photo.title"></label><label>分类<input [(ngModel)]="photo.category"></label><label>图片地址<input [(ngModel)]="photo.url"></label><label>说明<textarea [(ngModel)]="photo.caption"></textarea></label><button (click)="movePhoto(i, -1)">上移</button><button (click)="movePhoto(i, 1)">下移</button></details><div class="row" *ngFor="let video of page.videos"><label class="check"><input type="checkbox" [(ngModel)]="video.enabled">显示视频</label><label>标题<input [(ngModel)]="video.title"></label><label>地址<input [(ngModel)]="video.url"></label><label>封面<input [(ngModel)]="video.poster"></label></div></details>
  </div>`,
  styles: [`:host{display:block}h3{margin:15px 0}p{font-size:12px;line-height:1.8;color:#617381}details{border:1px solid #d8e3e8;border-radius:9px;padding:12px;margin:12px 0;background:white}summary{cursor:pointer;font-weight:650;font-size:14px}label{display:flex;flex-direction:column;gap:7px;margin:12px 0;font-size:12px}input,textarea,select{width:100%;box-sizing:border-box;border:1px solid #ccdce3;border-radius:6px;padding:9px;font:inherit}textarea{min-height:80px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.row{border-bottom:1px solid #e4eaed;padding:8px 0}.check{flex-direction:row;align-items:center}.check input{width:auto}button{border:1px solid #c4d6de;border-radius:6px;background:#f1f7fa;color:#315764;padding:8px 11px;margin:5px 5px 5px 0;cursor:pointer}`],
})
export class LaMerContentFieldsComponent {
  @Input({ required: true }) content!: CiaContentConfig;
  @Output() changed = new EventEmitter<void>();
  @Output() selected = new EventEmitter<string>();
  readonly weeks = LA_MER_FAMILY_WEEKS;
  readonly textSections: { id: string; label: string; key: 'services' | 'rules' | 'faq' }[] = [{ id: 'lamer-services', label: '餐饮与校园服务', key: 'services' }, { id: 'lamer-rules', label: '校规与入学须知', key: 'rules' }, { id: 'lamer-faq', label: '常见问题', key: 'faq' }];
  get page() { return this.content.laMerPage!; }
  get policy() { return this.content.quoteSettings.laMer!; }
  textRows(key: 'services' | 'rules' | 'faq') { return this.page[key]; }
  trackIndex(index: number) { return index; }
  setIncluded(id: string, included: boolean) { this.policy.familyIncludedFeeIds = included ? [...new Set([...this.policy.familyIncludedFeeIds, id])] : this.policy.familyIncludedFeeIds.filter(x => x !== id); this.changed.emit(); }
  movePhoto(index: number, step: number) { const target = index + step; if (target < 0 || target >= this.page.gallery.length) return; const [p] = this.page.gallery.splice(index, 1); this.page.gallery.splice(target, 0, p); this.changed.emit(); }
  addPackage(version: LaMerFamilyVersion) { version.packages.push({ id: `room-${version.packages.length + 1}`, name: '新增套餐', people: 2, season: 'off', enabled: false, prices: {} }); this.changed.emit(); }
  addVersion() { this.policy.familyVersions.push({ id: `family-${Date.now()}`, name: '新增亲子版本', start: '', end: '', priority: 3, exclusions: [], peakRanges: [], packages: [], enabled: false }); this.changed.emit(); }
}
