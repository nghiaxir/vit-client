import { Dayjs } from 'dayjs';

export interface ActivityValues {
    id?: number;
    name: string;
    description: string;
    location: string;
    deadline_date: Dayjs;
    deadline_time: Dayjs;
    score: number;
    isCampain: number;
    parentId: string;
    times: Array<{
        id?: number;
        name: string;
        numberRequire: number;
        date: Dayjs;
        time: Dayjs[];
    }>;
}
