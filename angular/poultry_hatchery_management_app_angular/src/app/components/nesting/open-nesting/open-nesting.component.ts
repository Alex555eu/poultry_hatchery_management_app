import { config } from './../../../app.config.server';
import { Nesting } from './../../../models/nesting.model';
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NestingService } from '../../../services/nesting/nesting.service';
import { of, switchMap, Observable, map, tap } from 'rxjs';
import { DeliveriesService } from '../../../services/deliveries/deliveries.service';
import { NestingTrolleyService } from '../../../services/nesting-trolley/nesting-trolley.service';
import { NestingLoadedDeliveriesService } from '../../../services/nesting-loaded-deliveries/nesting-loaded-deliveries.service';
import { NestingLoadedDeliveries } from '../../../models/nesting-loaded-deliveries.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NestingTrolley } from '../../../models/nesting-trolley.model';
import { NestingTrolleyContent } from '../../../models/nesting-trolley-content.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InspectNestingTrolleyComponent } from './inspect-nesting-trolley/inspect-nesting-trolley.component';
import { Rejection1 } from '../../../models/rejection1.model';
import { RejectionService } from '../../../services/rejections/rejection.service';
import { Rejection1PanelComponent } from './rejection1-panel/rejection1-panel.component';

@Component({
  selector: 'app-open-nesting',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatListModule,
    FormsModule,
    CommonModule,
    Rejection1PanelComponent
  ],
  templateUrl: './open-nesting.component.html',
  styleUrl: './open-nesting.component.css'
})
export class OpenNestingComponent implements OnInit {

  @ViewChildren('nldListOptionContainers') nldListOptionContainers!: QueryList<ElementRef>;
  @ViewChildren('trolleyListOptionContainers') trolleyListOptionContainers!: QueryList<ElementRef>;

  selectedNLD: NestingLoadedDeliveries[] | null = null;
  selectedNestingTrolley: NestingTrolley | null = null;

  nesting: Nesting | null = null;

  nld: NestingLoadedDeliveries[] | null = null;

  nestingTrolleys: NestingTrolley[] | null = null;
  nestingTrolleysContentAssignment = new Map<string, NestingTrolleyContent[]>(); // string -> nestingTrolleyId

  trolleyRejection = new Map<string, Rejection1[]>();// string -> nesting loaded delivery id
  rejectionCauses: string[] = [];


  constructor(
    private route: ActivatedRoute,
    private nestingService: NestingService,
    private deliveriesService: DeliveriesService,
    private nestingTrolleyService: NestingTrolleyService,
    private nldService: NestingLoadedDeliveriesService,
    private dialog: MatDialog,
    private rejectionsService: RejectionService
  ){}

ngOnInit(): void {
  this.route.queryParamMap.pipe(
    switchMap(params => {
      const query = params.get('id');
      if (query)
        return this.initNesting(query)
      return of();
    }),
    // init existing nesting loaded deliveries
    switchMap(nesting => this.initNLD(nesting.id).pipe(map(() => nesting))),

    // init available nesting trolleys (available == empty, w/o content)
    switchMap(nesting => this.initNestingTrolleys(nesting.id).pipe(map(() => nesting))),
    
    //init rejection causes for rejection 1
    switchMap(nesting => this.initRejectionCauses().pipe(map(() => nesting))),

    // init rejections
    switchMap(nesting => this.initRejections1(nesting.id))

  ).subscribe();
}

selectNLD(element: HTMLDivElement) {
  const bgColor = 'lightgray'
  this.nldListOptionContainers.forEach(item => {
    if (item.nativeElement.style.backgroundColor === bgColor) {
      item.nativeElement.style.backgroundColor = ''
    }
  });
  element.style.backgroundColor = bgColor;
}

addDeliveryToNesting() {

}

addNestingTrolleyToNesting() {

}

selectNestingTrolley(trolley: NestingTrolley) {
  let config = new MatDialogConfig();
  config.data = {
    trolley: trolley,
    trolleyContent: Array.from(this.nestingTrolleysContentAssignment.get(trolley.id)?.values() || []),
    selectedNLD: this.selectedNLD?.[0]
  }
  let ref = this.dialog.open(InspectNestingTrolleyComponent, config);
  ref.afterClosed().subscribe(result => {
    if (result) {
      this.ngOnInit();
    }
  });
}


countTrolleyCapacity(trolley: NestingTrolley) {
  return this.nestingTrolleysContentAssignment.get(trolley.id)?.reduce((sum, item) => sum + item.quantity, 0) || -1
}

updateAfterRejection(flag: boolean) {
  if (flag) {
    this.ngOnInit();
  }
}


private initNesting(nestingId: string): Observable<Nesting> {
  return this.nestingService.getNestingById(nestingId).pipe(
    tap(nesting => {
      if (nesting) {
        this.nesting = nesting;
      }
    })
  );
}

private initNLD(nestingId: string): Observable<NestingLoadedDeliveries[]> {
  return this.nldService.getAllNestingLoadedDeliveriesByNestingId(nestingId).pipe(
    tap(nld => {
      if (nld) {
        this.nld = nld;
      }
    })
  )
}

private initNestingTrolleys(nestingId: string): Observable<NestingTrolleyContent[]> {
  return this.nestingTrolleyService.getNestingTrolleyContentByNestingId(nestingId).pipe(
    tap(content => {
      if (content) {
        let tmp = new Map<string, NestingTrolleyContent[]>();
        content.forEach(el => {
          const trolleyId = el.nestingTrolley.id;
          if (tmp.has(trolleyId)) {
            tmp.set(trolleyId, tmp.get(trolleyId)?.concat(el) || [el]);
          } else {
            tmp.set(trolleyId, [el]);
          }
        });
        this.nestingTrolleys = Array.from(tmp.keys()).map(id => {
          return content.find(el => el.nestingTrolley.id === id)?.nestingTrolley || null;
        }).filter((trolley): trolley is NestingTrolley => trolley !== null);
        this.nestingTrolleysContentAssignment = tmp;
      }
      
    })
  )
}

private initRejections1(nestingId: string): Observable<any> {
  return this.rejectionsService.getAllRejection1(nestingId).pipe(
    tap(response => {
      if (response) {
        let newMap = new Map<string, Rejection1[]>();
        response.forEach(rejections => {
          const id = rejections.nestingLoadedDeliveries.id;
          if (newMap.has(id)) {
            newMap.set(id, newMap.get(id)?.concat(rejections) || []);
          } else {
            newMap.set(id, [rejections]);
          }
        })
        this.trolleyRejection = newMap;
      }
    })
  );
}

private initRejectionCauses(): Observable<any> {
  return this.rejectionsService.getPossibleRejection1Causes().pipe(
    tap(response => {
      if (response && response.length > 0) {
        this.rejectionCauses = response;
      }
    })
  )
}


}
