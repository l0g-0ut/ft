import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ApiData} from "../model/api-data";


export interface User {
  userid: string;
  username: string;
  language: string;
}


export interface ChastitySession {
  chastitiysessionid: string;
  creatorid: string;
  wearerid: string;
  holderid: string;
  startdate?: number;
  enddate?: number;
}


export interface SessionServiceResponse {
  user: User;
  chastitysession?: ChastitySession;
}


@Injectable({
  providedIn: 'root',
})
export class EmlalockSessionServiceService {

  public getSessionInformation(apiData: ApiData): Observable<SessionServiceResponse> {
    return this.http.get<SessionServiceResponse>('https://api.emlalock.com/info/', {
      headers: {
        'Accept': 'application/json',
      },
      params: {
        'userid': apiData.apiUser,
        'apikey': apiData.apiKey,
      }
    });
  }

  constructor(private http: HttpClient) {
  }

}
