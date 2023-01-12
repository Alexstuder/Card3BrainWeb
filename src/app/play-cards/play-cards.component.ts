import {Component, OnDestroy, OnInit} from '@angular/core';
import * as bootstrap from 'bootstrap';
import {
  Card, CardsDto,
  Category,
  User,
} from "../openapi-gen";

@Component({
  selector: 'app-play-cards',
  templateUrl: './play-cards.component.html',
  styleUrls: ['./play-cards.component.scss']
})
export class PlayCardsComponent implements OnInit, OnDestroy{
  cardHeader: String = "";
  cardBody: String = "";
  buttonText: String = "";

  cardsToPlay:CardsDto = {};
  actualCardNumber:number = 0;
  actualQuestion:Boolean = false;

  constructor() {}

  ngOnInit(): void {
    let user: User = {
      id:99,
      userName:"Hampi",
      firstName:"Müller",
      mailAddress: "Hampi@test.ch"
    }
    let category:Category ={
      id :44,
      owner:user,
      categoryName:"Mathe"
    }
    let card1 : Card = {
      id: 1,
      question: "1+2",
      answer: "3",
      category: category
    };
    let card2 : Card = {
      id: 2,
      question: "frage",
      answer: "antwort",
      category: category
    };
    let cardsTemp:Card[] = [card1,card2];

    let cards: CardsDto = {
      id: 1,
      cards: cardsTemp
    }
    this.cardsToPlay = cards;
    this.actualCardNumber = 0;
    this.showQuestion(true);

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
  ngOnDestroy(): void {
  }

  onClickCard() {
    this.showQuestion(!this.actualQuestion);
  }
  showQuestion(showAnswer: boolean){
    if (this.actualCardNumber < this.cardsToPlay!.cards!.length ?? 0) {
      this.actualQuestion = showAnswer;
      if (this.actualQuestion) {
        this.cardHeader = "Question";
        this.cardBody = this.cardsToPlay!.cards![this.actualCardNumber].question ?? "";
        this.buttonText = "show answer";
      } else {
        this.cardHeader = "Answer";
        this.cardBody = this.cardsToPlay!.cards![this.actualCardNumber].answer ?? "";
        this.buttonText = "show question"
      }
    }
  }

  onFalse() {
    //send information
    this.nextCard()
  }

  onTrue() {
    //send information
    this.nextCard()
  }

  private nextCard(){
    this.actualCardNumber++;
    if (this.actualCardNumber >= this.cardsToPlay!.cards!.length ?? 0){
      this.setToTheEnd()
    }else {
      this.showQuestion(true)
    }
  }
  private setToTheEnd(){
    this.cardBody = "All Questions done, go back to manage Category and select a new one"
    this.buttonText = "manage Category";
    this.actualQuestion = true;
  }
}
