import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {
  Category,
  UserRestControllerService,
  User,
  UsersDto,
  UserDto,
  CategoryRestControllerService,
  CardRestControllerService,
  CategoriesDto, CategoryDto, CardsDto, Card,
} from "../openapi-gen";

@Component({
  selector: 'app-manage-cards',
  templateUrl: './manage-cards.component.html',
  styleUrls: ['./manage-cards.component.scss']
})
export class ManageCardsComponent implements OnInit, OnDestroy{
  @ViewChild('categoryNameTextField', {static: true}) categoryNameTextField: ElementRef | undefined;

  userList: UsersDto = {};
  selectedUser: UserDto ={};
  categories: CategoriesDto = {};
  selectedCategory: CategoryDto ={};
  cards: CardsDto = {};

  private userSubscription: Subscription | undefined;
  private categorySubscription: Subscription | undefined;
  private cardsSubscription: Subscription | undefined;

  constructor(private readonly userRestControllerService:UserRestControllerService,
              private readonly categoryRestControllerService:CategoryRestControllerService,
              private readonly cardRestControllerService :CardRestControllerService) {}

  ngOnInit(): void {
    this.updateUsers();
  }
  ngOnDestroy(): void {
    if (this.userSubscription != undefined)  {
      this.userSubscription.unsubscribe();
    }
  }

  updateUsers(): void {
    this.userSubscription = this.userRestControllerService.getAllUsers().subscribe({
      next: (data) => this.userList = data,
      error:(err) =>  console.log(err)
    });
  }

  onClickUser(user: UserDto) {
    this.selectedUser = user;
    this.updateCategories();
  }

  updateCategories():void{
    if (this.selectedUser != undefined)  {
      this.categorySubscription = this.categoryRestControllerService.getAllCategoriesOfUserName(this.selectedUser.userName).subscribe({
        next: (data) => this.categories = data,
        error:(err) =>  console.log(err)
      });
    }
  }

  onClickCategory(category: CategoryDto) {
    this.selectedCategory = category;
    this.updateCards();
  }

  updateCards():void{
    if (this.selectedCategory != undefined)  {
      this.cardsSubscription = this.cardRestControllerService.getCardsByCategory(this.selectedCategory).subscribe({
        next: (data) => this.cards = data,
        error:(err) =>  console.log(err)
      });
    }
  }

  onClickCard(card: Card){

  }

  onLoad() {
    let card1 : Card = {
      id: 1,
      question: "1+2",
      answer: "3",
      category: this.selectedCategory
    };
    let card2 : Card = {
      id: 2,
      question: "frage",
      answer: "antwort",
      category: this.selectedCategory
    };
    let cardsTemp:Card[] = [card1,card2];

    let cards: CardsDto = {
      id: 1,
      cards: cardsTemp
    }

  }
}
