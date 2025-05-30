import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretaryHomeComponent } from './secretary-home.component';

describe('SecretaryHomeComponent', () => {
  let component: SecretaryHomeComponent;
  let fixture: ComponentFixture<SecretaryHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretaryHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretaryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
