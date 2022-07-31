import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Desperdicio, Gasto, ParliamentarianListResponse, ParliamentarianSingleResponse} from './ParlamentarianResponseDtos';
import {PoliticosClient} from './politicos.client';
import {PoliticosMapper} from './politicos.mapper';

@Injectable({
    providedIn: 'root'
})
export class PoliticosRepository {

    constructor(private politicosClient: PoliticosClient, private mapper: PoliticosMapper) {
    }

    listParliamentarians(): Observable<ParliamentarianListResponse> {
        const searchParams = new HttpParams()
            .append('Year', 0)
            .append('Take', 1000)
            .append('Skip', 0)
            .append('OrderBy', 'scoreRanking')
            .append('Name', '')
            .append('StatusId', 1);
        return this.politicosClient.listParliamentarians(searchParams);
    }

    getParliamentarianVotesById(id: number): Observable<ParliamentarianSingleResponse> {
        return this.politicosClient.getParliamentarianVotesById(id);
    }

    getDesperdicioById(id: number): Observable<Desperdicio> {
        const observableReturn = new Subject<Desperdicio>();
        this.politicosClient.getParliamentarianQuotasById(id)
        .subscribe(parliamentarianSingleResponse => {
            const desperdicio = this.mapper.toDesperdicio(parliamentarianSingleResponse);
            observableReturn.next(desperdicio);
        });

        return observableReturn.asObservable();
    }
}
