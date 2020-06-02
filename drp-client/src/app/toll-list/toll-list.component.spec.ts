import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { TollListComponent } from './toll-list.component';
import { TollService } from '../toll.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';


describe('TollListComponent', () => {
  let component: TollListComponent;
  let fixture: ComponentFixture<TollListComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollListComponent ],
      imports: [ HttpClientModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [TollService, HttpClient, 
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
    fixture = TestBed.createComponent(TollListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
