import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title = 'app';
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

    console.log("Scroll Event", window.pageYOffset);
    console.log("Scroll Event", this.previousPageYOffset);

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

  constructor(private sanitization: DomSanitizer) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }
}
