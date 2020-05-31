import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TollListComponent } from './toll-list.component';

describe('TollListComponent', () => {
  let component: TollListComponent;
  let fixture: ComponentFixture<TollListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollListComponent ]
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
