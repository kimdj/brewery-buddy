import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { HttpService } from '@app/services/http.service';
import { GeolocationService } from '@app/services/geoloction.service';
import {Breweries, BeersWithBreweries, Event} from '@app/models/brewTypes';
@Component({
  selector: 'app-rss-feed',
  templateUrl: './rss-feed.component.html',
  styleUrls: ['./rss-feed.component.scss']
})
export class RssFeedComponent implements OnInit{
  breweries: Breweries;
  beers: BeersWithBreweries;
  event: Event;

  constructor(private http: HttpService,
              private geolocation: GeolocationService) {
    this.breweries = new Breweries();
    this.beers = new BeersWithBreweries();
  }
  ngOnInit(): void {
    // Default to denver, because I know it will work:)
    var lat = "39.7236683";
    var long = "-105.0006015";

    // Find closest brewery
    this.geolocation.getLocation().subscribe(res =>{
      var curCoords = res.coords;
      this.http.getCloseBreweries(curCoords.latitude, curCoords.longitude).subscribe(res =>{
        console.log(res);
        if(res["data"] === undefined){
          this.http.getCloseBreweries(lat, long).subscribe(res =>{
            console.log("closest raw data")
            this.breweries.process(res["data"]);
          });
        }else{
          console.log("closest raw data")
          this.breweries.process(res["data"]);
        }     
      });
    });

    // Get random beer of the day
    this.http.getRandomBeer().subscribe(res =>{
        console.log("Random beer raw data")
        this.beers.process([res["data"]]);
    });

    // Get most recent event
    this.http.getUpcomingEvents().subscribe(res =>{
      console.log("Event raw data")
      console.log(res)
      var row = res["data"][0];
      var event : Event={
        name: row.name,
        website: row.website
      };
      this.event = event;
    });
  }
}
