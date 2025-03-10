//this slice is requested to the goClimate API

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFootPrint = createAsyncThunk(
  "footPrint/fetchFootPrint",
  async ({ origin, destination, cabinClass }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://api.goclimate.com/v1/flight_footprint",
        {
          headers: {
            Authorization: `Basic ${btoa(import.meta.env.VITE_API_KEY + ":")}`,
          },
          params: {
            "segments[0][origin]": origin,
            "segments[0][destination]": destination,
            cabin_class: cabinClass,
            "currencies[]": ["EUR"],
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Errore nella richiesta");
    }
  }
);

const footPrintSlice = createSlice({
  name: "footprint",
  initialState: {
    footprint: null,
    offset_prices: [],
    details_url: "",
    statusFootPrint: "idle",
    errorFootPrint: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFootPrint.pending, (state) => {
        state.statusFootPrint = "loading";
      })
      .addCase(fetchFootPrint.fulfilled, (state, action) => {
        state.statusFootPrint = "succeeded";
        state.footprint = action.payload.footprint;
        state.offset_prices = action.payload.offset_prices[0].amount;
        state.details_url = action.payload.details_url;
      })
      .addCase(fetchFootPrint.rejected, (state, action) => {
        state.statusFootPrint = "failed";
        state.errorFootPrint = action.payload;
      });
  },
});

export const footPrintReducer = footPrintSlice.reducer;
