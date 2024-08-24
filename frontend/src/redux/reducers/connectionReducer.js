/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

export const getConnection = createAsyncThunk(
  "connection/getConnection",
  async ({ id }, { dispatch }) => {
    dispatch(clearErrors());
    const token = await localStorage.getItem("token");
    const authToken = `Bearer ${JSON.parse(token)}`;
    const response = await axios.get(`${BASE_URL}/api/v1/connection/${id}`, {
      headers: { Authorization: authToken },
    });

    return response?.data;
  }
);

export const updateConnection = createAsyncThunk(
  "connection/updateConnection",
  async ({ id, status }, { dispatch }) => {
    dispatch(clearErrors());
    const token = await localStorage.getItem("token");
    const authToken = `Bearer ${JSON.parse(token)}`;
    const response = await axios.put(
      `${BASE_URL}/api/v1/connection/${id}`,
      {
        status,
      },
      {
        headers: { Authorization: authToken },
      }
    );

    return response?.data;
  }
);

export const newConnection = createAsyncThunk(
  "connection/newConnection",
  async ({ senderId, receiverId }, { dispatch }) => {
    dispatch(clearErrors());
    const token = await localStorage.getItem("token");
    const authToken = `Bearer ${JSON.parse(token)}`;
    const response = await axios.post(
      `${BASE_URL}/api/v1/connection`,
      {
        senderId,
        receiverId,
      },
      {
        headers: { Authorization: authToken },
      }
    );

    return response?.data;
  }
);

export const connectionInitialState = {
  loading: null,
  connection: null,
  error: null,
};

const connectionSlice = createSlice({
  name: "connection",
  initialState: connectionInitialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearStatus: (state) => {
      state.loading = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConnection.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getConnection.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.connection;
    });
    builder.addCase(getConnection.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });

    builder.addCase(updateConnection.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateConnection.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.connection;
    });
    builder.addCase(updateConnection.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
    builder.addCase(newConnection.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(newConnection.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.connection;
    });
    builder.addCase(newConnection.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});

export const { clearErrors, clearStatus } = connectionSlice.actions;
export default connectionSlice.reducer;
