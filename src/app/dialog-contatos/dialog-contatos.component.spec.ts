import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContatosComponent } from './dialog-contatos.component';

describe('DialogContatosComponent', () => {
  let component: DialogContatosComponent;
  let fixture: ComponentFixture<DialogContatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
