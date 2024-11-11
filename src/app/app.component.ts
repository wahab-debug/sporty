import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'sporty';
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}
  ngOnInit() {
    // Log every navigation event
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart || event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        // Log the requested URL
        console.log('Navigation started to:', event.url);

        // Log the component that is being served for the route
        this.logActiveComponent();
      }

      if (event instanceof NavigationEnd) {
        // Log the successful navigation and the final URL
        console.log('Navigation ended at:', event.url);

        // Log the component that is being served for the route
        this.logActiveComponent();
      }

      if (event instanceof NavigationError) {
        // Log any errors that occur during navigation
        console.error('Navigation error:', event.error);
      }

      if (event instanceof NavigationCancel) {
        // Log if the navigation was cancelled
        console.log('Navigation cancelled');
      }
    });
  }

  private logActiveComponent() {
    // We need to check which component is currently activated.
    let route = this.activatedRoute.root; // Start from the root route

    while (route.firstChild) {
      route = route.firstChild;
    }

    // Log the path and the associated component
    if (route.component) {
      console.log('Component for current route:', route.component.name);
    }
  }
}
