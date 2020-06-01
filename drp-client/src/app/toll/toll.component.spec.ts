import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TollComponent } from './toll.component';
import { TollService } from '../toll.service';


fdescribe('TollComponent', () => {
  let component: TollComponent;
  let fixture: ComponentFixture<TollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [TollService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
