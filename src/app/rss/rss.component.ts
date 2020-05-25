import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { HttpClient } from "@angular/common/http";

interface Beer {
  title:string;
  link:string;
  published:string;
}

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.scss']
})
export class RssComponent implements OnInit{
  beers: Array<Beer>
  

  constructor(private http:HttpClient) {
    this.beers = new Array();
  }
  ngOnInit(): void {
    console.log("here");
    //
    this.http.get<any>('https://rss2json.com/api.json?rss_url=http://thefullpint.libsyn.com/rss').subscribe(res =>{
      for(var index in res["items"]){
        const episode = res["items"][index];
        console.log(episode);
        const beer: Beer ={
          title: episode["title"],
          link: episode["link"],
          published: episode["{{beer.description}}"]
        };
        this.beers.push(beer);
      }
    })
  }
}
