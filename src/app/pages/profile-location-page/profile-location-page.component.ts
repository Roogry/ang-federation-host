import { Component, signal, computed, WritableSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RemoteComponentDirective } from '../../shared/directive/remote-component.directive';

type SelectorItem = {
  id: string;
  name: string;
};

@Component({
  selector: 'app-profile-location-page',
  templateUrl: './profile-location-page.component.html',
  styleUrl: './profile-location-page.component.scss',
  imports: [
    CommonModule,
    RemoteComponentDirective,
    TitleCasePipe,
    MatCardModule,
    MatIconModule,
  ],
})
export class ProfileLocationPageComponent {
  private componentInstances = signal<Record<string, any>>({});

  loadingStatus = signal({
    province: true,
    regency: true,
    district: true,
  });

  resetCounter: WritableSignal<any> = signal({
    province: 0,
    regency: 0,
    district: 0,
  });

  selectedProvince = signal<SelectorItem | null>(null);
  selectedRegency = signal<SelectorItem | null>(null);
  selectedDistrict = signal<SelectorItem | null>(null);

  provinceComponentInputs = computed(() => ({
    resetTrigger: this.resetCounter().province,
  }));

  regencyComponentInputs = computed(() => ({
    provinceId: this.selectedProvince()?.id ?? '52',
    resetTrigger: this.resetCounter().regency,
  }));

  districtComponentInputs = computed(() => ({
    regencyId: this.selectedRegency()?.id ?? '1101',
    resetTrigger: this.resetCounter().district,
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

  clearSelector(widgetName: string): void {
    if (widgetName === 'province') {
      this.selectedProvince.set(null);
      this.selectedRegency.set(null);
      this.selectedDistrict.set(null);
      this.resetCounter.update((counter) => ({
        ...counter,
        province: counter.province + 1,
        regency: counter.regency + 1,
        district: counter.district + 1,
      }));
    } else if (widgetName === 'regency') {
      this.selectedRegency.set(null);
      this.selectedDistrict.set(null);
      this.resetCounter.update((counter) => ({
        ...counter,
        regency: counter.regency + 1,
        district: counter.district + 1,
      }));
    } else if (widgetName === 'district') {
      this.selectedDistrict.set(null);
      this.resetCounter.update((counter) => ({
        ...counter,
        district: counter.district + 1,
      }));
    }
  }
}
