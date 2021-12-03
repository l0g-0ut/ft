import { Component } from '@angular/core';
import {environment} from "../environments/environment";
import {faExclamationTriangle, faSyncAlt} from "@fortawesome/free-solid-svg-icons";
import {ApiData} from "./model/api-data";
import {SelectedLanguage} from "./model/selected-language";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  version = environment.version;

  isMenuCollapsed = true;

  faReload = faSyncAlt;
  faWarning = faExclamationTriangle;

  title = 'Think you\'re already frustrated? Wait for it...';

  apiData = new ApiData('', '');

  setup: SelectedLanguage | null = null

  public onConfirm(setup: SelectedLanguage) {
    if (!setup) {
      return;
    }
    this.title = 'Listen to me! I will repeat myself!';
    this.setup = setup;
  }


}
