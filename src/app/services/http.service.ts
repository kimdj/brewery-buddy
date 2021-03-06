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
  constructor(private http: HttpClient) {}

  /*****  RSS Feed  *****/

  getRssFeed() {
    return this.http.get(
      'https://rss2json.com/api.json?rss_url=http://thefullpint.libsyn.com/rss'
    );
  }
  /*****  Brewery DB  *****/

  getRandomBeer() {
    return this.http.get('/get-random-beer');
  }

  getBeers() {
    return this.http.get('/get-beers');
  }

  getBreweries() {
    return this.http.get('/get-breweries');
  }

  getUpcomingEvents() {
    return this.http.get('/get-upcoming-events');
  }
  getCloseBreweries(lat, long) {
    return this.http.get(
      `/get-breweriesClose?Latitude=${lat}&Longitude=${long}`
    );
  }

  getBreweriesKeyword(searchCriteria) {
    return this.http.get(`/get-breweriesKeyword?query=${searchCriteria}`);
  }

  getBreweryLocation(id) {
    return this.http.get(`/get-breweryLocation?query=${id}`);
  }

  getBeersKeyword(searchCriteria) {
    return this.http.get(`/get-beersKeyword?query=${searchCriteria}`);
  }
}
