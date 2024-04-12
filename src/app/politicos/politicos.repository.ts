import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {map, Observable, Subject} from 'rxjs';
import {
    Expenditure,
    ParliamentarianListResponse,
    ParliamentarianSingleResponse
} from './ParlamentarianResponseDtos';
import {PoliticosClient} from './politicos.client';
import {PoliticosMapper} from './politicos.mapper';
import {LocalStorage} from '../local/local-storage';

@Injectable({
    providedIn: 'root'
})
export class PoliticosRepository {

    constructor(private politicosClient: PoliticosClient, private mapper: PoliticosMapper, private localStorage: LocalStorage) {
    }

    listParliamentarians(): Observable<ParliamentarianListResponse> {
        const localParliamentariansResponse: ParliamentarianListResponse = this.localStorage.get('listParliamentarians');
        const observableReturn = new Subject<ParliamentarianListResponse>();

        if (localParliamentariansResponse && !this.localStorage.isLocalStorageExpired()) {
            setTimeout(() => observableReturn.next(localParliamentariansResponse), 0);
        } else {
            const listResponseObservable = this.requestListParliamentarians();
            this.shrinkParliamentariansList(listResponseObservable)
                .subscribe(parliamentarians => {
                    this.fixParliamentariansPosition(parliamentarians);
                    this.localStorage.set('listParliamentarians', parliamentarians);
                    this.localStorage.setLastUpdate();
                    observableReturn.next(parliamentarians);
                });
        }
        return observableReturn.asObservable();
    }

    private requestListParliamentarians(): Observable<ParliamentarianListResponse> {
        const searchParams = new HttpParams()
            .append('Take', 700)
            .append('Skip', 0)
            .append('Year', 56)
            .append('Legislature', 56)
            .append('OrderBy', 'scoreRanking');
        return this.politicosClient.listParliamentarians(searchParams);
    }

    getParliamentarianVotesById(id: number): Observable<ParliamentarianSingleResponse> {
        return this.politicosClient.getParliamentarianVotesById(id);
    }

    getLawList(): Observable<any> {
        return this.politicosClient.getLawList();
    }

    getLawVotesById(lawId: number): Observable<any> {
        return this.politicosClient.getLawVotesById(lawId);
    }

    getLawById(lawId: number): Observable<any> {
        return this.politicosClient.getLawById(lawId);
    }

    getExpenditureById(id: number): Observable<Expenditure> {
        const observableReturn = new Subject<Expenditure>();
        this.politicosClient.getParliamentarianQuotasById(id)
        .subscribe(parliamentarianSingleResponse => {
            const expense = this.mapper.toExpenditure(parliamentarianSingleResponse);
            observableReturn.next(expense);
        });

        return observableReturn.asObservable();
    }

    shrinkParliamentariansList(listResponseObservable: Observable<ParliamentarianListResponse>): Observable<ParliamentarianListResponse> {
        return listResponseObservable.pipe(map((parliamentarian: ParliamentarianListResponse) =>
            this.mapper.shrinkParliamentarians(parliamentarian)));
    }

    private fixParliamentariansPosition(parliamentarians: ParliamentarianListResponse): void {
        let position = 1;
        parliamentarians.data.forEach(parliamentarianData => {
            parliamentarianData.scoreRankingByPosition = position++;
        });
    }
}
