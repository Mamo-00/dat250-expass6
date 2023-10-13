import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { TodoService, Todo } from '../todo.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css', '../../styles.css']
})
export class TodoComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  dataSource = new MatTableDataSource<Todo>();
  newTodo: Todo = { description: '', summary: '' };

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.loadPage();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  loadPage(event?: PageEvent): void {
    const pageIndex = event ? event.pageIndex : 0;
    const pageSize = event ? event.pageSize : 10;
    this.todoService.getTodosPage(pageIndex, pageSize).subscribe({
      next: data => this.dataSource.data = data,
      error: error => console.error(error)
    });
  }
  

  deleteTodo(id?: number): void {
    if (id === undefined) {
      console.error('ID is undefined');
      return;
    }
  
    this.todoService.deleteTodo(id).subscribe({
      next: () => this.loadPage(),  
      error: error => console.error(error)
    });
  }
  
  addTodo(): void {
    this.todoService.addTodo(this.newTodo).subscribe({
      next: todo => {
        const data = this.dataSource.data;
        data.push(todo);
        this.dataSource.data = data;
        this.newTodo = { description: '', summary: '' };
      },
      error: error => console.error(error)
    });
  }
  
  
}
