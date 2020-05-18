import { Component } from '@angular/core';
import { RSSApiService } from './rssapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'brewery-buddy';

  mArticles:Array<any>;
  mSources:Array<any>;

  constructor(private rssapi:RSSApiService){
    console.log('app component constructor called');         
  }

  ngOnInit() {
        //load articles
      this.rssapi.initArticles().subscribe(data => this.mArticles = data['articles']);
    //load news sources
    this.rssapi.initSources().subscribe(data=> this.mSources = data['sources']);  
    }

  searchArticles(source){
    console.log("selected source is: "+source);
    this.rssapi.getArticlesByID(source).subscribe(data => this.mArticles = data['articles']);
  }
}
