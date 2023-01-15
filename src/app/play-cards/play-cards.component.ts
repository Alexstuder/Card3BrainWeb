import {Component, OnDestroy, OnInit} from '@angular/core';
import * as bootstrap from 'bootstrap';
import {
  CardDto, CardRestControllerService,
  CategoryDto, LearnDto, LearnRestControllerService,
  UserDto,
} from "../openapi-gen";
import {Subscription} from "rxjs";
import {ToastService} from "../services/toast.service";

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

  private cardsSubscription: Subscription | undefined;
  private learnSubscription: Subscription | undefined;

  constructor(private readonly cardRestControllerService :CardRestControllerService,
              private readonly toastService: ToastService,
              private readonly learnRestControllerService: LearnRestControllerService) {}

  ngOnInit(): void {
    /*
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
    this.cardsToPlay = [card1,card2]; */

    this.cardsSubscription = this.cardRestControllerService.getCardsByCategory(162).subscribe(
      data => {
        this.cardsToPlay = data;
        this.actualCardNumber = 0;
        this.showQuestion(true);
      },err =>{
        if( !this.toastService.showHttpErrorToast(err))
          this.toastService.showErrorToast('error','get all user gone wrong',);
        console.log(err);
      })


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
  showQuestion(showAnswer: boolean) {
    if (this.cardsToPlay !== undefined) {
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
  }

  onFalse() {
    if(this.sendBack(false)) {
      this.nextCard()
    }
  }

  onTrue() {
    if(this.sendBack(true)) {
      this.nextCard()
    }
  }

  private sendBack(resultCorrect:boolean){
    let learnDto: LearnDto = {
      cardId : this.cardsToPlay![this.actualCardNumber].id,
      correct: resultCorrect
    }

    this.learnSubscription = this.learnRestControllerService.cardLearned(learnDto).subscribe(
      data => {
      },
err =>{
        if( !this.toastService.showHttpErrorToast(err))
          this.toastService.showErrorToast('error','learn Rest gone wrong',);
        console.log(err);
        return false
      })
    return true
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
