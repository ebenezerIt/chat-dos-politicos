import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import {
  Expenditure,
  ParliamentarianListResponse,
} from './ParlamentarianResponseDtos';
import { PoliticosRepository } from './politicos.repository';
import { CamaraDespesasClient, CamaraDespesasResponse } from './camara-despesas.client';
import { PARLIAMENTARIAN_TO_CAMARA_ID_MAP } from './parlamentares-map';

@Injectable({
  providedIn: 'root',
})
export class PoliticosService {
  constructor(
    private politicosRepository: PoliticosRepository,
    private camaraDespesasClient: CamaraDespesasClient
  ) {}

  listParliamentarians(): Observable<ParliamentarianListResponse> {
    return this.politicosRepository.listParliamentarians();
  }

  getLawList(): Observable<any> {
    return this.politicosRepository.getLawList();
  }

  getLawVotesById(lawId: number): Observable<any> {
    return this.politicosRepository.getLawVotesById(lawId);
  }
  getLawById(lawId: number): Observable<any> {
    return this.politicosRepository.getLawById(lawId);
  }

  getParliamentarianVotesById(id: number): Observable<any> {
    const subject = new Subject<any>();

    this.politicosRepository
      .getParliamentarianVotesById(id)
      .subscribe(response => {
        const parliamentarianRanking = response.data.parliamentarianRanking;
        if (parliamentarianRanking) {
          const lawVotes = parliamentarianRanking.parliamentarian.lawVotes;
          const latestLawVote = lawVotes[0];
          response.data.parliamentarianRanking.parliamentarian.latestMessageRead = true;
          response.data.parliamentarianRanking.parliamentarian.latestMessage =
            latestLawVote?.law?.number;
          response.data.parliamentarianRanking.parliamentarian.latestMessageTime =
            latestLawVote?.law?.dateVoting;
          
          // Get the correct ranking from local storage (same as sidebar uses)
          this.getCorrectRankingFromLocalStorage(id).then(correctRanking => {
            if (correctRanking !== null) {
              response.data.scoreRankingByPosition = correctRanking;
            }
            subject.next(response.data);
          });
        }
      });
    return subject.asObservable();
  }

  private async getCorrectRankingFromLocalStorage(parliamentarianId: number): Promise<number | null> {
    return new Promise((resolve) => {
      this.listParliamentarians().subscribe(listResponse => {
        const parliamentarian = listResponse.data.find(p => p.parliamentarianId === parliamentarianId);
        resolve(parliamentarian ? parliamentarian.scoreRankingByPosition : null);
      });
    });
  }

  getExpenditureById(id: number): Observable<Expenditure> {
    return this.politicosRepository.getExpenditureById(id);
  }

  /**
   * Converts internal parliamentarian ID to Câmara API ID
   */
  private getCamaraId(parliamentarianId: number): number | null {
    const camaraId = PARLIAMENTARIAN_TO_CAMARA_ID_MAP[parliamentarianId] || null;
    if (!camaraId) {
      console.warn(`No Câmara ID mapping found for parliamentarian ID: ${parliamentarianId}`);
    } else {
      console.log(`Mapped parliamentarian ID ${parliamentarianId} to Câmara ID ${camaraId}`);
    }
    return camaraId;
  }

  /**
   * Gets expenses from Câmara API using internal parliamentarian ID
   */
  getCamaraDespesasByParliamentarianId(
    parliamentarianId: number,
    ano?: number,
    mes?: number,
    pagina?: number,
    itens?: number
  ): Observable<CamaraDespesasResponse> {
    const camaraId = this.getCamaraId(parliamentarianId);
    if (!camaraId) {
      return throwError(() => new Error(`No Câmara ID mapping found for parliamentarian ID: ${parliamentarianId}`));
    }
    return this.camaraDespesasClient.getDespesasByDeputadoId(camaraId, ano, mes, pagina, itens);
  }

  /**
   * Gets expenses from Câmara API by year using internal parliamentarian ID
   */
  getCamaraDespesasByParliamentarianIdAndAno(
    parliamentarianId: number,
    ano: number
  ): Observable<CamaraDespesasResponse> {
    const camaraId = this.getCamaraId(parliamentarianId);
    if (!camaraId) {
      return throwError(() => new Error(`No Câmara ID mapping found for parliamentarian ID: ${parliamentarianId}`));
    }
    return this.camaraDespesasClient.getDespesasByDeputadoIdAndAno(camaraId, ano);
  }

  /**
   * Gets expenses from Câmara API by year and month using internal parliamentarian ID
   */
  getCamaraDespesasByParliamentarianIdAndAnoMes(
    parliamentarianId: number,
    ano: number,
    mes: number
  ): Observable<CamaraDespesasResponse> {
    const camaraId = this.getCamaraId(parliamentarianId);
    if (!camaraId) {
      return throwError(() => new Error(`No Câmara ID mapping found for parliamentarian ID: ${parliamentarianId}`));
    }
    return this.camaraDespesasClient.getDespesasByDeputadoIdAndAnoMes(camaraId, ano, mes);
  }

  // Legacy methods - kept for backward compatibility
  getCamaraDespesasByDeputadoId(
    deputadoId: number,
    ano?: number,
    mes?: number
  ): Observable<CamaraDespesasResponse> {
    return this.camaraDespesasClient.getDespesasByDeputadoId(deputadoId, ano, mes);
  }

  getCamaraDespesasByDeputadoIdAndAno(
    deputadoId: number,
    ano: number
  ): Observable<CamaraDespesasResponse> {
    return this.camaraDespesasClient.getDespesasByDeputadoIdAndAno(deputadoId, ano);
  }

  getCamaraDespesasByDeputadoIdAndAnoMes(
    deputadoId: number,
    ano: number,
    mes: number
  ): Observable<CamaraDespesasResponse> {
    return this.camaraDespesasClient.getDespesasByDeputadoIdAndAnoMes(deputadoId, ano, mes);
  }
}
