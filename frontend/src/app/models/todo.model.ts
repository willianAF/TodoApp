export interface Todo {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt: string | null;
}

export type CreateTodoDto = Omit<Todo, 'id' | 'createdAt' | 'completedAt' | 'isCompleted'>;
export type UpdateTodoDto = Partial<Omit<Todo, 'id' | 'createdAt' | 'completedAt' | 'isCompleted'>>;