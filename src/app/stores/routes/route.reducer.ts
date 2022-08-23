import { createReducer, on } from '@ngrx/store';
import { setSelectedRoute } from './route.actions';
import { RouteEnum } from '../../constants/route-enum';


export interface RoutesReducerInterface {
    selectedRoute: RouteEnum;
}

export const initialState: RoutesReducerInterface = {
    selectedRoute: RouteEnum.VOTES,
};

export const routeReducer = createReducer(
    initialState,
    on(setSelectedRoute, (state, {route}) => ({...state, selectedRoute: route})),
);
