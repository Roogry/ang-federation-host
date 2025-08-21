import { Component, signal, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RemoteComponentDirective } from '../../shared/directive/remote-component.directive';

type SelectorItem = {
  id: string;
  name: string;
};

@Component({
  selector: 'app-profile-location-page',
  imports: [CommonModule, RemoteComponentDirective, TitleCasePipe],
  templateUrl: './profile-location-page.component.html',
  styleUrl: './profile-location-page.component.scss',
})
export class ProfileLocationPageComponent {
  private componentInstances = signal<Record<string, any>>({});

  loadingStatus = signal({
    province: true,
    regency: true,
    district: true,
  });

  selectedProvince = signal<SelectorItem | null>(null);
  selectedRegency = signal<SelectorItem | null>(null);
  selectedDistrict = signal<SelectorItem | null>(null);

  regencyComponentInputs = computed(() => ({
    provinceId: this.selectedProvince()?.id ?? '52',
  }));

  districtComponentInputs = computed(() => ({
    regencyId: this.selectedRegency()?.id ?? '1101',
  }));

  onComponentLoaded(widgetName: string, instance: any): void {
    // Update loading status
    this.loadingStatus.update((status) => ({
      ...status,
      [widgetName]: false,
    }));

    // Store component instance
    this.componentInstances.update((instances) => ({
      ...instances,
      [widgetName]: instance,
    }));

    // Subscribe to component events if needed
    if (widgetName === 'province' && instance.selected) {
      instance.selected.subscribe((province: SelectorItem) => {
        console.log(province);
        this.selectedProvince.set(province);
      });
    } else if (widgetName === 'regency' && instance.selected) {
      instance.selected.subscribe((regency: SelectorItem) => {
        console.log(regency);
        this.selectedRegency.set(regency);
      });
    } else if (widgetName === 'district' && instance.selected) {
      instance.selected.subscribe((district: SelectorItem) => {
        console.log(district);
        this.selectedDistrict.set(district);
      });
    }
  }
}
