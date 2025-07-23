import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAngularCommons2 } from './my-angular-commons2';

describe('MyAngularCommons2', () => {
  let component: MyAngularCommons2;
  let fixture: ComponentFixture<MyAngularCommons2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAngularCommons2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAngularCommons2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
