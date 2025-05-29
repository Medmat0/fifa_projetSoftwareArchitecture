import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportMessagesComponent } from './support-messages.component';

describe('SupportMessagesComponent', () => {
  let component: SupportMessagesComponent;
  let fixture: ComponentFixture<SupportMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
