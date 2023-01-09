import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayCardsComponent } from './play-cards.component';

describe('PlayCardsComponent', () => {
  let component: PlayCardsComponent;
  let fixture: ComponentFixture<PlayCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
