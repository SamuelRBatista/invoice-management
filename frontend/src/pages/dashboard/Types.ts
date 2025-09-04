export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Invoice {
  id: number;
  title: string;
  referenceMonth: string;
  filePath: string | null;
  observations?: string;
  userId?: number;
  user?: User;
}
