import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasicAppService {

  constructor() { }
  private scrollValue: Subject<string> = new Subject<string>();
  getScrollService() {
    return this.scrollValue;
  }
}
