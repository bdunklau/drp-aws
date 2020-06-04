import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChargeFormComponent } from './charge-form.component';

describe('ChargeFormComponent', () => {
  let component: ChargeFormComponent;
  let fixture: ComponentFixture<ChargeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeFormComponent ],
      imports: [ FormsModule, HttpClientModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
          HttpClient,
	  {
              provide: Router,
              useClass: class { navigate = jasmine.createSpy("navigate"); }
          },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
