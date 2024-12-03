import { Component, OnInit } from '@angular/core';

//declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
  
export class MapComponent implements OnInit {
  map!: google.maps.Map;
  searchBox!: google.maps.places.SearchBox;
  google: any;

  ngOnInit() {
    this.initMap();
  }

  initMap(): void {
    console.log('Initializing map...');
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 20.766960, lng: 86.152857 },
      zoom: 15,
    };

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
    console.log('Map initialized with center:', mapOptions.center);

    const input = document.getElementById('search-box') as HTMLInputElement;
    this.searchBox = new google.maps.places.SearchBox(input);
    console.log('SearchBox initialized.');

    this.map.addListener('bounds_changed', () => {
      console.log('Map bounds changed:', this.map.getBounds());
      this.searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });

    this.searchBox.addListener('places_changed', () => {
      const places = this.searchBox.getPlaces();
      console.log('Places changed event triggered.');

      if (!places || places.length === 0) {
        console.warn('No places found.');
        return;
      }
      console.log('Places found:', places);

      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.error('Returned place contains no geometry', place);
          return;
        }
        console.log('Adding marker for place:', place.name);


        new google.maps.Marker({
          map: this.map,
          position: place.geometry.location,
          title: place.name,
        });

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      console.log(' map bounds to selected places.');
      this.map.fitBounds(bounds);
    });
  }
}
