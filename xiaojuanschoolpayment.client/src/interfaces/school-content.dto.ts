export interface SchoolContentRevisionSummaryDTO {
  id: string;
  version: number;
  status: 'Draft' | 'PendingReview' | 'Published' | 'Archived';
  changeSummary?: string;
  updatedByName: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface SchoolContentRevisionDTO<TContent> extends SchoolContentRevisionSummaryDTO {
  content: TContent;
}

export interface SchoolContentEditorDTO<TContent> {
  schoolId: string;
  schoolName: string;
  draft?: SchoolContentRevisionDTO<TContent>;
  pendingReview?: SchoolContentRevisionDTO<TContent>;
  published?: SchoolContentRevisionDTO<TContent>;
  history: SchoolContentRevisionSummaryDTO[];
}

export interface SchoolContentReviewDTO {
  schoolId: string;
  schoolName: string;
  revisionId: string;
  version: number;
  changeSummary?: string;
  updatedByName: string;
  updatedAt: string;
  changedSections: string[];
}
