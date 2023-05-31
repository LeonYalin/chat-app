import { configureStore, ThunkAction, Action, PreloadedState, combineReducers } from '@reduxjs/toolkit';

import chatReducer from './features/chat/chat.slice';

const rootReducer = combineReducers({
  chat: chatReducer,
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export default store;
