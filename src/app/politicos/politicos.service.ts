import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Expenditure, ParliamentarianListResponse} from './ParlamentarianResponseDtos';
import {PoliticosRepository} from './politicos.repository';

@Injectable({
  providedIn: 'root'
})
export class PoliticosService {

  constructor(private politicosRepository: PoliticosRepository) {
  }

  listParliamentarians(): Observable<ParliamentarianListResponse> {
    return this.politicosRepository.listParliamentarians();
  }

  getParliamentarianVotesById(id: number): Observable<any> {
    const subject = new Subject<any>();

    this.politicosRepository.getParliamentarianVotesById(id)
        .subscribe(response => {
          const parliamentarianRanking = response.data.parliamentarianRanking;
          if (parliamentarianRanking) {
            const lawVotes = parliamentarianRanking.parliamentarian.lawVotes;
            const latestLawVote = lawVotes[0];
            response.data.parliamentarianRanking.parliamentarian.latestMessageRead = true;
            response.data.parliamentarianRanking.parliamentarian.latestMessage = latestLawVote.law.number;
            response.data.parliamentarianRanking.parliamentarian.latestMessageTime = latestLawVote.law.dateVoting;
            subject.next(response.data);
          }});
    return subject.asObservable();
  }

  getExpenditureById(id: number): Observable<Expenditure> {
    return this.politicosRepository.getExpenditureById(id);
  }
}
