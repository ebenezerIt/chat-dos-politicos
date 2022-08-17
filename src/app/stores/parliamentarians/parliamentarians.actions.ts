import { createAction, props } from '@ngrx/store';
import { ParliamentarianDataResponse } from '../../politicos/ParlamentarianResponseDtos';

export const filter = createAction('[Sidebar Component] Filter', props<{ filteredList: ParliamentarianDataResponse[] }>());
export const setList = createAction('[Sidebar Component] SetList', props<{ list: ParliamentarianDataResponse[] }>());
export const setCurrentConversation = createAction('[Sidebar Component] SetCurrentConversation', props<{ currentConversation: ParliamentarianDataResponse }>());
