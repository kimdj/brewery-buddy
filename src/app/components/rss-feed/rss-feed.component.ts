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
    // Default to denver, because I know it will work:)
    var lat = "39.7236683";
    var long = "-105.0006015";

    this.geolocation.getLocation().subscribe(res =>{
      var curCoords = res.coords;
      this.http.getCloseBreweries(curCoords.latitude, curCoords.longitude).subscribe(res =>{
        console.log(res);
        if(res["data"] === undefined){
          this.http.getCloseBreweries(lat, long).subscribe(res =>{
            this.populateCloseBreweries(res["data"]);
          });
        }else{
          this.populateCloseBreweries(res["data"]);
        }
        
      });
    });
  }

  populateCloseBreweries(data): void{
    for(var index in data.slice(0, 5)){
      const curRow = data[index];
      const brewery: Brewery ={
        name: curRow["brewery"]["name"],
        website: curRow["website"]
      };
      this.breweries.push(brewery);
    }
  }
}
