import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Expenditure, ParliamentarianListResponse} from './ParlamentarianResponseDtos';

@Injectable({
  providedIn: 'root'
})
export class ChatDosPoliticosClient {

  constructor(private httpClient: HttpClient) { }

  listParliamentarians(): Observable<ParliamentarianListResponse> {
    return this.httpClient.get<ParliamentarianListResponse>('/static/parliamentarians-sidebar.json')
      .pipe(catchError(this.handleError));
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

  getExpenditureByParliamentarianIdId(parliamentarianId: number): Observable<Expenditure> {
    return this.httpClient.get<Expenditure>(`/static/parliamentarians/expenditure/${parliamentarianId}`)
        .pipe(catchError(this.handleError));
  }
}
