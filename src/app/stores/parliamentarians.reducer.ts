import { createReducer, on } from '@ngrx/store';
import { filter, setCurrentConversation, setList } from './parliamentarians.actions';
import { ParliamentarianDataResponse } from '../politicos/ParlamentarianResponseDtos';


export interface parliamentariansReducerInterface {
    list:  ParliamentarianDataResponse[],
    filteredList:  ParliamentarianDataResponse[]
    currentConversation:  ParliamentarianDataResponse
}

export const initialState: parliamentariansReducerInterface = {
    list: [],
    filteredList: [],
    currentConversation: null
};

export const parliamentariansReducer = createReducer(
    initialState,
    on(filter, (state, { filteredList }) => ({...state, filteredList: filteredList})),
    on(setList, (state, { list }) => ({...state, list: list})),
    on(setCurrentConversation, (state, { currentConversation }) => {
        console.log("STATELIST", state.list)
        const newList = []
        state.list.map(conversation => {
            if (conversation && conversation.parliamentarianId === currentConversation.parliamentarianRanking.parliamentarianId) {
                newList.push({...conversation, parliamentarian: {...conversation.parliamentarian, latestMessageRead: true}})
            } else {
                newList.push(conversation)
            }
        })
        return ({...state, currentConversation: currentConversation, list: newList}) }),
)
