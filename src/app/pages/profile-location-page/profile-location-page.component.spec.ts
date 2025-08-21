import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLocationPageComponent } from './profile-location-page.component';

describe('ProfileLocationPageComponent', () => {
  let component: ProfileLocationPageComponent;
  let fixture: ComponentFixture<ProfileLocationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileLocationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileLocationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
