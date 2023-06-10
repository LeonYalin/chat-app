import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@shared/models/chat.model';
import { AppThunk, RootState } from '@client/store';
import { UIState } from '@client/utils/enums';
import { signInApi, signUpApi } from './auth.api';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export interface AuthState {
  user: User | null;
  uiState: UIState;
}

const initialState: AuthState = {
  user: null,
  uiState: UIState.IDLE,
};

export const signUpAsync =
  ({
    name,
    email,
    password,
    navigate,
    setError,
  }: {
    name: string;
    email: string;
    password: string;
    navigate: ReturnType<typeof useNavigate>;
    setError: React.Dispatch<React.SetStateAction<string>>;
  }): AppThunk =>
  (dispatch, getState) => {
    signUpApi({ name, email, password })
      .then(res => {
        const user = res.data?.signUp;
        if (user) {
          setError('');
          navigate('/');
        }
      })
      .catch(err => {
        setError(err.message);
      });
  };

export const signInAsync =
  ({
    email,
    password,
    rememberMe,
    navigate,
    setError,
  }: {
    email: string;
    password: string;
    rememberMe: boolean;
    navigate: ReturnType<typeof useNavigate>;
    setError: React.Dispatch<React.SetStateAction<string>>;
  }): AppThunk =>
  (dispatch, getState) => {
    signInApi({ email, password })
      .then(res => {
        const user = res.data.signIn;
        if (user) {
          dispatch(setUser({ user, rememberMe }));
          setError('');
          navigate('/');
        }
      })
      .catch(err => {
        setError(err.message);
      });
  };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; rememberMe?: boolean }>) => {
      state.user = action.payload.user;
      if (action.payload.rememberMe) {
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
  },
  extraReducers: builder => {
    builder
      // .addCase(signInAsync.fulfilled, (state, action) => {
      //   const user = action.payload.data.signIn;
      //   if (user) {
      //     state.user = user;
      //   }
      // })
      .addMatcher(
        action => action.type.endsWith('/pending'),
        state => {
          state.uiState = UIState.LOADING;
        },
      )
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        state => {
          state.uiState = UIState.FAILED;
        },
      )
      .addMatcher(
        action => action.type.endsWith('/fulfilled'),
        state => {
          state.uiState = UIState.IDLE;
        },
      );
  },
});

export const { setUser } = authSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectAuthState = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;

export default authSlice.reducer;
