import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {
  UserRestControllerService,
  UserDto,
  CategoryRestControllerService,
  CardRestControllerService,
  CategoryDto, CardDto,
} from "../openapi-gen";
import {ToastService} from "../services/toast.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-manage-cards',
  templateUrl: './manage-cards.component.html',
  styleUrls: ['./manage-cards.component.scss']
})
export class ManageCardsComponent implements OnInit, OnDestroy{
  @ViewChild('categoryNameTextField', {static: true}) categoryNameTextField: ElementRef | undefined;
  @ViewChild('questionTextField', {static: true}) questionTextField: ElementRef | undefined;
  @ViewChild('answerTextField', {static: true}) answerTextField: ElementRef | undefined;

  selectedCategory: CategoryDto ={};
  cards: Array<CardDto> | undefined;
  selectedCard: CardDto | undefined;

  categoryId : number | undefined
  private userId : number | undefined

  constructor( private readonly categoryRestControllerService:CategoryRestControllerService,
              private readonly cardRestControllerService :CardRestControllerService,
              private readonly toastService: ToastService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.categoryId = params['categoryid'];
      this.userId = params['userid'];
    })
    this.updateCards();
  }
  ngOnDestroy(): void {}

/*
  updateCategories():void{
    if (this.userId != undefined)  {
      this.categoryRestControllerService.getAllCategoriesOfUser(this.userId).subscribe({
        next: (data) => this.categories = data,
        error:(err) =>  console.log(err)
      });
    }
  } */


  updateCards():void{
    if (this.categoryId != undefined)  {
      //this.cardsSubscription = this.cardRestControllerService.getCardsByCategory(this.selectedCategory.id!).subscribe({
      this.cardRestControllerService.getCardsByCategory(this.categoryId).subscribe({
        next: (data) => this.cards = data,
        error:(err) =>  console.log(err)
      });
    }
  }

  onClickCard(card: CardDto){
    this.selectedCard = card;
    if (this.questionTextField !== undefined &&
      this.answerTextField !== undefined) {
      this.questionTextField.nativeElement.value = this.selectedCard.question
      this.answerTextField.nativeElement.value =this.selectedCard.answer
    }
  }

  onNewCard() {
    if (this.questionTextField !== undefined &&
      this.answerTextField !== undefined) {
      let card: CardDto = {
        answer: this.answerTextField.nativeElement.value,
        question: this.questionTextField.nativeElement.value,
        categoryId: 162 //ToDo this.selectedCategory.id
      }
      let newCard:CardDto
      this.cardRestControllerService.addCard(card).subscribe(
        data=>{
            this.updateCards();
          },err =>{
            if( !this.toastService.showHttpErrorToast(err))
              this.toastService.showErrorToast('error','create card gone wrong',);
            console.log(err);
          })

    }
  }

  onUpdateCard() {
    if (this.questionTextField !== undefined &&
      this.answerTextField !== undefined) {
      let card: CardDto = {
        id: this.selectedCard?.id,
        answer: this.answerTextField.nativeElement.value,
        question: this.questionTextField.nativeElement.value,
        categoryId: 162 //ToDo this.selectedCategory.id
      }
      let newCard:CardDto
      this.cardRestControllerService.updateCard(card).subscribe(
        data=>{
          this.updateCards();
        },err =>{
          if( !this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error','create card gone wrong',);
          console.log(err);
        })

    }
  }

  onClickSubmit() {
    if (this.categoryNameTextField !== undefined){
      let categoryNameTemp: string = this.categoryNameTextField.nativeElement.value;
      if (this.userId != undefined || this.userId != null)  {
        let category: CategoryDto = {
          id : 0,
          categoryName: categoryNameTemp,
          owner: this.userId
        }
        this.categoryRestControllerService.createCategory(category).subscribe(
          data =>{
            this.selectedCategory = data;
            // @ts-ignore
            this.categoryNameTextField.nativeElement.value = this.selectedCategory.categoryName
          },
          err => console.log(err));
        this.categoryNameTextField.nativeElement.value="";
      }
    }
  }
}
