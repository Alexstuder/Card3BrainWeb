import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {
  UserRestControllerService,
  UserDto,
  CategoryRestControllerService,
  CardRestControllerService,
  CategoryDto, CardDto,
} from "../openapi-gen";

@Component({
  selector: 'app-manage-cards',
  templateUrl: './manage-cards.component.html',
  styleUrls: ['./manage-cards.component.scss']
})
export class ManageCardsComponent implements OnInit, OnDestroy{
  @ViewChild('categoryNameTextField', {static: true}) categoryNameTextField: ElementRef | undefined;

  userList: Array<UserDto> | undefined;
  selectedUser: UserDto ={};
  categories: Array<CategoryDto> | undefined;
  selectedCategory: CategoryDto ={};
  cards: Array<CardDto> | undefined;

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
      this.categorySubscription = this.categoryRestControllerService.getAllCategoriesOfUser(this.selectedUser.id!).subscribe({
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
      this.cardsSubscription = this.cardRestControllerService.getCardsByCategory(this.selectedCategory.id!).subscribe({
        next: (data) => this.cards = data,
        error:(err) =>  console.log(err)
      });
    }
  }

  onClickCard(card: CardDto){

  }

  onLoad() {
    let card1 : CardDto = {
      id: 1,
      question: "1+2",
      answer: "3",
      categoryId: this.selectedCategory.id
    };
    let card2 : CardDto = {
      id: 2,
      question: "frage",
      answer: "antwort",
      categoryId: this.selectedCategory.id
    };
    this.cards = [card1,card2];

  }
}
