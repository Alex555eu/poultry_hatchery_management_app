import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RejectionPanelComponent } from '../../candling/open-candling/rejection-panel/rejection-panel.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RejectionService } from '../../../services/rejections/rejection.service';
import { HatchingTrolleyService } from '../../../services/hatching-trolley/hatching-trolley.service';
import { TasksService } from '../../../services/tasks/tasks.service';
import { HatchingService } from '../../../services/hatching/hatching.service';
import { Emergence } from '../../../models/emergence.model';
import { EmergenceService } from '../../../services/emergence/emergence.service';
import { response } from 'express';
import { HatchingTrolley } from '../../../models/hatching-trolley.model';
import { HatchingResult } from '../../../models/hatching-result.model';
import { HatchingTrolleyContent } from '../../../models/hatching-trolley-content.model';
import { Hatching } from '../../../models/hatching.model';
import { HatchingLoadedDeliveries } from '../../../models/hatching-loaded-deliveries.model';
import { Rejection4PanelComponent } from '../rejection4-panel/rejection4-panel.component';
import { Rejection4 } from '../../../models/rejection4.model';
import { Nesting } from '../../../models/nesting.model';
import { NestingService } from '../../../services/nesting/nesting.service';
import { TaskStatus } from '../../../models/task-status-enum';

@Component({
  selector: 'app-open-emergence',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    CommonModule,
    MatMenuModule,
    MatListModule,
    FormsModule,
    MatDividerModule,
    MatDialogModule,
    Rejection4PanelComponent,
    RejectionPanelComponent,
    MatFormFieldModule,
    MatSelectModule    
  ],
  templateUrl: './open-emergence.component.html',
  styleUrl: './open-emergence.component.css'
})
export class OpenEmergenceComponent implements OnInit {

  emergence: Emergence | null = null;

  hatchingTrolleys: HatchingTrolley[] = [];
  hatchingTrolleyContentMapping = new Map<HatchingTrolley, HatchingTrolleyContent[]>();
  hldContentMapping = new Map<HatchingLoadedDeliveries, HatchingTrolleyContent[]>();

  hatchingResults: HatchingResult[] = [];
  selectedHatchingResult: HatchingResult[] | null = null;
  
  rejectionCauses: string[] = [];  
  rejectionsMapping = new Map<HatchingResult, Rejection4[]>();

  constructor(
    private route: ActivatedRoute,
    private emergenceService: EmergenceService,
    private hatchingService: HatchingService,
    private rejectionService: RejectionService,
    private hatchingTrolleyService: HatchingTrolleyService,
    private taskService: TasksService,
    private nestingService: NestingService,
    private dialog: MatDialog,
  ){}  

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const query = params.get('id');
        if (query)
          return this.initEmergence(query)
        return of();
      }),
      switchMap(emergence => this.initHatchingTrolleys(emergence.hatching).pipe(map(() => emergence))),
      switchMap(emergence => this.initHatchingResults(emergence.hatching).pipe(map(() => emergence))),
      switchMap(emergence => this.initRejectionCauses().pipe(map(() => emergence))),
      switchMap(emergence => this.initRejections(emergence))

    ).subscribe();
  }

  finishEmergence() {
    this.taskService.patchTaskStatus(this.emergence!.task.id, TaskStatus.COMPLETED).subscribe(
      response => {
        const nest = this.emergence!.hatching.nesting;
        this.nestingService.putNesting({
          id: nest.id,
          title: nest.title,
          description: nest?.description,
          isFinished: true
        }).subscribe(response => {
          if (response) {
            this.ngOnInit();
          }
        });          
    });
  }

  updateAfterRejection(flag: boolean) {
    if (flag) {
      this.ngOnInit();
    }
  }

  
  countHatchingTrolleyCapacity(trolley: HatchingTrolley) {
    return this.hatchingTrolleyContentMapping.get(trolley)?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  findTrolleyLocation(trolley: HatchingTrolley) {
    //todo: import from hatching incubator when ready
  }

  private initEmergence(emergenceId: string): Observable<Emergence> {
    return this.emergenceService.getEmergenceById(emergenceId).pipe(
      tap(response => {
        if (response) {
          this.emergence = response;
        }
      })
    );
  }

  private initHatchingTrolleys(hatching: Hatching): Observable<any> {
    return this.hatchingTrolleyService.getHatchingTrolleyContentByHatchingId(hatching.id).pipe(
      tap(response => {
        this.mapTrolleyToContent(response);
        this.mapHLDToContent(response);
      })
    );
  }  

  private mapTrolleyToContent(response: HatchingTrolleyContent[]) {
    let tmp = new Map<string, HatchingTrolleyContent[]>();// string -> trolley id
    response.forEach(element => {
      const trolleyId = element.hatchingTrolley.id;
      if (tmp.has(trolleyId)) {
        tmp.set(trolleyId, tmp.get(trolleyId)?.concat(element) || [element])
      } else {
        tmp.set(trolleyId, [element]);
      }
    })
    let trolleys: HatchingTrolley[] = [];
    Array.from(tmp.keys()).forEach(element => {
      const trolley = tmp.get(element)![0]!.hatchingTrolley;
      trolleys = trolleys.concat(trolley);
      this.hatchingTrolleyContentMapping.set(trolley, tmp.get(element) || []);
    })
    this.hatchingTrolleys = trolleys;
  }

  private mapHLDToContent(response: HatchingTrolleyContent[]) {
    let tmp = new Map<string, HatchingTrolleyContent[]>();// string -> hld id
    response.forEach(element => {
      const hldId = element.hatchingLoadedDeliveries.id;
      if (tmp.has(hldId)) {
        tmp.set(hldId, tmp.get(hldId)?.concat(element) || [element])
      } else {
        tmp.set(hldId, [element]);
      }
    })
    let hld: HatchingLoadedDeliveries[] = [];
    Array.from(tmp.keys()).forEach(element => {
      const hld2 = tmp.get(element)![0]!.hatchingLoadedDeliveries;
      hld = hld.concat(hld2);
      this.hldContentMapping.set(hld2, tmp.get(element) || []);
    })
  }

  private initHatchingResults(hatching: Hatching): Observable<any> {
    return this.hatchingService.getAllHatchingResults(hatching.id).pipe(
      tap(response => {
        if (response) {
          this.hatchingResults = response;
        }
      })
    )
  }  

  private initRejectionCauses(): Observable<any> {
    return this.rejectionService.getPossibleRejection4Causes().pipe(
      tap(response => {
        if (response && response.length > 0) {
          this.rejectionCauses = response;
        }
      })
    )
  }  

  private initRejections(emerg: Emergence): Observable<any> {
    return this.rejectionService.getAllRejection4(emerg.hatching.nesting.id).pipe(
      tap(response => {
        if (response) {
          response.forEach(reject => {
            const tmp = this.hatchingResults.find(item => item.id === reject.hatchingResult.id);
            if (tmp){
              if (this.rejectionsMapping.has(tmp)) {
                this.rejectionsMapping.set(tmp, this.rejectionsMapping.get(tmp)?.concat(reject) || []);
              } else {
                this.rejectionsMapping.set(tmp, [reject]);
              }
            }
          })
        }
      })
    )
  }
  
}
