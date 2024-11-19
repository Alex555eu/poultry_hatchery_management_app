import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap, tap } from 'rxjs';
import { CandlingService } from '../../../services/candling/candling.service';
import { Candling } from '../../../models/candling.model';
import { CandlingNestingTrolleyAssignment } from '../../../models/candling-nesting-trolley-assignment.model';

@Component({
  selector: 'app-open-candling',
  standalone: true,
  imports: [],
  templateUrl: './open-candling.component.html',
  styleUrl: './open-candling.component.css'
})
export class OpenCandlingComponent implements OnInit {

  candling: Candling | null = null;
  candlingNestingTrolleyAssignment: CandlingNestingTrolleyAssignment[] | null = null;


  constructor(
    private route: ActivatedRoute,
    private candlingService: CandlingService
  ){}

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const query = params.get('id');
        if (query)
          return this.initCandling(query)
        return of();
      }),
      switchMap(response => this.initCandlingTrolleys(response) || of()),
      switchMap(response => this.initRejections(response) || of())
    )
  }

  private initCandling(candlingId: string): Observable<any> {
    return this.candlingService.getCandlingById(candlingId).pipe(
      tap(response => {
        if (response) {
          this.candling = response;
        }
      })
    )
  }

  private initCandlingTrolleys(candling: Candling): Observable<any> {
    return this.candlingService.getAllCandlingTrolleyAssignments(candling.id).pipe(
      tap(response => {
        if (response) {

        }
      })
    )
  } 

  private initRejections(candling: Candling): Observable<any> {
    
  }




}
