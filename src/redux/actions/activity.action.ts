import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import { API } from 'services/axios';
import { QueryParamType, defaultQueryParam } from 'src/constants';
import { Activity } from '../slices/activity.slice';

const prefix = 'activity';

export interface CreateActivityDto {
  name: string;
  description: string;
  location: string;
  deadline: string;
  event_id?: number;
  times: Array<{
    name: string;
    start_time: string;
    end_time: string;
  }>;
}

export interface UpdateActivityDto extends CreateActivityDto {
  id: number;
  times: Array<{
    id: number;
    name: string;
    start_time: string;
    end_time: string;
  }>;
}

export const getAllActivity = createAsyncThunk<Activity[], QueryParamType>(
  'activity/getAll',
  async (
    { page, limit }: QueryParamType = defaultQueryParam,
    { rejectWithValue }
  ) => {
    try {
      const {
        data: { data: res },
      } = await API.get(`${prefix}?page=${page}&limit=${limit}`);
      return res;
    } catch (error: any) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllActivityDeleted = createAsyncThunk<
  Activity[],
  QueryParamType
>(
  'activity/getAllDeleted',
  async (
    { page, limit }: QueryParamType = defaultQueryParam,
    { rejectWithValue }
  ) => {
    try {
      const {
        data: { data: res },
      } = await API.get(`${prefix}/trash?page=${page}&limit=${limit}`);
      return res;
    } catch (error: any) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const createActivity = createAsyncThunk<Activity, CreateActivityDto>(
  'activity/create',
  async (data: CreateActivityDto, { rejectWithValue }) => {
    try {
      const {
        data: { data: res },
      } = await API.post(prefix, data);
      message.success('Tạo hoạt động mới thành công');
      return res;
    } catch (error: any) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateActivity = createAsyncThunk<Activity, UpdateActivityDto>(
  'activity/update',
  async (data: UpdateActivityDto, { rejectWithValue }) => {
    try {
      const { id, ...rest } = data;
      const {
        data: { data: res },
      } = await API.put(`${prefix}/${id}`, rest);
      message.success('Cập nhật hoạt động thành công');
      return res;
    } catch (error: any) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteActivity = createAsyncThunk<number, number>(
  'activity/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`${prefix}/${id}`);
      message.success(data.data.message);
      return id;
    } catch (error: any) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const restoreActivity = createAsyncThunk<number, number>(
  'activity/restore',
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`${prefix}/restore/${id}`);
      message.success(data.data.message);
      return id;
    } catch (error: any) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);
