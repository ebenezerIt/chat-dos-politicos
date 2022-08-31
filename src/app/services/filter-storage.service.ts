import { Injectable } from '@angular/core';
import { StorageEnum } from '../enums/storage-enum';



export interface Filter {
    fromBestToWorse: boolean,
    chamber: boolean,
    senate: boolean,
    state: string,
    searchText: string
}

@Injectable({
  providedIn: 'root'
})

export class FilterStorageService {

  public static INITIAL_STORAGE: Filter = {
      fromBestToWorse: true,
      chamber:  true,
      senate: true,
      state: '',
      searchText: ''
  }

  get userFilters(): Filter  {
    let filter =  JSON.parse(localStorage.getItem(StorageEnum.FILTER));

    if (!filter) {
      localStorage.setItem(StorageEnum.FILTER, JSON.stringify(FilterStorageService.INITIAL_STORAGE));
      filter = FilterStorageService.INITIAL_STORAGE;
    }

    return filter;
  }


  setUserFilters(filter: Filter): void {
    localStorage.setItem(StorageEnum.FILTER, JSON.stringify(filter));
  }

}
