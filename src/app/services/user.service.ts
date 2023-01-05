import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {UsersDto} from "../openapi-gen";
import {UserDto} from "../openapi-gen";
import {HttpClient} from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.API_BASE_PATH;
  }
/*
  getUsers(): String[]{
    return this.users;
  }
  getObservableUsers():Observable<string[]>{
    return of(this.users);
  } */
  getListIDs():Observable<UsersDto> {
    return this.http.get(this.baseUrl + "/api/users");
  }



}

