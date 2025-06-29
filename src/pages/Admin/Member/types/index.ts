import { Dayjs } from 'dayjs';

export interface MemberDataType {
    id: string;
    key: string;
    username: string;
    fullname: string;
    email: string;
    phone: string;
    dateJoin?: string | null;
    dateOut?: string | null;
    school?: string | null;
    studentId?: string | null;
    major?: string | null;
    gender: string;
    status: string;
    position: string;
}

export interface CreateMemberValues {
    fullname: string;
    email: string;
    phone: string;
    birthday: Dayjs;
    school: string;
    class: string;
    studentId: string;
    dateJoin: Dayjs;
    gender: string;
    position: string;
}

export interface CreateUserDto
    extends Omit<CreateMemberValues, 'birthday' | 'dateJoin'> {
    birthday: string;
    dateJoin: string;
}
