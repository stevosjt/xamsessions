import { Injectable } from '@angular/core';

const STORAGE_KEY = 'access_token';
const STORAGE_EXPIRE = 'token_expire';

@Injectable()
export class StorageService {

  constructor() { }

  getAuthToken() {
    return localStorage.getItem(STORAGE_KEY);
  }

  setAuthToken(token_info) {
    const tokenjson = token_info.json();
    localStorage.setItem(STORAGE_KEY, tokenjson.token);
  }

  removeAuthToken() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_EXPIRE);
  }

}

