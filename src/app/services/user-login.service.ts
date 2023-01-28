import {Injectable, OnInit} from '@angular/core';
import {Configuration} from "../openapi-gen";
import jwt_decode from 'jwt-decode';
import {Subject} from 'rxjs';

const USER_KEY : string ="auth-user"

interface  Token {
  sub: string;
  iat: number;
  exp: number;
  ID: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserLoginService implements OnInit{

  public loggedUser$  = new Subject<string>();
  public loggedId$  = new Subject<boolean>();

  private tokenId : number | undefined
  private loggedIn   : boolean = false

  constructor(private apiConfiguration: Configuration) {}

  ngOnInit(): void {
   this.loggedUser$.next("NotLoggedIn")
  }

  getUserId(){
    return this.tokenId
  }

  setToken(token:string){
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, token);
    this.readToken()
  }

  getloggedIn(): any{
    return this.loggedIn;
  }

  private readToken(){
    let token = window.sessionStorage.getItem(USER_KEY);
    if(token && !(token=="")) {
      //this.apiConfiguration.accessToken = this.token;
      try {
        this.apiConfiguration.credentials = {"bearerAuth": token}
        let decoded: Token = jwt_decode(token);
        this.tokenId = +decoded.ID;
        this.loggedUser$.next(decoded.sub)
        //this.loggedUser = decoded.sub;
        this.loggedId$.next(true)
        this.loggedIn = true
      } catch (Error) {
        this.resetToken()
      }
    }else{
      this.resetToken()
    }
  }

  isTokenSet(){
    this.readToken()
    return this.loggedIn
  }

  resetToken(){
    window.sessionStorage.clear()
    this.loggedIn = false
    this.loggedId$.next(false)
    this.loggedUser$.next("NotLoggedIn")
    this.apiConfiguration.credentials = {"bearerAuth":  "1"}
  }
}
