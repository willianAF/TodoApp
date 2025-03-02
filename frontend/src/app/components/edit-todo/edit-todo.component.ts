import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.interface';
import { AppComponent } from '../../app.component';
import { RefreshService } from '../../services/refresh.service';

@Component({
  selector: 'app-edit-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-todo.component.html',
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
export class EditTodoComponent implements OnInit {
  @Input() todo: Todo | null = null;
  isLoading = false;

  constructor(
    private todoService: TodoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private appComponent: AppComponent,
    private refreshService: RefreshService
  ) {}

  ngOnInit(): void {
    // No need to fetch the todo as it's now passed as an input
  }

  onSubmit(): void {
    if (!this.todo || !this.todo.title.trim()) {
      this.snackBar.open('Please enter a title', 'Close', { duration: 3000 });
      return;
    }

    this.todoService.updateTodo(this.todo.id, this.todo).subscribe({
      next: () => {
        this.snackBar.open('Todo updated successfully!', 'Close', { duration: 3000 });
        this.refreshService.triggerRefresh(); // Refresh the todo list
        this.appComponent.toggleSidePanel(); // Close the side panel
      },
      error: (error) => {
        console.error('Error updating todo:', error);
        this.snackBar.open('Error updating todo', 'Close', { duration: 3000 });
      }
    });}
 }
