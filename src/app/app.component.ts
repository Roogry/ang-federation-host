import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { loadRemoteComponent } from './utils/federation-utils';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild('buttonContainer', { read: ViewContainerRef, static: true }) 
  buttonContainer!: ViewContainerRef;

  title = 'ang-federation-host';

  isLoading = true;
  error = '';

  async ngOnInit() {
    try {
      // Load the ButtonComponent from remote
      const ButtonComponent = await loadRemoteComponent<any>('ang-federation-remote', './Button');
      console.log('ButtonComponent');
      console.log(ButtonComponent);

      // Create primary button instance
      const primaryButtonRef = this.buttonContainer.createComponent(ButtonComponent);
      console.log('primaryButtonRef');
      console.log(primaryButtonRef);

      primaryButtonRef.instance.variant = 'primary';
      primaryButtonRef.instance.onClick.subscribe((event: Event) => {
        console.log('Primary button clicked', event);
      });
      const buttonElement = primaryButtonRef.location.nativeElement.querySelector('button');
      if (buttonElement) {
        buttonElement.textContent = `Remote Button`;
      }

      this.isLoading = false;
    } catch (e) {
      this.isLoading = false;
      this.error = `Failed to load remote button: ${e instanceof Error ? e.message : String(e)}`;
      console.error('Error loading remote button:', e);
    }
  }

}
