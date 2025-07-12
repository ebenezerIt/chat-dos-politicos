import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonUserListComponent } from './skeleton-message-list.component';

describe('SkeletonUserListComponent', () => {
  let component: SkeletonUserListComponent;
  let fixture: ComponentFixture<SkeletonUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SkeletonUserListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
