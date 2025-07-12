import { createAction, props } from '@ngrx/store';
import { RouteEnum } from '../../constants/route-enum';

export const setSelectedRoute = createAction(
  '[Chat Component] SetSelectRoute ',
  props<{ route: RouteEnum }>()
);
