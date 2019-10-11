import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostingStrategyComponent } from './hosting-strategy.component';

describe('HostingStrategyComponent', () => {
  let component: HostingStrategyComponent;
  let fixture: ComponentFixture<HostingStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostingStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostingStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
