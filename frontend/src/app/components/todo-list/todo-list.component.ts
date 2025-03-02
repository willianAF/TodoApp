import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.interface';
import { AppComponent } from '../../app.component';
import { RefreshService } from '../../services/refresh.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './todo-list.component.html',
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }

    .mat-icon-button {
      opacity: 1 !important;
      visibility: visible !important;
    }

    .mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      line-height: 24px;
    }
  `]
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  searchTerm: string = '';
  private refreshSubscription!: Subscription;
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private todoService: TodoService,
    public appComponent: AppComponent,
    private refreshService: RefreshService
  ) {}

  ngOnInit(): void {
    this.loadTodos();
    this.refreshSubscription = this.refreshService.refresh$.subscribe(() => {
      this.loadTodos();
    });

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.loadTodos(searchTerm);
    });
  }
  
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  loadTodos(search: string = ''): void {
    this.todoService.getTodos(search).subscribe(todos => {
      this.todos = todos;
    });
  }

  toggleTodoStatus(id: number): void {
    this.todoService.toggleTodoStatus(id).subscribe(() => {
      this.loadTodos(this.searchTerm);
    });
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.loadTodos(this.searchTerm);
    });
  }

  editTodo(todo: Todo): void {
    this.appComponent.openEditPanel(todo);
  }
}