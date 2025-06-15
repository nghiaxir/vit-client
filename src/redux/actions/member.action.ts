import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from 'services/axios';
import { QueryParamType, defaultQueryParam } from 'src/constants';
import { User } from '../slices/auth.slice';
import { message } from 'antd';

export const getAllMember = createAsyncThunk<User[], QueryParamType>(
    'member/getAll',
    async (
        { page, limit }: QueryParamType = defaultQueryParam,
        { rejectWithValue }
    ) => {
        try {
            const {
                data: { data: res },
            } = await API.get(`user/all?page=${page}&limit=${limit}`);
            return res;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteUser = createAsyncThunk<string, string>(
    'user/detede',
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await API.delete(`user/${id}`);
            message.success(data.data.message);
            return id;
        } catch (error: any) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);
