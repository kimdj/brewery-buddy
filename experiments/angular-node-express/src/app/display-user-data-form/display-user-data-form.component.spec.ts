import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayUserDataFormComponent } from './display-user-data-form.component';

describe('DisplayUserDataFormComponent', () => {
  let component: DisplayUserDataFormComponent;
  let fixture: ComponentFixture<DisplayUserDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayUserDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayUserDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
