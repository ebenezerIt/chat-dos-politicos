import {Injectable} from '@angular/core';
import {map, Observable, Subject} from 'rxjs';
import {
  Parliamentarian,
  ParliamentarianDataResponse,
  ParliamentarianListResponse,
  ParliamentarianSingleResponse
} from './ParlamentarianResponseDtos';
import {PoliticosRepository} from './politicos.repository';
import {LocalStorageRepository} from '../local/local-storage.repository';

@Injectable({
  providedIn: 'root'
})
export class PoliticosService {

  constructor(private politicosRepository: PoliticosRepository, private localStorageRepository: LocalStorageRepository) {
  }

  isLocalStorageExpired(): boolean {
    const storedDateText: string | null =  this.localStorageRepository.get('lastUpdate');
    if (!storedDateText) {
      return true;
    }
    const lastUpdate = JSON.parse(storedDateText);
    return new Date(lastUpdate.toDateString()) < new Date(new Date().toDateString());
  }

  listParliamentarians(): Observable<ParliamentarianListResponse> {
    const localParliamentariansResponse: ParliamentarianListResponse = this.localStorageRepository.get('listParliamentarians');
    const observableReturn = new Subject<ParliamentarianListResponse>();

    if (localParliamentariansResponse && !this.isLocalStorageExpired()) {
      setTimeout(() => observableReturn.next(localParliamentariansResponse), 0);
    } else {
      const listResponseObservable = this.politicosRepository.listParliamentarians();
      this.shrinkParliamentariansList(listResponseObservable)
        .subscribe(parliamentarians => {
          this.localStorageRepository.set('listParliamentarians', parliamentarians);
          this.localStorageRepository.set('lastUpdate', new Date());
          observableReturn.next(parliamentarians);
        });
    }
    return observableReturn.asObservable();
  }

  shrinkParliamentariansList(listResponseObservable: Observable<ParliamentarianListResponse>): Observable<ParliamentarianListResponse> {
    return listResponseObservable.pipe(map((parliamentarian: ParliamentarianListResponse) => this.shrinkParliamentarians(parliamentarian)));
  }

  getParliamentarianVotesById(id: number): Observable<ParliamentarianSingleResponse> {
    return this.politicosRepository.getParliamentarianVotesById(id);
  }

  private shrinkParliamentarians(parliamentarian: ParliamentarianListResponse): ParliamentarianListResponse {
    // TODO handle error parliamentarian.success = false;
    const shrink = new ParliamentarianListResponse();
    shrink.data = parliamentarian.data;
    shrink.request = new Date();
    shrink.data = parliamentarian.data.map(it => this.shrinkParliamentariansData(it));
    return shrink;
  }

  private shrinkParliamentariansData(parliamentarianData: ParliamentarianDataResponse): ParliamentarianDataResponse {
    const shrink = new ParliamentarianDataResponse();
    shrink.parliamentarianId = parliamentarianData.parliamentarianId;
    shrink.scoreRanking = parliamentarianData.scoreRanking;
    shrink.scoreTotal = parliamentarianData.scoreTotal;
    shrink.parliamentarian = this.shrinkParliamentarian(parliamentarianData.parliamentarian);
    return shrink;
  }

  private shrinkParliamentarian(parliamentarian: Parliamentarian): Parliamentarian {
    const shrink = new Parliamentarian();
    shrink.id = parliamentarian.id;
    shrink.photo = parliamentarian.photo;
    shrink.name = parliamentarian.name;
    shrink.nickname = parliamentarian.nickname;
    shrink.latestMessage = parliamentarian.latestMessage;
    shrink.latestMessageRead = parliamentarian.latestMessageRead;
    return shrink;
  }
}
