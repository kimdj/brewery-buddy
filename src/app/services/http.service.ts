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
  constructor(private http: HttpClient) {
  }

  testAPI() {
    return this.http.get('https://restcountries.eu/rest/v2/all');
  }

  /*****  RSS Feed  *****/
  
  getRssFeed() {
    return this.http.get('https://rss2json.com/api.json?rss_url=http://thefullpint.libsyn.com/rss');
  }

  /*****  Open Brewery DB  *****/

  getBreweries() {
    return this.http.get('https://api.openbrewerydb.org/breweries');
  }

  /*****  Brewery DB  *****/

  getBeers() {
    return this.http.get('/get-beers');
  }

  getCloseBreweries(){
    return this.http.get('/get-breweries');
  }
  /*****  Google Maps  *****/

}
