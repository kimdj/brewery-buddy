import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { HttpService } from '@app/services/http.service';
import { GeolocationService } from '@app/services/geoloction.service';

interface Brewery {
  name:string;
  website:string;
}

@Component({
  selector: 'app-rss-feed',
  templateUrl: './rss-feed.component.html',
  styleUrls: ['./rss-feed.component.scss']
})
export class RssFeedComponent implements OnInit{
  breweries: Array<Brewery>;

  constructor(private http: HttpService,
              private geolocation: GeolocationService) {
    this.breweries = new Array();
  }
  ngOnInit(): void {

    this.http.getCloseBreweries("abc", "123").subscribe(res =>{
      console.log(res);
      for(var index in res["data"]){
        const curRow = res["data"][index];
        const brewery: Brewery ={
          name: curRow["brewery"]["name"],
          website: curRow["website"]
        };
        this.breweries.push(brewery);
      }
    });
    
  }
}
