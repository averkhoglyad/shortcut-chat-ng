import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatViewPageComponent } from './chat-view-page.component';

describe('ChatViewPageComponent', () => {
  let component: ChatViewPageComponent;
  let fixture: ComponentFixture<ChatViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatViewPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
