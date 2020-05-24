import { Component, OnInit } from '@angular/core';
import * as Parser from "rss-parser";

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.scss']
})
export class RssComponent implements OnInit{
  cards =  [
    { title: 'Card 1'},
    { title: 'Card 2'},
    { title: 'Card 3'},
    { title: 'Card 4'}
  ];

  constructor() {
  }
  ngOnInit(): void {
    console.log("here");
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
    let parser = new Parser();
    parser.parseURL(CORS_PROXY + 'https://www.reddit.com/.rss', function(err, feed) {
    if (err) throw err;
      console.log(feed.title);
      feed.items.forEach(function(entry) {
        console.log(entry.title + ':' + entry.link);
      })
    })
  }
}
