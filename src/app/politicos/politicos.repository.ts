import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ParliamentarianListResponse, ParliamentarianSingleResponse} from './ParlamentarianResponseDtos';
import {PoliticosClient} from './politicos.client';

@Injectable({
  providedIn: 'root'
})
export class PoliticosRepository {

  constructor(private politicosClient: PoliticosClient) { }

  listParliamentarians(): Observable<ParliamentarianListResponse> {
    const searchParams = new HttpParams()
      .append('Year',  0)
      .append('Take',  1000)
      .append('Skip',  0)
      .append('OrderBy',  'scoreRanking')
      .append('Name',  '')
      .append('StatusId',  1);
    return this.politicosClient.listParliamentarians(searchParams);
  }

  getParliamentarianVotesById(id: number): Observable<ParliamentarianSingleResponse> {
    return this.politicosClient.getParliamentarianVotesById(id);
  }
}
