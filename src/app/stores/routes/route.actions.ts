import { createAction, props } from '@ngrx/store';
import { RouteEnum } from '../../enums/route-enum';

export const setSelectedRoute = createAction('[Chat Component] SetSelectRoute ', props<{ route: RouteEnum }>());
