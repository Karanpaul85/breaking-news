import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createCookie } from "../../utils/common";
import axios from "axios";

const initialState = {
  email: null,
  email_verified: false,
  name: null,
  picture: null,
  openDrawer: false,
};

const oneTapLogin = createSlice({
  name: "onetapLoginSlice",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      const { email, email_verified, name, picture, isAdmin } = action.payload;
      if (email_verified) {
        state.email = email;
        state.email_verified = email_verified;
        state.name = name;
        state.picture = picture;
        state.isAdmin = isAdmin;
        createCookie("auth", JSON.stringify(state), 2);
      }
    },
    userLogout: (state) => initialState,
    setOpenDrawer: (state, action) => {
      state.openDrawer = action.payload;
    },
  },
});

export const { setUserDetails, setOpenDrawer, userLogout } =
  oneTapLogin.actions;
export default oneTapLogin.reducer;
