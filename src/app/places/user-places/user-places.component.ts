import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal<boolean>(false);
  private htttpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService);
  erorr = signal('');
  places = this.placesService.loadedUserPlaces;
  //constructor(private httpClient: HttpClient){}

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesService.loadUserPlaces().subscribe({
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
  onRemovePlace(place: Place) {
    const subscription = this.placesService.removeUserPlace(place).subscribe({
      next: (resData) => console.log(resData),
    })
    this.destroyRef.onDestroy(() => { subscription.unsubscribe(); });
  }
}
