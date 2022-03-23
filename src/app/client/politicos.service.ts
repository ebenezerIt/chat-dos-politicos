import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {ParliamentarianListResponse, ParliamentariaSingleResponse} from './ParlamentarianResponseDtos';

@Injectable({
  providedIn: 'root'
})
export class PoliticosService {

  baseUrl = 'https://apirest.politicos.org.br/api/';
  listParliamentariansUrl = this.baseUrl + 'parliamentarianranking?Year=0&Position=&Skip=0&Take=750&OrderBy=scoreRanking&Name=&StatusId=1';
  getParliamentarianUrl = this.baseUrl + 'parliamentarianranking/parliamentarian?Year=0&ParliamentarianId={id}&IsParliamentarianPage=true&Include=Parliamentarian.LawVotes.Law,Parliamentarian.LawVotes.LawStatus,Parliamentarian.Processes,Parliamentarian.Quotas,Parliamentarian.Staffs,Parliamentarian.Comments.Visitor,Parliamentarian.AssiduityCommissions,Parliamentarian.InternalScores,Parliamentarian.State,Parliamentarian.Party,Parliamentarian.BallinBallouts,Parliamentarian.Ratings,Parliamentarian.Page,Parliamentarian.LawVotes.Law.CounselorLawStatus';
  listParliamentarianVotesUrl = this.baseUrl + 'parliamentarianranking/parliamentarian?Year=0&ParliamentarianId={id}&IsParliamentarianPage=true&Include=Parliamentarian.LawVotes.Law&Include=Parliamentarian.LawVotes.LawStatus';

  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  listParliamentarians(): Observable<ParliamentarianListResponse> {
    return this.httpClient.get<ParliamentarianListResponse>(this.listParliamentariansUrl)
      .pipe(
        retry(2),
        catchError(this.handleError));
  }

  getParliamentarianById(id: number): Observable<ParliamentarianListResponse> {
    return this.httpClient.get<ParliamentarianListResponse>(this.getParliamentarianUrl.replace('{id}', id.toString()))
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getParliamentarianVotesById(id: number): Observable<ParliamentariaSingleResponse> {
    return this.httpClient.get<ParliamentariaSingleResponse>(this.listParliamentarianVotesUrl.replace('{id}', id.toString()))
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => errorMessage);
  }
}
