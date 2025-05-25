export interface Image {
  id: string;
  url: string;
  type: string | null;
  upload_by: string | null;
  created_at: string;
}

export interface ImageInsert {
  id?: string;
  url: string;
  type?: string | null;
  upload_by?: string | null;
  created_at?: string;
}

export interface ImageUpdate {
  id?: string;
  url?: string;
  type?: string | null;
  upload_by?: string | null;
  created_at?: string;
}
