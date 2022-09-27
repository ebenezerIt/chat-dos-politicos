import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {map, Observable, Subject} from 'rxjs';
import {
    Expenditure,
    Parliamentarian,
    ParliamentarianDataResponse,
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
                    this.localStorage.set('listParliamentarians', parliamentarians);
                    this.localStorage.setLastUpdate();
                    observableReturn.next(parliamentarians);
                });
        }
        return observableReturn.asObservable();
    }

    private requestListParliamentarians(): Observable<ParliamentarianListResponse> {
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
            this.shrinkParliamentarians(parliamentarian)));
    }

    private shrinkParliamentarians(parliamentarian: ParliamentarianListResponse): ParliamentarianListResponse {
        // TODO handle error parliamentarian.success = false;
        const shrink = new ParliamentarianListResponse();
        shrink.data = parliamentarian.data;
        shrink.request = new Date();
        shrink.data = parliamentarian.data.map(it => PoliticosRepository.shrinkParliamentariansData(it));
        return shrink;
    }

    private static shrinkParliamentariansData(parliamentarianData: ParliamentarianDataResponse): ParliamentarianDataResponse {
        const shrink = new ParliamentarianDataResponse();
        shrink.parliamentarianId = parliamentarianData.parliamentarianId;
        shrink.scoreRanking = parliamentarianData.scoreRanking;
        shrink.scoreTotal = parliamentarianData.scoreTotal;
        shrink.parliamentarian = PoliticosRepository.shrinkParliamentarian(parliamentarianData.parliamentarian);
        return shrink;
    }

    private static shrinkParliamentarian(parliamentarian: Parliamentarian): Parliamentarian {
        const shrink = new Parliamentarian();
        shrink.id = parliamentarian.id;
        shrink.photo = parliamentarian.photo;
        shrink.name = parliamentarian.name;
        shrink.nickname = parliamentarian.nickname;
        shrink.position = parliamentarian.position;
        shrink.latestMessage = parliamentarian.latestMessage;
        shrink.latestMessageRead = parliamentarian.latestMessageRead;
        shrink.party = parliamentarian.party;
        shrink.state = parliamentarian.state;
        shrink.isReelection = parliamentarian.isReelection;
        return shrink;
    }
}
