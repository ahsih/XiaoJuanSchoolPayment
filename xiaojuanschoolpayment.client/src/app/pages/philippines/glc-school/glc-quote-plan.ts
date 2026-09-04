import { SchoolQuotePlan, QuotePlanKind } from '../../../components/school-quote-plan';

/** GLC family packages share tuition; each person's room periods remain independently billable. */
export class GlcQuotePlan extends SchoolQuotePlan {
  travellers = () => 1;

  roomsFor(person: number) { return this.travellers() === 1 ? this.rooms : this.rooms.filter(row => (row.occupant || 1) === person); }

  private personPlan(person: number) {
    const plan = new SchoolQuotePlan(this.courses[0]?.optionId ?? '', this.rooms[0]?.optionId ?? '', this.startDate, this.allowedWeeks, this.options, this.price, this.maxWeeks);
    plan.courses = this.courses;
    plan.rooms = this.roomsFor(person);
    return plan;
  }

  override get error() {
    if (this.travellers() === 1) return super.error;
    if (this.rooms.some(row => ![1, 2].includes(row.occupant || 1))) return '请重新选择有效的入住学员。';
    for (let person = 1; person <= this.travellers(); person++) {
      const error = this.personPlan(person).error;
      if (error) return `学员${person}：${error}`;
    }
    return this.stayWeeks > this.maxWeeks ? `所选日期超出${this.maxWeeks}周报价范围。` : '';
  }

  override get mismatch() {
    if (this.travellers() === 1) return super.mismatch;
    return Array.from({ length: this.travellers() }, (_, index) => this.personPlan(index + 1)).some(plan => plan.mismatch);
  }

  override canAdd(kind: QuotePlanKind) {
    if (kind === 'course' || this.travellers() === 1) return super.canAdd(kind);
    return Array.from({ length: this.travellers() }, (_, index) => this.roomsFor(index + 1)).some(rows => rows.reduce((sum, row) => sum + row.weeks, 0) < this.maxWeeks);
  }

  override add(kind: QuotePlanKind) {
    if (kind === 'course' || this.travellers() === 1) { super.add(kind); return; }
    if (!this.canAdd(kind)) return;
    const people = Array.from({ length: this.travellers() }, (_, index) => index + 1);
    const person = people.sort((a, b) => this.roomsFor(a).reduce((sum, row) => sum + row.weeks, 0) - this.roomsFor(b).reduce((sum, row) => sum + row.weeks, 0))[0];
    const rows = this.roomsFor(person);
    const latest = rows.map(row => this.end(row)).sort().at(-1);
    const remaining = this.maxWeeks - rows.reduce((sum, row) => sum + row.weeks, 0);
    this.rooms.push({
      id: this.nextId++,
      optionId: rows.at(-1)?.optionId ?? this.rooms[0]?.optionId ?? this.options('room')[0].id,
      weeks: Math.min(4, remaining), occupant: person,
      startDate: latest ? new Date(this.date(latest)! + 86400000).toISOString().slice(0, 10) : this.courses[0].startDate,
    });
  }

  override paymentItems() {
    const items = super.paymentItems();
    if (this.travellers() === 1) return items;
    const rooms = [...this.rooms].sort((a, b) => a.startDate.localeCompare(b.startDate));
    items.slice(this.courses.length).forEach((item, index) => { item.label = `住宿费 · 学员${rooms[index].occupant || 1}`; });
    return items;
  }
}
