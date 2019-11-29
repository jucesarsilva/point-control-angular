import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTimePickerComponent } from './dialog-time-picker.component';

describe('DialogTimePickerComponent', () => {
  let component: DialogTimePickerComponent;
  let fixture: ComponentFixture<DialogTimePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTimePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
