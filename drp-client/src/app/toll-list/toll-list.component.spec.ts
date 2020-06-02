import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { TollListComponent } from './toll-list.component';
import { TollService } from '../toll.service';
import { Router } from '@angular/router';


describe('TollListComponent', () => {
  let component: TollListComponent;
  let fixture: ComponentFixture<TollListComponent>;

  const fakeActivatedRoute = {
    snapshot: { data: { ... } }
  } as ActivatedRoute;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollListComponent ],
      imports: [ HttpClientModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [TollService, HttpClient, 
	          {provide: ActivatedRoute, useValue: fakeActivatedRoute}]
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
