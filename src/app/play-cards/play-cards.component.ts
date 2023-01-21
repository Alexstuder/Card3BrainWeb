import {Component, OnDestroy, OnInit} from '@angular/core';
import * as bootstrap from 'bootstrap';
import {
  CardDto, CardRestControllerService,
  CategoryDto, LearnDto, LearnRestControllerService,
  UserDto,
} from "../openapi-gen";
import {Subscription} from "rxjs";
import {ToastService} from "../services/toast.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-play-cards',
  templateUrl: './play-cards.component.html',
  styleUrls: ['./play-cards.component.scss']
})
export class PlayCardsComponent implements OnInit, OnDestroy{
  cardHeader: String = "";
  cardBody: String = "";
  buttonText: String = "";

  private cardsToPlay:Array<CardDto> | undefined;
  cardArrayLength : number = 0
  actualCardNumber:number = 0
  actualQuestion:Boolean = false;

  private categoryId : number |undefined
  private finished : boolean = true

  private cardsSubscription: Subscription | undefined;
  private learnSubscription: Subscription | undefined;

  constructor(private readonly cardRestControllerService :CardRestControllerService,
              private readonly toastService: ToastService,
              private readonly learnRestControllerService: LearnRestControllerService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.categoryId = params['categoryid'];
    })
    if(this.categoryId !== undefined) {
      this.cardsSubscription = this.learnRestControllerService.cardsToLearn(this.categoryId).subscribe(
        data => {
          this.cardsToPlay = data;
          this.cardArrayLength = data.length
          this.actualCardNumber = 0;
          this.finished = true
          if(this.cardsToPlay != undefined ){
            if(this.cardsToPlay.length >= 0) {
              this.finished = false
            }
          }
          if(this.finished){
            this.setToTheEnd()
          }
          this.showQuestion(true);
        }, err => {
          if (!this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error', 'get all user gone wrong',);
          console.log(err);
        })

    }


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
    if(this.finished ==true){
      window.location.href="category?userid=69"; //Todo return right userid
      return
    }
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

  end() {
    window.location.href="category?userid=69"; //Todo return right userid
  }
}
