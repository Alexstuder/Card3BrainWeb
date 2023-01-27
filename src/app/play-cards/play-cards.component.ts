import {Component, OnDestroy, OnInit} from '@angular/core';
import * as bootstrap from 'bootstrap';
import {
  CardDto, CardRestControllerService,
  CategoryDto, LearnDto, LearnRestControllerService,
  UserDto,
} from "../openapi-gen";
import {Subscription} from "rxjs";
import {ToastService} from "../services/toast.service";
import {ActivatedRoute, Router} from "@angular/router";

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
              private route: ActivatedRoute,
              private readonly router: Router) {}

  ngOnInit(): void {
    let tempString = this.route.snapshot.paramMap.get('id')
    if (tempString){
      this.categoryId = +tempString
    }
    if(this.categoryId !== undefined) {
      this.cardsSubscription = this.learnRestControllerService.cardsToLearn(this.categoryId).subscribe(
        data => {
          this.cardsToPlay = data;
          this.cardArrayLength = data.length
          this.actualCardNumber = 0;
          if(this.cardsToPlay&&this.cardsToPlay.length >= 0){
            this.finished = false
            this.actualCardNumber = 0;
            this.showQuestion(true);
          } else{
            this.toastService.showWarningToast('No Cards', 'No Cards to learn in this category');
            this.returnPage()
          }
        }, err => {
          if (!this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error', 'get all user gone wrong');
          console.log(err);
        })
    }else{
      this.toastService.showErrorToast('error', 'category is invalid');
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
      this.returnPage()
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

  returnPage() {
    this.router.navigate(["/category"])
  }
}
