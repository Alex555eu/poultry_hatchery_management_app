import { Component, OnInit } from '@angular/core';
import { NestingIncubatorService } from '../../services/nesting-incubator/nesting-incubator.service';
import { NestingIncubator } from '../../models/nesting-incubator.model';
import { HatchingIncubator } from '../../models/hatching-incubator.model';
import { HatchingIncubatorService } from '../../services/hatching-incubator/hatching-incubator.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-incubators',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
],
  templateUrl: './incubators.component.html',
  styleUrl: './incubators.component.css'
})
export class IncubatorsComponent implements OnInit {

nestingIncubatorsAll: NestingIncubator[] | null = null;
hatchingIncubatorsAll: HatchingIncubator[] | null = null;


constructor(
  private nestingIncubatorService: NestingIncubatorService,
  private hatchingIncubatorService: HatchingIncubatorService,
){}

ngOnInit(): void {
    let nestingIncubators$ = this.nestingIncubatorService.getAllNestingIncubators();
    nestingIncubators$.subscribe(incubators => {
      this.nestingIncubatorsAll = incubators;
    });
    let hatchingIncubators$ = this.hatchingIncubatorService.getAllHatchingIncubators();
    hatchingIncubators$.subscribe(incubators => {
      this.hatchingIncubatorsAll = incubators;
    });
}


}
