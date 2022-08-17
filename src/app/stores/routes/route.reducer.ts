import { createReducer, on } from '@ngrx/store';
import { setSelectedRoute } from './route.actions';
import { RouteEnum } from '../../enums/route-enum';


export interface routesReducerInterface {
    selectedRoute: RouteEnum
}

export const initialState: routesReducerInterface = {
    selectedRoute: RouteEnum.Votes,
};

export const routeReducer = createReducer(
    initialState,
    on(setSelectedRoute, (state, {route}) => ({...state, selectedRoute: route})),

)
