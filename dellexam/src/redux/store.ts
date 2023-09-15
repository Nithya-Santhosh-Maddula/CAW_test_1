import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";
import { useDispatch, useSelector } from "react-redux";
export const createStore=()=>configureStore({
    reducer:{
        users:UserSlice,
    }
})

export const store =createStore();

// export const useAppDispatch=()=>useDispatch();
// export const useAppSelector=useSelector;
export type RootState=ReturnType<typeof store.getState>;
 //export type AppStore = ReturnType<typeof store>
//export type AppDispatch=typeof store.dispatch;

// import {
//     combineReducers,
//     configureStore,
//     PreloadedState
//   } from '@reduxjs/toolkit'
//   import UserSlice from "./UserSlice";
//   // Create the root reducer independently to obtain the RootState type
//   const rootReducer = combineReducers({
//     user: UserSlice
//   })
//   export function setupStore(preloadedState?: PreloadedState<RootState>) {
//     return configureStore({
//       reducer: rootReducer,
//       preloadedState
//     })
//   }
//   export type RootState = ReturnType<typeof rootReducer>
//   export type AppStore = ReturnType<typeof setupStore>
//   export type AppDispatch = AppStore['dispatch']
