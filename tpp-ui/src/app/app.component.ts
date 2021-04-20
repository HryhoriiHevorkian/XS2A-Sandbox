import { Component, OnInit } from '@angular/core';

import {
  CustomizeService,
  Theme,
  GlobalSettings,
} from './services/customize.service';
import { Title } from '@angular/platform-browser';
import { CountryService } from './services/country.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'app';
  globalSettings: GlobalSettings;

  constructor(
    private customizeService: CustomizeService,
    private countryService: CountryService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.countryService.loadCountries();
    let theme: Theme;
    this.customizeService.getJSON().subscribe((data) => {
      theme = data;
      this.globalSettings = theme.globalSettings;
      if (theme.globalSettings.logo.indexOf('/') === -1) {
        theme.globalSettings.logo =
          '../assets/UI' +
          (this.customizeService.isCustom() ? '/custom/' : '/') +
          theme.globalSettings.logo;
      }
      if (
        theme.globalSettings.favicon &&
        theme.globalSettings.favicon.href.indexOf('/') === -1
      ) {
        theme.globalSettings.favicon.href =
          '../assets/UI' +
          (this.customizeService.isCustom() ? '/custom/' : '/') +
          theme.globalSettings.favicon.href;
      }

      const title = theme.globalSettings.title;
      if (title) {
        this.titleService.setTitle(title);
      }
      this.customizeService.setUserTheme(theme);
    });
  }
}
