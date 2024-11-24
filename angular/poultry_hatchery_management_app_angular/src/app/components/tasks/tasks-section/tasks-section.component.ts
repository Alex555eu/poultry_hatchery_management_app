import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskStatus } from '../../../models/task-status-enum';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task.model';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-tasks-section',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatListModule
  ],
  templateUrl: './tasks-section.component.html',
  styleUrl: './tasks-section.component.css'
})
export class TasksSectionComponent {

  @Input() tasks: Task[] | null = null;
  @Input() title: string | null = null;
  @Input() isToggleable: boolean | null = null;
  @Output() selectTaskEvent = new EventEmitter<string>();

  private isCurrentlyToggled: boolean = false;

  selectTask(taskId: string) {
    if (this.isToggleable) {
      if (this.isCurrentlyToggled) {
        this.isCurrentlyToggled = false;
        this.selectTaskEvent.emit('')
      } else {
        this.isCurrentlyToggled = true;
        this.selectTaskEvent.emit(taskId) 
      }
      return; //safety check
    }

    this.selectTaskEvent.emit(taskId);
  }

  setColorClass(): string {
    if (this.isToggleable) {
      if (this.isCurrentlyToggled) {
        return 'toggled';
      } else {
        return '';
      }
    }
    return '';
  }

  getStatusColor(status: string): string {
    switch(status) {
      case TaskStatus.NOT_STARTED: {
        return 'gray';
      }
      case TaskStatus.IN_PROGRESS: {
        return '#bae1ff';
      }
      case TaskStatus.COMPLETED: {
        return '#44fd6cc5';
      }
      case TaskStatus.CANCELLED: {
        return '#ffb3ba';
      }
      default: {
        return 'white';
      }
    }
  }

  translateStatusEnToPl(status: string): string {
    switch(status) {
      case TaskStatus.NOT_STARTED: {
        return 'Nierozpoczęte';
      }
      case TaskStatus.IN_PROGRESS: {
        return 'W trakcie';
      }
      case TaskStatus.COMPLETED: {
        return 'Zakończone';
      }
      case TaskStatus.CANCELLED: {
        return 'Anulowane';
      }
      default: {
        return '';
      }
    }
  }
}
