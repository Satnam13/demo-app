import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatInitService {

  constructor(private http: HttpClient, private userService: UserService) { }
  baseUrl = 'http://localhost:5000';
  initializeChats(user, friend, size): Observable<any> {
    console.log(size);

    let param = new HttpParams().set('page', size);
    return this.http.get(`${this.baseUrl}/userchats/${user}/${friend}`, {
      headers: new HttpHeaders({
        'x-auth-token': this.userService.token
      }),
      params: param
    });
  }
}
