import { createReducer, on } from '@ngrx/store';
import {
  filter,
  setChatListType,
  setCurrentConversation,
  setCurrentLaw,
  setLawList,
  setList,
} from './parliamentarians.actions';
import { ParliamentarianDataResponse } from '../../politicos/ParlamentarianResponseDtos';
import { ChatListType } from '../../constants/chat-list-type';

export interface parliamentariansReducerInterface {
  list: ParliamentarianDataResponse[];
  filteredList: ParliamentarianDataResponse[];
  currentConversation: ParliamentarianDataResponse;
  chatListType: ChatListType;
  currentLaw: any;
  lawList: any[];
}

export const initialState: parliamentariansReducerInterface = {
  list: [],
  filteredList: [],
  chatListType: ChatListType.VOTE,
  currentConversation: null,
  currentLaw: null,
  lawList: [],
};

export const parliamentariansReducer = createReducer(
  initialState,
  on(filter, (state, { filteredList }) => ({
    ...state,
    filteredList: filteredList,
  })),
  on(setList, (state, { list }) => ({ ...state, list: list })),
  on(setLawList, (state, { lawList }) => ({ ...state, lawList: lawList })),
  on(setChatListType, (state, { chatListType }) => ({
    ...state,
    chatListType: chatListType,
  })),
  on(setCurrentLaw, (state, { currentLaw }) => ({
    ...state,
    currentLaw: currentLaw,
    chatListType: ChatListType.LAW,
  })),
  on(setCurrentConversation, (state, { currentConversation }) => {
    const newList = [];
    state.list.map(conversation => {
      if (
        conversation &&
        conversation.parliamentarianId ===
          currentConversation.parliamentarianRanking.parliamentarianId
      ) {
        newList.push({
          ...conversation,
          parliamentarian: {
            ...conversation.parliamentarian,
            latestMessageRead: true,
          },
        });
      } else {
        newList.push(conversation);
      }
    });
    return {
      ...state,
      currentConversation: currentConversation,
      list: newList,
      chatListType: ChatListType.VOTE,
    };
  })
);
