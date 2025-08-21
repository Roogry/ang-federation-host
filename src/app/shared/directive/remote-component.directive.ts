import { 
  Directive, 
  ViewContainerRef, 
  Input,
  Output,
  EventEmitter,
  inject, 
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { loadRemoteComponent } from '../../utils/federation-utils'

/**
 * A directive for loading remote components and providing access to the component instance.
 * 
 * Usage:
 * <ng-container 
 *   remoteComponent="ang-federation-remote" 
 *   remoteModule="./Provinsi"
 *   [inputs]="{initialValue: 1}"
 *   (componentLoaded)="onComponentLoaded($event)"
 * ></ng-container>
 */
@Directive({
  selector: '[remoteComponent]',
  standalone: true,
})
export class RemoteComponentDirective implements OnInit, OnChanges, OnDestroy {
  private viewContainer = inject(ViewContainerRef);
  private platformId = inject(PLATFORM_ID);

  // Configuration inputs
  @Input() remoteComponent!: string;
  @Input() remoteModule!: string;
  @Input() inputs: Record<string, any> = {};

  // Emits the component instance when loaded
  @Output() componentLoaded = new EventEmitter<any>();

  // State
  isLoading = true;
  error = '';
  componentRef: any = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip on server side
    }

    this.loadComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputs'] && !changes['inputs'].firstChange && this.componentRef) {
      this.updateComponentInputs();
    }
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  private async loadComponent(): Promise<void> {
    if (!this.remoteComponent || !this.remoteModule) {
      this.error = 'Remote component or module path not specified';
      this.isLoading = false;
      return;
    }

    try {
      const component = await loadRemoteComponent(this.remoteComponent, this.remoteModule);

      // Create the component
      this.componentRef = this.viewContainer.createComponent(component);

      // Set inputs
      this.updateComponentInputs();

      // Trigger change detection
      this.componentRef.changeDetectorRef.detectChanges();

      // Emit the component instance
      this.componentLoaded.emit(this.componentRef.instance);

      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.error = error instanceof Error ? error.message : String(error);
      console.error('Error loading remote component:', error);
    }
  }

  private updateComponentInputs(): void {
    if (!this.componentRef || !this.inputs) return;

    Object.entries(this.inputs).forEach(([key, value]) => {
      if (this.componentRef.instance[key] !== undefined) {
        this.componentRef.setInput(key, value);
      }
    });

    // Trigger change detection
    this.componentRef.changeDetectorRef.detectChanges();
  }
}