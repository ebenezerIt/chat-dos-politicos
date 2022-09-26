import { createAction, props } from '@ngrx/store';
import { ParliamentarianDataResponse } from '../../politicos/ParlamentarianResponseDtos';
import { ChatListType } from '../../constants/chat-list-type';

export const filter = createAction('[Sidebar Component] Filter', props<{ filteredList: ParliamentarianDataResponse[] }>());
export const setList = createAction('[Sidebar Component] SetList', props<{ list: ParliamentarianDataResponse[] }>());
export const setLawList = createAction('[Sidebar Component] SetLawList', props<{ lawList: any[] }>());
export const setCurrentConversation = createAction('[Sidebar Component] SetCurrentConversation', props<{ currentConversation: ParliamentarianDataResponse }>());
export const setCurrentLaw = createAction('[Sidebar Component] SetCurrentLaw', props<{ currentLaw: any }>());
export const setChatListType = createAction('[Template Component] setChatType', props<{ chatListType: ChatListType }>());
