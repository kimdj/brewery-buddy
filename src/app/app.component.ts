import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from './services/spinner.service';
import { NotificationService } from './services/notification.service';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Brewery Buddy';
  innerWidth = 0;
  isMobileHeaderHidden = '0';
  previousPageYOffset = 0;
  currentPageYOffset = window.pageYOffset;
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
  }

  @HostListener('window:scroll', ['$event']) 
  doSomething(event) {
    this.currentPageYOffset = window.pageYOffset;

    // console.log("Scroll Event", window.pageYOffset);
    // console.log("Scroll Event", this.previousPageYOffset);

    // If scrolling up or at the top, reveal the navbar.  Otherwise, hide it.
    if ((this.previousPageYOffset > window.pageYOffset) || (window.pageYOffset <= 0)) {
      this.isMobileHeaderHidden = '0';
      // console.log('SCROLLING UP');
    } else {
      this.isMobileHeaderHidden = '-500px';
      // console.log('SCROLLING DOWN');
    }

    this.previousPageYOffset = window.pageYOffset;
  }

  constructor(private spinner: SpinnerService,
              private sanitizer: DomSanitizer,
              private notifier: NotificationService,
              private http: HttpService) {}

  ngOnInit() {
    let foo = this.http.getBreweries().subscribe((data) => {
      this.notifier.showInfo('foo', 'bar');
      console.log('getBreweries() data:');
      console.log(data);
    });

    let beers = this.http.getBeers().subscribe((data) => {
      console.log('getBeers() data:');
      console.log(data);
    });

    this.innerWidth = window.innerWidth;
    // this.spinner.on();
    // setTimeout(() => {
    //   this.notifier.showSuccess('foo', 'bar');
    // }, 0);
    // setTimeout(() => {
    //   this.notifier.showError('foo', 'bar');
    // }, 2000);
    // setTimeout(() => {
    //   this.notifier.showWarning('foo', 'bar');
    // }, 4000);
  }
}
