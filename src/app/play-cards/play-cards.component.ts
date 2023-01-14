import {Component, OnDestroy, OnInit} from '@angular/core';
import * as bootstrap from 'bootstrap';
import {
  CardDto,
  CategoryDto,
  UserDto,
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

  cardsToPlay:Array<CardDto> | undefined;
  actualCardNumber:number = 0;
  actualQuestion:Boolean = false;

  constructor() {}

  ngOnInit(): void {
    let user: UserDto = {
      id:99,
      userName:"Hampi",
      firstName:"Müller",
      mailAddress: "Hampi@test.ch"
    }
    let category:CategoryDto ={
      id :44,
      owner:user.id,
      categoryName:"Mathe"
    }
    let card1 : CardDto = {
      id: 1,
      question: "1+2",
      answer: "3",
      categoryId: category.id
    };
    let card2 : CardDto = {
      id: 2,
      question: "frage",
      answer: "antwort",
      categoryId: category.id
    };
    this.cardsToPlay = [card1,card2];
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
    if (this.actualCardNumber < this.cardsToPlay!.length ?? 0) {
      this.actualQuestion = showAnswer;
      if (this.actualQuestion) {
        this.cardHeader = "Question";
        this.cardBody = this.cardsToPlay![this.actualCardNumber].question ?? "";
        this.buttonText = "show answer";
      } else {
        this.cardHeader = "Answer";
        this.cardBody = this.cardsToPlay![this.actualCardNumber].answer ?? "";
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
    if (this.actualCardNumber >= this.cardsToPlay!.length ?? 0){
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
