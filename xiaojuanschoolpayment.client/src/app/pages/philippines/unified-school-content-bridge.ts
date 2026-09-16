import { SchoolContentService } from '../../../services/school-content.service';
import { SchoolService } from '../../../services/school.service';
import { catchError, EMPTY, map, of, switchMap } from 'rxjs';
import { CiaContentConfig } from './cia-school/cia-content-config';

interface UnifiedContentBridgeOptions {
  code: string;
  schoolService: SchoolService;
  contentService: SchoolContentService;
  matchesSchool: (name: string) => boolean;
  clone: (content: CiaContentConfig) => CiaContentConfig;
  apply: (content: CiaContentConfig) => void;
}

export function readUnifiedContentPreview(code: string): CiaContentConfig | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(`${code.toLowerCase()}-content-preview`);
    return raw ? JSON.parse(raw) as CiaContentConfig : null;
  } catch {
    return null;
  }
}

export function connectUnifiedSchoolContent(options: UnifiedContentBridgeOptions): void {
  const preview = readUnifiedContentPreview(options.code);
  if (preview) options.apply(options.clone(preview));

  options.schoolService.getSchools().pipe(
    map(schools => schools.find(school => options.matchesSchool(school.name))?.id),
    switchMap(schoolId => schoolId
      ? options.contentService.getPublished<CiaContentConfig>(schoolId).pipe(catchError(() => of(null)))
      : EMPTY),
  ).subscribe(revision => {
    if (!preview && revision?.content) options.apply(options.clone(revision.content));
  });
}

export function unifiedPreviewContent(event: MessageEvent, code: string): CiaContentConfig | null {
  if (event.origin !== window.location.origin) return null;
  const message = event.data as { type?: string; content?: CiaContentConfig };
  return message?.type === `${code.toLowerCase()}-content-preview` && message.content ? message.content : null;
}

export function notifyUnifiedPreviewReady(code: string): void {
  if (typeof window === 'undefined' || window.parent === window) return;
  window.parent.postMessage({ type: `${code.toLowerCase()}-content-ready` }, window.location.origin);
}

export function notifyUnifiedPreviewLocated(code: string, target?: unknown): void {
  if (typeof window === 'undefined' || window.parent === window) return;
  document.getElementById('quote')?.scrollIntoView({ block: 'start' });
  window.parent.postMessage({
    type: `${code.toLowerCase()}-content-located`, target,
    status: '已同步到公开页面；课程、住宿、费用与报价图片使用当前草稿。',
  }, window.location.origin);
}
