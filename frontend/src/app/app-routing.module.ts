import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { EditTodoComponent } from './components/edit-todo/edit-todo.component';

const routes: Routes = [
  { path: '', component: TodoListComponent },
  { path: 'add', component: TodoFormComponent },
  { path: 'edit/:id', component: EditTodoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }