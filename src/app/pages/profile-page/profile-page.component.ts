import { Component, OnInit, ViewChild, ViewContainerRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadRemoteComponent } from '../../utils/federation-utils';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  @ViewChild('districtContainer', { read: ViewContainerRef, static: true })
  districtContainer!: ViewContainerRef;

  isLoading = true;
  error = '';

  async ngOnInit() {
    try {
      // Load the ButtonComponent from remote
      const districtComponent = await loadRemoteComponent<any>(
        'ang-federation-remote',
        './Kecamatan'
      );
      console.log('districtComponent');
      console.log(districtComponent);

      // Create primary button instance
      const districtSelectorRef = this.districtContainer.createComponent(districtComponent);
      console.log('districtSelectorRef');
      console.log(districtSelectorRef);

      districtSelectorRef.instance.onClick.subscribe((event: Event) => {
        console.log('Primary button clicked', event);
      });

      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
      this.error = `Failed to load remote button: ${
        e instanceof Error ? e.message : String(e)
      }`;
      console.error('Error loading remote button:', e);
    }
  }
}
