import { Component, OnInit } from '@angular/core';
import { TasksSectionComponent } from "../tasks/tasks-section/tasks-section.component";
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks/tasks.service';

@Component({
  selector: 'app-candling',
  standalone: true,
  imports: [TasksSectionComponent],
  templateUrl: './candling.component.html',
  styleUrl: './candling.component.css'
})
export class CandlingComponent implements OnInit {

  todayCandlings: Task[] | null = null;

  constructor(
    private taskService: TasksService
  ){}


  ngOnInit(): void {
      
  }




}
