import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { BasicAppService } from 'src/app/services/basic-app.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  @ViewChild('intro', {static: true}) intro: ElementRef;
  @ViewChild('getStarted', {static: true}) getStarted: ElementRef;
  @ViewChild('about', {static: true}) about: ElementRef;

  constructor(
    private renderer: Renderer2, private scrollService: BasicAppService, private router: Router, private userService: UserService ) { }
  loggedInCurrently = false;

  ngOnInit() {
    this.userService.loggSuccess.subscribe({
      next: value => this.loggedInCurrently = value
    });
    if (window.location.pathname.indexOf('/home') !== -1) {
      this.onScrollchange('home');
  }
    this.scrollService.getScrollService().subscribe({
      next: (value) => {this.onScrollchange(value)
        console.log(value);

      },
      complete: () => this.removeClasses()
    });

  }
  removeClasses() {
    this.renderer.removeClass(this.intro.nativeElement, 'active');
    this.renderer.removeClass(this.about.nativeElement, 'active');
    this.renderer.removeClass(this.getStarted.nativeElement, 'active');

  }
  onScrollchange(value: string) {
    this.removeClasses();
    switch (value) {
      case 'home': {
        this.renderer.addClass(this.intro.nativeElement, 'active');
        break;
      }
      case 'about': {
        this.renderer.addClass(this.about.nativeElement, 'active');
        break;
      }
      case 'getting-started': {
        this.renderer.addClass(this.getStarted.nativeElement, 'active');
        break;
      }
    }
  }
  scrollToView(value) {
    this.router.navigate(['/home'], {fragment: value})
      .then((val) => console.log(val))
      .catch((e) => console.log(e));
  }
  logout() {
    this.userService.clearUser();
    this.router.navigate(['/home'], {fragment: 'intro'});
  }

}
