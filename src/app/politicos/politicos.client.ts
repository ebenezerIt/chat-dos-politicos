import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {map, Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {ParliamentarianListResponse, ParliamentarianSingleResponse} from './ParlamentarianResponseDtos';

@Injectable({
  providedIn: 'root'
})
export class PoliticosClient {

  baseUrl = 'https://apirest.politicos.org.br/api/';
  listParliamentariansUrl = `${this.baseUrl}parliamentarianranking`;
  listParliamentarianVotesUrl = `${this.listParliamentariansUrl}/parliamentarian`;

  constructor(private httpClient: HttpClient) { }

  listParliamentarians(searchParams: HttpParams): Observable<ParliamentarianListResponse> {
    const httpOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
      params: searchParams
    };

    return this.httpClient.get<ParliamentarianListResponse>(this.listParliamentariansUrl, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getParliamentarianVotesById(id: number): Observable<ParliamentarianSingleResponse> {
    const searchParams = new HttpParams()
      .append('ParliamentarianId',  id)
      .append('Year',  0)
      .append('IsParliamentarianPage',  true)
      .append('Include',  'Parliamentarian.LawVotes.Law')
      .append('Include',  'Parliamentarian.LawVotes.LawStatus');

    const httpOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
      params: searchParams
    };

    return this.httpClient.get<ParliamentarianSingleResponse>(this.listParliamentarianVotesUrl, httpOptions)
        .pipe(
            map(list => list),
            retry(2),
            catchError(this.handleError)
        );
  }

  getParliamentarianQuotasById(id: number): Observable<ParliamentarianSingleResponse> {
    const searchParams = new HttpParams()
        .append('ParliamentarianId',  id)
        .append('Year',  0)
        .append('Include',  'Parliamentarian.Quotas,Parliamentarian.Staffs')
    const httpOptions = {
      headers: new HttpHeaders({ Accept: 'application/json' }),
      params: searchParams
    };

    return this.httpClient.get<ParliamentarianSingleResponse>(this.listParliamentarianVotesUrl, httpOptions)
        .pipe(
            retry(2),
            catchError(this.handleError)
        );
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do politicos
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, menssagem: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
