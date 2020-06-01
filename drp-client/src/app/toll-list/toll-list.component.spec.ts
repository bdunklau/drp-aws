import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TollListComponent } from './toll-list.component';
import { TollService } from '../toll.service';

describe('TollListComponent', () => {
  let component: TollListComponent;
  let fixture: ComponentFixture<TollListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollListComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [TollService]
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
