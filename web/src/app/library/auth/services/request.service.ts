import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';

import { StorageService } from './storage.service';

@Injectable()
export class RequestService {

  constructor( private _storage: StorageService) { }

  getAuthOptions(includeToken: boolean) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (includeToken) {
      const authToken = this._storage.getAuthToken();
      headers.append('Authorization', 'Bearer ' + authToken);
    }

    const options = new RequestOptions({headers: headers});
    return options;
  }

}

