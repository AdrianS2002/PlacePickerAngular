import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal<boolean>(false);
  private htttpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  erorr = signal('');
  private placesService = inject(PlacesService);
  //constructor(private httpClient: HttpClient){}

  ngOnInit() {
    this.isFetching.set(true);
    const subscription =
      this.placesService.loadAvailablePlaces().subscribe({
        next: (resData) => {
          this.places.set(resData);
        },
        error: (error: Error) => {
          console.log(error);
          this.erorr.set(error.message);
        },
        complete: () => {
          this.isFetching.set(false);
        }
      });


    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  onSelectPlace(selectedPlace: Place) {
    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe({
      next: (resData) => console.log(resData),
    })
    this.destroyRef.onDestroy(() => {subscription.unsubscribe();});
  }
}


function catchErrpr(): import("rxjs").OperatorFunction<Place[], unknown> {
  throw new Error('Function not implemented.');
}

