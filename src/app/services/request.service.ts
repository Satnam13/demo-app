import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {



  constructor(private http: HttpClient, private userService: UserService) { }
  baseUrl = 'http://localhost:5000';
  searchPeople(query): Observable<any> {
    if (query.length > 1 && this.userService.token) {
      return this.http.get(`${this.baseUrl}/usersearch/${query}`, {
        headers: new HttpHeaders({
          'x-auth-token': this.userService.token
        })
      });
    }
    return throwError(false);
  }
  sendRequest(receiver) {
    if (this.userService.token && this.userService.userState.username) {
    return this.http.post(`${this.baseUrl}/user/sendfriendreq`, {requester: this.userService.userState.username, receiver: receiver}, {
      headers: new HttpHeaders({
        'x-auth-token': this.userService.token
      })
    });
  }
  else {
    return throwError(false);
  }
  }
  acceptRequest(requester) {
    if (this.userService.token && this.userService.userState.username) {
      return this.http.post(`${this.baseUrl}/user/acceptfriendreq`, {receiver: this.userService.userState.username, requester: requester}, {
        headers: new HttpHeaders({
          'x-auth-token': this.userService.token
        })
      });
    }
    else {
      return throwError(false);
    }
  }
}
