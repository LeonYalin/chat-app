import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '@client/store';
import { UIState } from '@client/utils/enums';
import { deleteUserApi, signInApi, signUpApi } from './auth.api';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { User } from '@shared/models/user.model';

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
          dispatch(setUser({ user }));
          dispatch(setRememberMe({ rememberMe }));
          setError('');
          navigate('/');
        }
      })
      .catch(err => {
        setError(err.message);
      });
  };

export const signOutAsync =
  ({ navigate }: { navigate: ReturnType<typeof useNavigate> }): AppThunk =>
  (dispatch, getState) => {
    const user = getState().auth.user;
    console.log('signOutAsync', user);
    if (user) {
      dispatch(setUser({ user: null }));
      dispatch(setRememberMe({ rememberMe: false }));
      navigate('/');
    }
  };

export const deleteUserAsync =
  ({ userEmail, navigate }: { userEmail: string; navigate: ReturnType<typeof useNavigate> }): AppThunk =>
  (dispatch, getState) => {
    deleteUserApi({ userEmail })
      .then(res => {
        dispatch(signOutAsync({ navigate }));
      })
      .catch(err => {
        console.log(err);
      });
  };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User | null }>) => {
      state.user = action.payload.user;
    },
    setRememberMe: (state, action: PayloadAction<{ rememberMe: boolean }>) => {
      if (action.payload.rememberMe) {
        localStorage.setItem('user', JSON.stringify(state.user));
      } else {
        localStorage.removeItem('user');
      }
    },
  },
  extraReducers: builder => {
    builder
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

export const { setUser, setRememberMe } = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;

export default authSlice.reducer;
