import { createSlice } from "@reduxjs/toolkit";

const initialSettingState: {
  gameModeIndex: number; // 0 is Human vs Human, 1 is AI (white) vs Human (black), 2 is Human (white) vs AI (black)
  reversed: boolean;
} = {
  gameModeIndex: 0,
  reversed: false,
};

const settingSlice = createSlice({
  name: "setting",
  initialState: initialSettingState,
  reducers: {
    changeGameMode(state, actions) {
      state.gameModeIndex = actions.payload;
    },
    reverseBoard(state) {
      state.reversed = !state.reversed;
    },
  },
});

export const settingActions = settingSlice.actions;

export default settingSlice.reducer;
