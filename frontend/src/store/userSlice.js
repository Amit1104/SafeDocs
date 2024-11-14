import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { show } from "../utils/Helper";
import API from "../API";


export const logout = createAsyncThunk(
    'User/logout', async (params, { dispatch }) => {
        try {
            const res = await API.post("/logout")
            dispatch(unsetCurrentUser());
            show({
                message: res?.data?.message,
                displayClass: "success"
            })

        } catch (error) {
            console.error("Logout Err:", error)
        }
    }
)

// export const getDesignations = createAsyncThunk(
//     'GET/designations', async (params, { dispatch }) => {
//         try {
//             const res = await API.get("/get-designations", { params })
//             dispatch(setDesignation(res?.data?.data));
//         } catch (error) {
//             console.error("WhoAmI Err:", error)
//         }
//     }
// )

export const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: {
        myUser: null,
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.myUser = action.payload;
        },
        unsetCurrentUser: (state, action) => {
            state.myUser = undefined;
        },
        setDesignation: (state, action) => {
            state.designations = action.payload
        }
    },
})

// const { unsetCurrentUser } = currentUserSlice.actions

export const { setCurrentUser, unsetCurrentUser, setDesignation } = currentUserSlice.actions

export default currentUserSlice.reducer
