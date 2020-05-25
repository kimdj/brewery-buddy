import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { HttpClient } from "@angular/common/http";
import { GeolocationService } from '../geoloction.service';

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
  beers: Array<Beer>;
  curCoords: any;

  constructor(private http:HttpClient, private geolocation: GeolocationService) {
    this.beers = new Array();
  }
  ngOnInit(): void {
    this.http.get<any>('https://rss2json.com/api.json?rss_url=http://thefullpint.libsyn.com/rss').subscribe(res =>{
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
  }

}
