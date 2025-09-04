export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Invoice {
  id: number;
  title: string;
  reference_month: string;
  file_path: string | null;
  observations?: string;
  user_id?: number;
}
