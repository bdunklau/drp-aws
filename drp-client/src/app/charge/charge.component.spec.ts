import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChargeComponent } from './charge.component';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ChargeFormComponent } from '../charge-form/charge-form.component';
import { ChargeListComponent } from '../charge-list/charge-list.component';


describe('ChargeComponent', () => {
  let component: ChargeComponent;
  let fixture: ComponentFixture<ChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeComponent, ChargeFormComponent, ChargeListComponent ],
      imports: [ HttpClientModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
       providers: [
          HttpClient,
          {
              provide: Router,
              useClass: class { navigate = jasmine.createSpy("navigate"); }
          },
          {
            provide: ActivatedRoute,
              useValue: {
                snapshot: {
                  paramMap:{get: function(str) {return '123'} }
                },
                paramMap: {
                  subscribe: function(params:ParamMap) {
                  }
                }
              }
          }

      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
