import { Injectable, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Place } from './place.model';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);
  private errorService = inject(ErrorService);  
  loadedUserPlaces = this.userPlaces.asReadonly();


  loadAvailablePlaces() {
    return this.fetchPlaces(
      'https://place-picker-angular.vercel.app/places',
      'something went wrong the available places'
    );
  }

  loadUserPlaces() {
    return this.fetchPlaces(
      'https://place-picker-angular.vercel.app/user-places',
      'something went wrong the favourite places'
    ).pipe(tap({
      next: (userPlaces) => {
        this.userPlaces.set(userPlaces);
      }
    }));
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();

    if (!prevPlaces.some((p) => p.id === place.id)) {
      this.userPlaces.set([...prevPlaces, place]);
    }

    return this.httpClient.put('https://place-picker-angular.vercel.app/user-places', { placeId: place.id }).pipe(
      catchError((error) => {
        this.userPlaces.set(prevPlaces);
        this.errorService.showError('Failed to add place to user places');
        return throwError(() => new Error('Failed to add place to user places'));
      })
    );
  }

  removeUserPlace(place: Place) {
    const prevPlaces = this.userPlaces();
    if (prevPlaces.some((p) => p.id === place.id)) {
      this.userPlaces.set(prevPlaces.filter(p => p.id !== place.id));
    }
    return this.httpClient.delete('https://place-picker-angular.vercel.app/user-places/'+place.id).pipe(
      catchError((error) => {
        this.userPlaces.set(prevPlaces);
        this.errorService.showError('Failed to remove place from user places');
        return throwError(() => new Error('Failed to remove place from user places'));
      })
    );
   }

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url).
      pipe(
        map((resData) => resData.places), catchError((error) => {
          console.log(error);
          return throwError(() => new Error(errorMessage));
        })
      )
  }
}
