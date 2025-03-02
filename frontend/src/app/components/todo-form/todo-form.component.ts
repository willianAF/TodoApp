import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { RefreshService } from '../../services/refresh.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './todo-form.component.html',
  styles: [`
    :host {
      display: block;
    }
    
    mat-form-field {
      width: 100%;
    }
    
    ::ng-deep .mdc-text-field--outlined {
      --mdc-shape-small: 8px;
    }

    ::ng-deep .mdc-notched-outline__notch {
      border-right: none;
    }
    
    textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .mat-mdc-raised-button.mat-primary {
      background-color: #4f46e5;
      transition: all 0.3s ease;
    }
    
    .mat-mdc-raised-button.mat-primary:hover {
      background-color: #4338ca;
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
  `]
})
export class TodoFormComponent {
  @Output() formSubmitted = new EventEmitter<void>();
  todo = {
    title: '',
    description: ''
  };

  constructor(
    private todoService: TodoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private refreshService: RefreshService
  ) {}

  onSubmit(): void {
    if (!this.todo.title.trim()) {
      this.snackBar.open('Please enter a title', 'Close', { duration: 3000 });
      return;
    }

    this.todoService.createTodo({
      title: this.todo.title,
      description: this.todo.description,
      isCompleted: false
    }).subscribe({
      next: () => {
        this.snackBar.open('Todo created successfully!', 'Close', { duration: 3000 });
        this.todo.title = '';
        this.todo.description = '';
        this.formSubmitted.emit();
        this.refreshService.triggerRefresh();
      },
      error: (error) => {
        console.error('Error creating todo:', error);
        this.snackBar.open('Error creating todo', 'Close', { duration: 3000 });
      }
    });
  }
}