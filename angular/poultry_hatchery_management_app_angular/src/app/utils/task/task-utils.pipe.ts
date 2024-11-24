import { Pipe, PipeTransform } from '@angular/core';
import { TaskNestingTrolleyAssignment } from '../../models/task-nesting-trolley-assignment.model';
import { Task } from '../../models/task.model';
import { TaskStatus } from '../../models/task-status-enum';

@Pipe({
  name: 'taskUtils',
  standalone: true
})
export class TaskUtilsPipe implements PipeTransform {

  transform(task: TaskNestingTrolleyAssignment[] | Task | undefined, option: 'color' | 'percentage' | 'translate' | 'completed-trolleys'): any {
    if (task instanceof TaskNestingTrolleyAssignment) {
        switch (option) {
            case 'percentage':
                return this.getTaskCompletionPercentage(task);
            case 'completed-trolleys':
                return this.getNumberOfCompletedTaskTrolleyAssignments(task);
            default:
                return null;
        }
    } 

    if (task instanceof Task) {
        switch (option) {
            case 'color':
                return this.getStatusColor(task.taskStatus);
            case 'translate':
                return this.translateStatusEnToPl(task.taskStatus);
            default:
                return null;
        }
    }

    return null;
}


  
  private getStatusColor(status: string): string {
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

  private translateStatusEnToPl(status: string): string {
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
  
  private getTaskCompletionPercentage(assignments: TaskNestingTrolleyAssignment[] | null): number {
    if (assignments){
      const countTrolleys = assignments.length;
      const countTaskCompletedTrolleys = assignments.filter(item => item.isTaskCompleted).length;

      return Math.floor((countTaskCompletedTrolleys * 100) / countTrolleys);
    }
    return 0;
  }

  private getNumberOfCompletedTaskTrolleyAssignments(assignments: TaskNestingTrolleyAssignment[] | null): number {
    if (assignments){
      return assignments.filter(it => it.isTaskCompleted).length;
    }
    return -1;
  }

}
