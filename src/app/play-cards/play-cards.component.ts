import {Component, OnDestroy, OnInit} from '@angular/core';
import * as bootstrap from 'bootstrap';
import {
  CardDto, CardRestControllerService,
  LearnDto, LearnRestControllerService,
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
      this.cardsSubscription = this.learnRestControllerService.cardsToLearn(this.categoryId).subscribe({
        next: (data) => {
          this.cardsToPlay = data;
          this.cardArrayLength = data.length
          this.actualCardNumber = 0;
          if (this.cardsToPlay && this.cardsToPlay.length > 0) {
            this.finished = false
            this.actualCardNumber = 0;
            this.showQuestion(true);
          } else {
            this.toastService.showWarningToast('No Cards', 'No Cards to learn in this category');
            this.returnPage()
          }
        },
        error: (err) => {
          if (!this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error', 'get all user gone wrong');
          console.log(err);
        }
      })
    }else{
      this.toastService.showErrorToast('error', 'category is invalid');
    }

    this.actualCardNumber = 0;
    this.showQuestion(true);

    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    let questionbox = document.getElementById('questionbox');
    if (questionbox) {
      let hamming = new Hammer(questionbox);
      hamming.on("panleft panright tap", (ev) => {
        if (ev.type == "panleft") {
          if(!this.actualQuestion) {
            this.onTrue();
          }
        }
        if (ev.type == "panright") {
          if(!this.actualQuestion) {
            this.onFalse();
          }
        }
        if (ev.type == "tap") {
          this.onClickCard()
        }
        //console.log(ev.type + " gesture detected.");
      });
    }
  }
  ngOnDestroy(): void {
  }

  onClickCard() {
    if(this.finished){
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

    this.learnSubscription = this.learnRestControllerService.cardLearned(learnDto).subscribe({
      error: (err) => {
        if (!this.toastService.showHttpErrorToast(err))
          this.toastService.showErrorToast('error', 'learn Rest gone wrong',);
        console.log(err);
        return false
      }
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
    this.finished = true
    this.cardBody = "All Questions done, go back to manage Category and select a new one"
    this.buttonText = "manage Category";
    this.actualCardNumber = 0
    this.cardArrayLength = 1
    this.actualQuestion = true;
  }

  returnPage() {
    this.router.navigate(["/category"])
  }
}
