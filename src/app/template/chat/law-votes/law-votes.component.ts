import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { parliamentariansReducerInterface } from '../../../stores/parliamentarians/parliamentarians.reducer';
import { LawVoteType } from '../../../constants/law-vote-type';
import { RouteEnum } from '../../../constants/route-enum';
import { setCurrentConversation } from '../../../stores/parliamentarians/parliamentarians.actions';
import { ParliamentarianDataResponse } from '../../../politicos/ParlamentarianResponseDtos';
import { PoliticosService } from '../../../politicos/politicos.service';
import {
  Filter,
  FilterStorageService,
} from '../../../services/filter-storage.service';
import { ConfigEnum } from '../../../constants/config-enum';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-law-votes',
  templateUrl: './law-votes.component.html',
  styleUrls: ['./law-votes.component.scss'],
})
export class LawVotesComponent implements OnInit, OnDestroy {
  currentLaw;
  vt;
  filter: Filter;
  configEnum = ConfigEnum;
  filteredLawVotes: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private store: Store<{
      parliamentarians: parliamentariansReducerInterface;
    }>,
    private router: Router,
    private politicosService: PoliticosService,
    private filterStorageService: FilterStorageService
  ) {
    this.filter = this.filterStorageService.userFilters;

    this.store
      .select('parliamentarians')
      .pipe(takeUntil(this.destroy$))
      .subscribe(parliamentarians => {
        this.currentLaw = parliamentarians.currentLaw;
        this.updateFilteredLawVotes();
      });

    this.filter = this.filterStorageService.userFilters;
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.vt = params.vt ? parseInt(params.vt, 10) : null;

      const savedFilters = this.filterStorageService.userFilters;
      const stateFromParams =
        typeof params.s === 'string' ? params.s : savedFilters.state;

      this.filter = {
        ...savedFilters,
        state: stateFromParams,
      };

      this.updateFilteredLawVotes();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByLawVote(_index: number, lawVote: any): number | string {
    return lawVote?.parliamentarianId ?? lawVote?.parliamentarian?.id ?? _index;
  }

  handleParliamentarianClicked(parliamentarian): void {
    this.politicosService
      .getParliamentarianVotesById(parliamentarian.id)
      .subscribe((conversationResponse: ParliamentarianDataResponse) => {
        this.store.dispatch(
          setCurrentConversation({ currentConversation: conversationResponse })
        );
        this.router.navigate([`/${RouteEnum.VOTES}`], {
          queryParams: { id: parliamentarian.id },
        });
      });
  }

  getThumbnail(parliamentarianId: number): string {
    return this.configEnum?.CHAT_API_THUMBNAIL + parliamentarianId + '.jpg';
  }

  handleImageError(event: any, fallbackPhotoUrl?: string, parliamentarianId?: number): void {
    const img = event.target as HTMLImageElement;
    
    // If we already tried the fallback or image is already noPic, use default image
    if (img.src === fallbackPhotoUrl || img.src.includes('noPic.svg')) {
      img.src = 'assets/images/noPic.svg';
      img.onerror = null; // Prevent infinite loop
      return;
    }
    
    console.log(`Parliamentarian ${parliamentarianId || 'unknown'} does not have thumbnail at ${img.src}`);
    
    // If fallback photo URL is available, use it
    if (fallbackPhotoUrl) {
      img.src = fallbackPhotoUrl;
      return;
    }
    
    // If no fallback URL but we have parliamentarianId, fetch from API
    if (parliamentarianId) {
      this.politicosService
        .getParliamentarianVotesById(parliamentarianId)
        .subscribe({
          next: (response: ParliamentarianDataResponse) => {
            const photoUrl = response?.parliamentarianRanking?.parliamentarian?.photo;
            if (photoUrl) {
              img.src = photoUrl;
            } else {
              console.log(`Parliamentarian ${parliamentarianId} does not have photo in API response`);
              img.src = 'assets/images/noPic.svg';
              img.onerror = null;
            }
          },
          error: () => {
            console.log(`Failed to fetch photo for parliamentarian ${parliamentarianId} from API`);
            img.src = 'assets/images/noPic.svg';
            img.onerror = null;
          }
        });
      return;
    }
    
    // Final fallback
    console.log(`No fallback available for parliamentarian ${parliamentarianId || 'unknown'}`);
    img.src = 'assets/images/noPic.svg';
    img.onerror = null;
  }

  private updateFilteredLawVotes(): void {
    if (!this.currentLaw?.lawVoteList) {
      this.filteredLawVotes = [];
      return;
    }

    let list = [...this.currentLaw.lawVoteList];
    list = this.applyStateFilter(list);
    list = this.applyVoteFilter(list);

    this.filteredLawVotes = list;
  }

  private applyStateFilter(list: any[]): any[] {
    if (!this.filter?.state) {
      return list;
    }

    return list.filter(data => {
      return data.parliamentarian.state.prefix === this.filter.state;
    });
  }

  private applyVoteFilter(list: any[]): any[] {
    if (!this.vt) {
      return [
        ...list.filter(law => law.lawStatus.id === LawVoteType.SIM),
        ...list.filter(law => {
          return (
            law.lawStatus.id !== LawVoteType.NAO &&
            law.lawStatus.id !== LawVoteType.SIM
          );
        }),
        ...list.filter(law => law.lawStatus.id === LawVoteType.NAO),
      ];
    }

    if (this.vt === LawVoteType.SIM) {
      return list.filter(law => law.lawStatus.id === LawVoteType.SIM);
    }

    if (this.vt === LawVoteType.NAO) {
      return list.filter(law => law.lawStatus.id === LawVoteType.NAO);
    }

    return list.filter(law => {
      return (
        law.lawStatus.id !== LawVoteType.NAO &&
        law.lawStatus.id !== LawVoteType.SIM
      );
    });
  }
}
