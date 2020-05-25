import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) {
  }

  testAPI() {
    return this.httpClient.get('https://restcountries.eu/rest/v2/all');
  }

  /*****  RSS Feed  *****/
  
  getRssFeed() {
    return this.httpClient.get('https://rss2json.com/api.json?rss_url=http://thefullpint.libsyn.com/rss');
  }

  /*****  Open Brewery DB  *****/

  getBreweries() {
    return this.httpClient.get('https://api.openbrewerydb.org/breweries');
  }

  /*****  Brewery DB  *****/

  // getBeers() {
  //   return this.httpClient.get(`http://api.brewerydb.com/v2/beers/?key=${apiKey}`);
  // }

  /*****  Google Maps  *****/

}
