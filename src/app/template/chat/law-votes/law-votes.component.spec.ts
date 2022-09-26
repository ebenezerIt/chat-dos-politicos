import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawVotesComponent } from './law-votes.component';

describe('LawVotesComponent', () => {
  let component: LawVotesComponent;
  let fixture: ComponentFixture<LawVotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LawVotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LawVotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
