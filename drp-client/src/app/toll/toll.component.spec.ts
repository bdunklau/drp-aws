import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { TollComponent } from './toll.component';
import { TollService } from '../toll.service';
import { ActivatedRoute } from '@angular/router';


describe('TollComponent', () => {
  let component: TollComponent;
  let fixture: ComponentFixture<TollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollComponent ],
      imports: [ FormsModule, HttpClientModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [TollService, HttpClient, 
	     {provide: ActivatedRoute, useValue: {snapshot:{paramMap:{get: function(str) {return '123'} }} }   }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
