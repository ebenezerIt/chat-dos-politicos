import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {
  private readonly storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  set(key: string, value: any): boolean {
    if (this.storage) {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  }

  get(key: string): any {
    if (this.storage) {
      return JSON.parse(this.storage.getItem(key));
    }
    return null;
  }

  remove(key: string): boolean {
    if (this.storage) {
      this.storage.removeItem(key);
      return true;
    }
    return false;
  }

  clear(): boolean {
    if (this.storage) {
      this.storage.clear();
      return true;
    }
    return false;
  }

  isLocalStorageExpired(): boolean {
    const storedDateText: string | null = this.get('lastUpdate');
    if (!storedDateText) {
      return true;
    }
    const lastUpdate = new Date(storedDateText);
    return (
      new Date(lastUpdate.toDateString()) < new Date(new Date().toDateString())
    );
  }

  setLastUpdate(): void {
    this.set('lastUpdate', new Date());
  }
}
