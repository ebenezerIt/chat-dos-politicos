import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceButtonComponent } from './voice-button.component';

describe('VoiceButtonComponent', () => {
  let component: VoiceButtonComponent;
  let fixture: ComponentFixture<VoiceButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
