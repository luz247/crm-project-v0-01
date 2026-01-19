import type { authState, authUser } from '@/interfaces/auth.interfaces';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
const initialState: authState = {
   user:[]
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
       
        onUser: ( state,  action: PayloadAction<authUser[]> ) => {
            state.user = action.payload
        }
    }
});


// Action creators are generated for each case reducer function
export const { onUser} = authSlice.actions;