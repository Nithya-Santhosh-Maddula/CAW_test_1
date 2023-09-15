import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {UserType} from "../App.types";
export interface stateType{
    users:UserType[]|[]
}
const initialState:stateType ={
    users:[]
}
const userSlice=createSlice({
    name:"users",
    initialState,
    reducers:{
        fetchUsers:(state,action:PayloadAction<UserType[]|[]>)=>{
state.users=[...action.payload];
        },
        addUser:(state,action:PayloadAction<UserType>)=>{
            state.users=[...state.users,action.payload]
        }
    }
})

export const {addUser,fetchUsers}=userSlice.actions;
export default userSlice.reducer;