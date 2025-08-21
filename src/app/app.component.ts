import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  currentUrl = signal('');

  protected readonly listNav = [
    { title: 'Profile', href: '/profile' },
    { title: 'Edit Location', href: '/edit-location' },
    { title: 'Setting', href: '/' },
  ];

  ngOnInit() {
    const user = {
      name: 'Sanchia Jodie',
      email: 'sanchiajodie@bca.co.id',
      provinceName: 'Jakarta',
      regencyName: 'Jakarta Utara',
      districtName: 'Pluit',
    };

    localStorage.setItem('user', JSON.stringify(user));

    // Track current URL for active link detection
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl.set(event.urlAfterRedirects);
        }
      });
  }

  isParentActive(path: string): boolean {
    return path !== '/' && this.currentUrl().startsWith(path);
  }
}
