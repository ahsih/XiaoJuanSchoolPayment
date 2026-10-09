import { QuotePlanRow } from '../../components/school-quote-plan';
import { textbookPeriods } from './school-textbook-estimate';
export function cgTextbookPeriods(rows: QuotePlanRow[]): number { return textbookPeriods(rows, 8); }
