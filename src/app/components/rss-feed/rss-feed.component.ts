import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { HttpService } from '@app/services/http.service';
import { GeolocationService } from '@app/services/geoloction.service';
import {BreweryLocations, BeersWithBreweries, Event} from '@app/models/brewTypes';
@Component({
  selector: 'app-rss-feed',
  templateUrl: './rss-feed.component.html',
  styleUrls: ['./rss-feed.component.scss']
})
export class RssFeedComponent implements OnInit{
  breweryLocations: BreweryLocations;
  beers: BeersWithBreweries;
  event: Event;

  constructor(private http: HttpService,
              private geolocation: GeolocationService) {
    this.breweryLocations = new BreweryLocations();
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
        if(res["data"] === undefined){
          this.http.getCloseBreweries(lat, long).subscribe(res =>{
            this.breweryLocations.process(res["data"]);
          });
        }else{
          this.breweryLocations.process(res["data"]);
        }     
      });
    });

    // Get random beer of the day
    this.http.getRandomBeer().subscribe(res =>{
        this.beers.process([res["data"]]);
    });

    // Get most recent event
    this.http.getUpcomingEvents().subscribe(res =>{
      var row = res["data"][res["data"].length - 1];
      var event : Event={
        name: row.name,
        website: row.website,
        description: row.description
      };
      this.event = event;
    });
  }
}
