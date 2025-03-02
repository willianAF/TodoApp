import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { Todo } from '../models/todo.interface';
import { CreateTodoDto, UpdateTodoDto } from '../models/todo-dto.interface';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly apiUrl = 'http://localhost:5079/todo';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getTodos(search?: string): Observable<Todo[]> {
    let url = this.apiUrl;
    if (search?.trim()) {
      url += `?search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<Todo[]>(url).pipe(
      tap(() => {
        if (search) {
          this.notificationService.showSuccess(`Todos filtered by "${search}"`);
        }
      }),
      catchError(error => {
        this.notificationService.showError('Unable to load your todos. Please check your internet connection and try again.');
        return throwError(() => error);
      })
    );
  }

  getTodo(id: number): Observable<Todo> {
    if (id <= 0) {
      this.notificationService.showError('Invalid todo item');
      return throwError(() => new Error('Invalid todo ID'));
    }
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        this.notificationService.showError('Unable to load the todo item. Please try again.');
        return throwError(() => error);
      })
    );
  }

  createTodo(todo: CreateTodoDto): Observable<Todo> {
    if (!todo.title?.trim()) {
      const error = new Error('Title is required');
      this.notificationService.showError('Please enter a title for your todo');
      return throwError(() => error);
    }
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      tap(() => this.notificationService.showSuccess('Todo created successfully')),
      catchError(error => {
        this.notificationService.showError('Unable to create your todo. Please try again.');
        return throwError(() => error);
      })
    );
  }

  updateTodo(id: number, todo: UpdateTodoDto): Observable<Todo> {
    if (id <= 0) {
      this.notificationService.showError('Invalid todo item');
      return throwError(() => new Error('Invalid todo ID'));
    }
    if (!todo.title?.trim()) {
      this.notificationService.showError('Please enter a title for your todo');
      return throwError(() => new Error('Title is required'));
    }
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo).pipe(
      tap(() => this.notificationService.showSuccess('Todo updated successfully')),
      catchError(error => {
        this.notificationService.showError('Unable to update your todo. Please try again.');
        return throwError(() => error);
      })
    );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.notificationService.showSuccess('Todo deleted successfully')),
      catchError(error => {
        this.notificationService.showError('Unable to delete your todo. Please try again.');
        return throwError(() => error);
      })
    );
  }

  toggleTodoStatus(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/toggle`, {}).pipe(
      tap((todo) => this.notificationService.showSuccess(`Todo marked as ${todo.isCompleted ? 'completed' : 'incomplete'}`)),
      catchError(error => {
        this.notificationService.showError('Unable to update todo status. Please try again.');
        return throwError(() => error);
      })
    );
  }
}