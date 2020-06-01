import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { TollComponent } from './toll.component';
import { TollService } from '../toll.service';


fdescribe('TollComponent', () => {
  let component: TollComponent;
  let fixture: ComponentFixture<TollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollComponent ],
      imports: [ FormsModule, ReactiveFormsModule, HttpClientModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [TollService, HttpClient]
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
