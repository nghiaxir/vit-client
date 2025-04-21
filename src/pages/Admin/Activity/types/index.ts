import { Dayjs } from 'dayjs';

export interface ActivityValues {
    id?: number;
    name: string;
    description: string;
    location: string;
    deadline_date: Dayjs;
    deadline_time: Dayjs;
    isCampain: boolean;
    parentId: string;
    times: Array<{
        id?: number;
        name: string;
        numberRequire: number;
        date: Dayjs;
        time: Dayjs[];
    }>;
}
