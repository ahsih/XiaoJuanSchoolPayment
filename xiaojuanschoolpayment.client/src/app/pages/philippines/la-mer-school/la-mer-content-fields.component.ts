// La Mer's own editor fields: the family packages (price versions, seasons and whole-family totals) and what they
// include. The page text lives in la-mer-page-content.ts; courses, rooms, fees and offers use the shared editor tabs.
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CiaContentConfig } from '../cia-school/cia-content-config';
import { LA_MER_FAMILY_WEEKS } from './la-mer-content-config';
import { LaMerFamilyVersion } from './la-mer-types';

@Component({
  selector: 'app-la-mer-content-fields', standalone: true, imports: [CommonModule, FormsModule],
  template: `
  <div class="lamer-fields" *ngIf="content.quoteSettings.laMer">
    <h3>La Mer亲子套餐</h3><p>亲子套餐在报价器的“课程”里选择；这些字段与课程、房型、费用和优惠一同保存到本校区草稿，审核发布后生效。</p>
    <details open data-editor-section="lamer-family" (focusin)="selected.emit('lamer-family')"><summary>亲子价格版本与整包费用</summary>
      <div class="grid"><label>订金（美元/人）<input type="number" min="0" [(ngModel)]="policy.familyDepositPerPerson"></label><label>最低儿童年龄<input type="number" min="1" max="17" [(ngModel)]="policy.minimumChildAge"></label></div>
      <p>已确认：至少1名监护人与1名儿童，2–4人按总人数选套餐；签证续签、ACR I-CARD和可退押金按人另付。</p>
      <h4>套餐包含项目</h4><label class="check" *ngFor="let fee of content.localFees"><input type="checkbox" [ngModel]="policy.familyIncludedFeeIds.includes(fee.id)" (ngModelChange)="setIncluded(fee.id, $event)">{{ fee.name }}</label>
      <details *ngFor="let version of policy.familyVersions"><summary>{{ version.name }}</summary>
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
  </div>`,
  styles: [`:host{display:block}h3{margin:15px 0}p{font-size:12px;line-height:1.8;color:#617381}details{border:1px solid #d8e3e8;border-radius:9px;padding:12px;margin:12px 0;background:white}summary{cursor:pointer;font-weight:650;font-size:14px}label{display:flex;flex-direction:column;gap:7px;margin:12px 0;font-size:12px}input,textarea,select{width:100%;box-sizing:border-box;border:1px solid #ccdce3;border-radius:6px;padding:9px;font:inherit}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.row{border-bottom:1px solid #e4eaed;padding:8px 0}.check{flex-direction:row;align-items:center}.check input{width:auto}button{border:1px solid #c4d6de;border-radius:6px;background:#f1f7fa;color:#315764;padding:8px 11px;margin:5px 5px 5px 0;cursor:pointer}`],
})
export class LaMerContentFieldsComponent {
  @Input({ required: true }) content!: CiaContentConfig;
  @Output() changed = new EventEmitter<void>();
  @Output() selected = new EventEmitter<string>();
  readonly weeks = LA_MER_FAMILY_WEEKS;
  get policy() { return this.content.quoteSettings.laMer!; }
  setIncluded(id: string, included: boolean) { this.policy.familyIncludedFeeIds = included ? [...new Set([...this.policy.familyIncludedFeeIds, id])] : this.policy.familyIncludedFeeIds.filter(x => x !== id); this.changed.emit(); }
  addPackage(version: LaMerFamilyVersion) { version.packages.push({ id: `room-${version.packages.length + 1}`, name: '新增套餐', people: 2, season: 'off', enabled: false, prices: {} }); this.changed.emit(); }
  addVersion() { this.policy.familyVersions.push({ id: `family-${Date.now()}`, name: '新增亲子版本', start: '', end: '', priority: 3, exclusions: [], peakRanges: [], packages: [], enabled: false }); this.changed.emit(); }
}
