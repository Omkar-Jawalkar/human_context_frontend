export type AuthTokenResponse = {
  access_token: string;
  token_type: "bearer";
};

export type UserResponse = {
  id: string;
  organization_id: string | null;
  email: string;
  name: string;
  super_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type OrganizationResponse = {
  id: string;
  name: string;
  meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type OrganizationListResponse = {
  items: OrganizationResponse[];
};

export type OrganizationCreateInput = {
  name: string;
  meta?: Record<string, unknown>;
};

export type OrganizationUpdateInput = {
  name?: string;
  meta?: Record<string, unknown>;
};

export type ImportJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type ImportJobStats = {
  conversations_count: number;
  messages_created: number;
  messages_updated: number;
  conversations_skipped: number;
  embeddings_created: number;
  embeddings_skipped: number;
};

export type ImportJobResponse = {
  id: string;
  user_id: string;
  organization_id: string;
  source: "claude";
  status: ImportJobStatus;
  file_name: string;
  file_hash: string;
  stats: ImportJobStats;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  celery_task_id: string | null;
  duplicate: boolean;
};

export type QueryRequest = {
  query: string;
  user_id: string;
};

export type QuerySource = {
  content: string | null;
  distance: number;
  message_id: string | null;
  conversation_id: string | null;
  sender: string | null;
  import_job_id: string | null;
};

export type QueryResponse = {
  answer: string;
  sources: QuerySource[] | null;
};

export type ApiErrorBody = {
  detail?: string | { msg: string; type?: string; loc?: (string | number)[] }[];
  code?: string;
};

export type ValidationErrorItem = {
  msg: string;
  type?: string;
  loc?: (string | number)[];
};
