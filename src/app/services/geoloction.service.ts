import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';

/* Largely taken from https://gist.github.com/sasha7/0c32f3686eb49d44ccc8 */
const GEOLOCATION_ERRORS = {
	'errors.location.unsupportedBrowser': 'Browser does not support location services',
	'errors.location.permissionDenied': 'You have rejected access to your location',
	'errors.location.positionUnavailable': 'Unable to determine your location',
	'errors.location.timeout': 'Service timeout has been reached'
};
@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(){}
  getLocation(): Observable<any> {
      return Observable.create(observer => {
  
        if (navigator && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              observer.next(position);
              observer.complete();
            },
            (error) => {
              switch (error.code) {
                case 1:
                  observer.error(GEOLOCATION_ERRORS['errors.location.permissionDenied']);
                  break;
                case 2:
                  observer.error(GEOLOCATION_ERRORS['errors.location.positionUnavailable']);
                  break;
                case 3:
                  observer.error(GEOLOCATION_ERRORS['errors.location.timeout']);
                  break;
              }
            });
        }
        else {
          observer.error(GEOLOCATION_ERRORS['errors.location.unsupportedBrowser']);
        }
    });
  }
}