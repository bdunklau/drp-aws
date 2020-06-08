import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { ChargeListComponent } from './charge-list.component';
import { ChargeService } from '../charge.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


describe('ChargeListComponent', () => {
  let component: ChargeListComponent;
  let fixture: ComponentFixture<ChargeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeListComponent ],
      imports: [ HttpClientModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [ChargeService, HttpClient,

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
    fixture = TestBed.createComponent(ChargeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
