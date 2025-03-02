import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { EditTodoComponent } from './components/edit-todo/edit-todo.component';
import { Todo } from './models/todo.interface';
import { RefreshService } from './services/refresh.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TodoFormComponent,
    EditTodoComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Todo App';
  showSidePanel = false;
  isEditMode = false;
  selectedTodo: Todo | null = null;
  
  constructor(private refreshService: RefreshService) {}
  
  toggleSidePanel() {
    this.showSidePanel = !this.showSidePanel;
    if (!this.showSidePanel) {
      this.isEditMode = false;
      this.selectedTodo = null;
      this.refreshTodoList();
    }
  }
  
  openEditPanel(todo: Todo) {
    this.selectedTodo = { ...todo };
    this.isEditMode = true;
    this.showSidePanel = true;
  }

  refreshTodoList() {
    this.refreshService.triggerRefresh();
  }
}
