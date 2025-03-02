export interface CreateTodoDto {
  title: string;
  description?: string;
  isCompleted?: boolean;
}

export interface UpdateTodoDto {
  title: string;
  description?: string;
  isCompleted?: boolean;
}