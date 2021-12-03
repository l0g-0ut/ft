import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


export interface LanguageSetup {
  _: string;
  hello: string;
  test: string;
  peep: string;
  sorry: string;
  error: string;
  noSession: string;
  week: string;
  weeks: string;
  day: string;
  days: string;
  hour: string;
  hours: string;
  minute: string;
  minutes: string;
  greeting: string;
  time: string;
}

export interface LanguageData {
  [language: string]: LanguageSetup;
}

export interface LanguageResponse {
  defaultLanguage: string;
  languages: LanguageData;
}


@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  public getLanguageData(): Observable<LanguageResponse> {
    return this.http.get<LanguageResponse>('assets/languages.json');
  }

  constructor(private http: HttpClient) {
  }

}
