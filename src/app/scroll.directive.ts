import { Directive, Output, HostListener, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appScroll]'
})
export class ScrollDirective {
  @Output('navLinkElement')
  emitNavLinkActiveElement: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }
  @HostListener('window:scroll', ['$event']) onScroll(event) {


    const windowHeight = window.innerHeight - 50;
    const targetScroll = event.target.scrollingElement.scrollTop;

    const homeHeight = windowHeight;
    const gettingStartedHeight = windowHeight * 2;
    if (targetScroll > gettingStartedHeight) {
      this.emitEvent('about');
    }
    else if (targetScroll > homeHeight) {
      this.emitEvent('getting-started');
    }
    else if (targetScroll < windowHeight) {
      this.emitEvent('home');
    }
  }
  intialized: string;
  emitEvent(value: string) {
    if (this.intialized !== value) {

      this.intialized = value;
      this.emitNavLinkActiveElement.emit(value);
    }
  }

}
