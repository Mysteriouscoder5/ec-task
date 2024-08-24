/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { removeFromStorage } from "../../utils/helperFunctions";
import { BASE_URL } from "../../utils/constants";

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async ({ id }, { dispatch }) => {
    dispatch(clearErrors());
    const token = localStorage.getItem("token");
    const authToken = `Bearer ${JSON.parse(token)}`;
    const response = await axios.get(`${BASE_URL}/api/v1/user/details`, {
      headers: { Authorization: authToken },
    });

    localStorage.setItem("user", JSON.stringify(response?.data?.user));
    localStorage.setItem("token", JSON.stringify(response?.data?.token));
    return response?.data;
  }
);

export const logIn = createAsyncThunk(
  "user/logIn",
  async ({ email, password }, { dispatch }) => {
    dispatch(clearErrors());

    const response = await axios.get(
      `${BASE_URL}/api/v1/user/login`,
      {},
      {
        email,
        password,
      }
    );

    localStorage.setItem("user", JSON.stringify(response?.data?.user));
    localStorage.setItem("token", JSON.stringify(response?.data?.token));
    return response?.data;
  }
);

export const signIn = createAsyncThunk(
  "user/signIn",
  async ({ username, phone, email, password }, { dispatch }) => {
    dispatch(clearErrors());
    const config = { headers: { "Content-Type": "application/json" } };

    const response = await axios.post(
      `${BASE_URL}/api/v1/user/sign-in`,
      {
        username,
        phone,
        email,
        password,
      },
      config
    );

    localStorage.setItem("user", JSON.stringify(response?.data?.user));
    localStorage.setItem("token", JSON.stringify(response?.data?.token));
    return response?.data;
  }
);

export const userInitialState = {
  loading: null,
  user: null,
  token: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearStatus: (state) => {
      state.loading = null;
    },
    logOut: (state) => {
      removeFromStorage({ key: "user" });
      removeFromStorage({ key: "token" });
      state.user = null;
      state.token = null;
      state.loading = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(loadUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
      console.log(action.error);
    });
  },
});

export const { clearErrors, logOut, clearStatus } = userSlice.actions;
export default userSlice.reducer;
