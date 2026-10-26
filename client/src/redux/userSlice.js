import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    skills: [],
    projects: [],
    education: [],
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      // console.log(state.userData);
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSkills: (state, action) => {
      state.skills = action.payload;
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setEducation: (state, action) => {
      state.education = action.payload;
    },
  },
});

export default userSlice.reducer;
export const {
  setUserData,
  setToken,
  setLoading,
  setSkills,
  setProjects,
  setEducation,
} = userSlice.actions;
