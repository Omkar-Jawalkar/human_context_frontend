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

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type OrganizationListResponse = PaginatedResponse<OrganizationResponse>;

export type OrganizationListFilters = {
  name?: string;
  created_after?: string;
  created_before?: string;
  page?: number;
  page_size?: number;
};

export type UserListResponse = PaginatedResponse<UserResponse>;

export type UserListFilters = {
  organization_id?: string;
  unassigned_only?: boolean;
  email?: string;
  page?: number;
  page_size?: number;
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
  retry_after_seconds?: number;
  retry_at?: string;
};

export type ValidationErrorItem = {
  msg: string;
  type?: string;
  loc?: (string | number)[];
};

export type ChatMessage = {
  id: string;
  thread_id: string;
  role: "user" | "assistant";
  content: string;
  sequence: number;
  sources: QuerySource[] | null;
  created_at: string;
};

export type ChatThread = {
  id: string;
  user_id: string;
  context_user_id: string;
  organization_id: string | null;
  title: string;
  use_thread_history: boolean;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
};

export type ChatThreadListResponse = {
  threads: ChatThread[];
};

export type SendMessageResponse = {
  user_message: ChatMessage;
  assistant_message: ChatMessage;
};

export type CreateChatInput = {
  title?: string;
  context_user_id: string;
  use_thread_history: boolean;
};

export type UpdateChatInput = {
  title?: string;
  use_thread_history?: boolean;
};
