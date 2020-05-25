import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'brewery-buddy';

  constructor(private spinner: SpinnerService) {

  }

  ngOnInit() {
    this.spinner.on();
  }
}
