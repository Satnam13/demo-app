import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasicAppService } from 'src/app/services/basic-app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private basicAppServices: BasicAppService) { }
  subjectService
  ngOnInit() {
    this.route.fragment.subscribe({
      next: (value) => {
        if (value) {
          document.querySelector('#' + value).scrollIntoView();
        }
      }
    })
  }
  onNavLinkElement(event) {
    this.basicAppServices.getScrollService().next(event);

  }
  scrollToGettingStarted() {
    document.querySelector('#getting-started').scrollIntoView();
  }
  ngOnDestroy() {
    this.basicAppServices.getScrollService().complete();
  }



}
