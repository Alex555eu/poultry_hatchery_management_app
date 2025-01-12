import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrganisationDetailsComponent } from './edit-organisation-details.component';

describe('EditOrganisationDetailsComponent', () => {
  let component: EditOrganisationDetailsComponent;
  let fixture: ComponentFixture<EditOrganisationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOrganisationDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditOrganisationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
