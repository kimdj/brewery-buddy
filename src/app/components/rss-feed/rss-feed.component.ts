import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { HttpService } from '@app/services/http.service';
import { HttpClient } from "@angular/common/http";
import { GeolocationService } from '@app/services/geoloction.service';

interface Beer {
  title:string;
  link:string;
  published:string;
}

@Component({
  selector: 'app-rss-feed',
  templateUrl: './rss-feed.component.html',
  styleUrls: ['./rss-feed.component.scss']
})
export class RssFeedComponent implements OnInit{
  beers: Array<Beer>;
  curCoords: any;

  constructor(private http: HttpService,
              private geolocation: GeolocationService) {
    this.beers = new Array();
  }
  ngOnInit(): void {
    console.log("OnInit called in rss-feed");
    
    this.http.getRssFeed().subscribe(res =>{
      for(var index in res["items"]){
        const episode = res["items"][index];
        const beer: Beer ={
          title: episode["title"],
          link: episode["link"],
          published: episode["{{beer.description}}"]
        };
        this.beers.push(beer);
      }
    })
    this.geolocation.getLocation().subscribe(res =>{
      console.log(res.coords);
      this.curCoords = res.coords;
    });
    this.http.getCloseBrewery().subscribe(res =>{
      console.log(res);
    });
  }

}
