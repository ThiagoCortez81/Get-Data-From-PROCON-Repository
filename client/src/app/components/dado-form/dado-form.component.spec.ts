import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DadoFormComponent } from './dado-form.component';

describe('DadoFormComponent', () => {
  let component: DadoFormComponent;
  let fixture: ComponentFixture<DadoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DadoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DadoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
