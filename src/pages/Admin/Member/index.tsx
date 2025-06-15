import {
    Button,
    CheckboxChangeEvent,
    Form,
    Input,
    Modal,
    Popconfirm,
    Radio,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
    message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsDownload } from 'react-icons/bs';
import { MdBlock, MdModeEditOutline } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { deleteUser, getAllMember } from 'redux/actions';
import { memberSelector } from 'redux/slices/member.slice';
import { useAppDispatch } from 'redux/store';
import { DATE_FORMAT } from 'src/constants';
import { Position } from 'src/constants/position';
import { defaultQueryParam } from 'src/constants/type';
import { importMany, signupUser } from 'src/services/auth';
import { getPosition } from 'utils';
import { CiBookmarkCheck } from 'react-icons/ci';
import './index.scss';
import { CreateMemberValues, MemberDataType } from './types';
import { updateMemberPosition } from 'src/services/admin';
import { HiOutlineTrash } from 'react-icons/hi2';
import { CreateMember } from './components';

export interface UpdateUserInfo {
    id: string;
    fullname?: string;
    username?: string;
    email?: string;
    phone?: string;
    position?: string;
    school?: string | null;
    studentId?: string | null;
    status?: string | null;
}

const Member: React.FC = () => {
    const dispatch = useAppDispatch();
    const { members, loading } = useSelector(memberSelector);
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState('manual');
    const [form1] = Form.useForm<CreateMemberValues>();
    const [form2] = Form.useForm<MemberDataType>();
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File>();
    const [value, setValue] = useState();
    const [isFileEmpty, setIsFileEmpty] = useState(false);
    const [isSendMail, setIsSendMail] = useState(true);
    const [filter, setFilter] = useState('');
    const [filterText, setFilterText] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [currMember, setCurrMember] = useState<UpdateUserInfo>();
    const [currAct, setCurrAct] = useState<string>();

    const onKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            setFilterText(filter);
        }
    };

    const confirmDelete = async (
        e: React.MouseEvent<HTMLElement, MouseEvent> | undefined
    ) => {
        dispatch(deleteUser(currAct!));
    };

    const confirmChangeStatus = async (
        id: string,
        status: string,
        e: React.MouseEvent<HTMLElement, MouseEvent> | undefined
    ) => {
        try {
            setIsLoading(true);
            const { data } = await updateMemberPosition(id, {
                id: id,
                status: status,
            });
            await getMembers();
            message.success('Cập nhật trạng thái tài khoản thành công');
        } catch (error: any) {
            message.error(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const onFilterChange = (e: any) => {
        setFilter(e.target.value);
    };

    const onChange = (key: string) => {
        setTab(key);
    };

    const columns: ColumnsType<MemberDataType> = [
        {
            key: 'username',
            title: 'Tên đăng nhập',
            dataIndex: 'username',
        },
        {
            key: 'fullname',
            title: 'Họ và tên',
            dataIndex: 'fullname',
        },
        {
            key: 'email',
            title: 'Địa chỉ email',
            dataIndex: 'email',
        },
        {
            key: 'phone',
            title: 'Số điện thoại',
            dataIndex: 'phone',
            render: (phone) => <a href={`tel:${phone}`}>{phone}</a>,
        },
        {
            key: 'dateJoin',
            title: 'Ngày vào Đội',
            dataIndex: 'dateJoin',
            render: (text) =>
                text ? dayjs(new Date(text)).format('MM/YYYY') : '',
        },
        {
            key: 'dateOut',
            title: 'Ngày rời Đội',
            dataIndex: 'dateOut',
            render: (text) =>
                text ? dayjs(new Date(text)).format('MM/YYYY') : '',
        },
        {
            key: 'gender',
            title: 'Giới tính',
            dataIndex: 'gender',
            render: (text) =>
                text === 'MALE' ? 'Nam' : text === 'FEMALE' ? 'Nữ' : 'Khác',
        },
        {
            key: 'status',
            title: 'Trạng thái',
            dataIndex: 'status',
            align: 'center',
            render: (text) =>
                text === 'ACTIVE' ? (
                    <Tag color="success">Hoạt động</Tag>
                ) : text === 'INACTIVE' ? (
                    <Tag color="warning">Chưa kích hoạt</Tag>
                ) : (
                    <Tag color="error">Bị khoá</Tag>
                ),
        },
        {
            key: 'position',
            title: 'Vị trí',
            dataIndex: 'position',
            render: (text) => getPosition(text),
        },
        {
            key: 'action',
            title: 'Chỉnh sửa',
            render: (_: string, member: MemberDataType) => (
                <Space>
                    <Tooltip title="Xem thông tin chi tiết">
                        <Button
                            className="d-center"
                            type="primary"
                            shape="circle"
                            icon={<MdModeEditOutline />}
                            onClick={() => {
                                setCurrMember(member);
                                setEditModal(true);
                                form2.setFieldsValue(member);
                            }}
                        />
                    </Tooltip>
                    {member.status == 'ACTIVE' ? (
                        <Popconfirm
                            title="Chặn tài khoản hoạt động"
                            description="Bạn chắc chắn muốn chặn tài khoản này?"
                            onConfirm={(e) =>
                                confirmChangeStatus(member.id, 'BLOCKED', e)
                            }
                            okText="OK"
                            cancelText="Huỷ"
                        >
                            <Tooltip title="Chặn">
                                <Button
                                    className="d-center"
                                    color="yellow"
                                    variant="solid"
                                    shape="circle"
                                    icon={<MdBlock />}
                                    onClick={() =>
                                        setCurrAct(String(member.id))
                                    }
                                />
                            </Tooltip>
                        </Popconfirm>
                    ) : (
                        <Popconfirm
                            title={`${
                                currMember?.status == 'BLOCK'
                                    ? 'Bỏ chặn tài khoản'
                                    : 'Kích hoạt tài khoản'
                            }`}
                            description={`${
                                currMember?.status == 'BLOCK'
                                    ? 'Bạn có chắc muốn bỏ chặn tài khoản'
                                    : 'Bạn có chắc muốn kích hoạt tài khoản'
                            }`}
                            onConfirm={(e) =>
                                confirmChangeStatus(member.id, 'ACTIVE', e)
                            }
                            okText="OK"
                            cancelText="Huỷ"
                        >
                            <Tooltip
                                title={`${
                                    currMember?.status == 'BLOCK'
                                        ? 'Bỏ chặn tài khoản'
                                        : 'Kích hoạt tài khoản'
                                }`}
                            >
                                <Button
                                    className="d-center"
                                    color="green"
                                    variant="solid"
                                    shape="circle"
                                    icon={<CiBookmarkCheck />}
                                    onClick={() =>
                                        setCurrAct(String(member.id))
                                    }
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}

                    <Popconfirm
                        title="Xoá tài khoản"
                        description="Bạn chắc chắn muốn xoá tài khoản này?"
                        onConfirm={confirmDelete}
                        okText="OK"
                        cancelText="Huỷ"
                    >
                        <Tooltip title="Xoá">
                            <Button
                                className="d-center"
                                type="primary"
                                danger
                                shape="circle"
                                icon={<HiOutlineTrash />}
                                onClick={() => setCurrAct(String(member.id))}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const dataSource: MemberDataType[] = useMemo(() => {
        if (filterText)
            return members
                .filter((mem) => mem.username.includes(filterText))
                .map<MemberDataType>(
                    ({
                        id,
                        username,
                        fullname,
                        email,
                        phone,
                        dateJoin,
                        dateOut,
                        gender,
                        status,
                        school,
                        studentId,
                        position,
                    }) => ({
                        id,
                        key: username,
                        username,
                        fullname,
                        email,
                        phone,
                        dateJoin,
                        dateOut,
                        gender,
                        school,
                        studentId,
                        status,
                        position,
                    })
                );
        else
            return members.map<MemberDataType>(
                ({
                    id,
                    username,
                    fullname,
                    email,
                    phone,
                    dateJoin,
                    dateOut,
                    gender,
                    school,
                    studentId,
                    status,
                    position,
                }) => ({
                    id,
                    key: username,
                    username,
                    fullname,
                    email,
                    phone,
                    dateJoin,
                    dateOut,
                    school,
                    studentId,
                    gender,
                    status,
                    position,
                })
            );
    }, [filterText, members]);

    const handleCancel = () => {
        setOpen(false);
    };

    const handleOK = () => {
        if (tab === 'manual') form1.submit();
        else handleUpload();
    };

    const handleSubmit = async (createMemberValues: CreateMemberValues) => {
        const { birthday, dateJoin, ...rest } = createMemberValues;
        try {
            setIsLoading(true);
            setOpen(false);
            const { data } = await signupUser({
                ...rest,
                birthday: birthday && dayjs(birthday).toISOString(),
                dateJoin: dateJoin && dayjs(dateJoin).toISOString(),
            });
            await getMembers();
            message.success(data.data.message);
            form1.resetFields();
        } catch (error: any) {
            message.error(error.response.data.message);
            setOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setIsFileEmpty(true);
            return;
        }
        const fileData = new FormData();
        fileData.append('file', file);
        try {
            setIsLoading(true);
            setOpen(false);
            const { data } = await importMany(fileData, isSendMail);
            message.success(data.data.message);
            setValue(undefined);
            await getMembers();
        } catch (error: any) {
            console.log(error);
            message.error(error.response.data.message);
            setOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (file) setIsFileEmpty(false);
    }, [file]);

    const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleCheckSendEmail = (e: CheckboxChangeEvent) => {
        setIsSendMail(e.target.checked);
    };

    const getMembers = async () => {
        dispatch(getAllMember(defaultQueryParam));
    };

    const handleDownload = () => {
        const fileUrl = '/src/assets/excel/template-data.xlsx';
        window.open(fileUrl, '_blank');
    };

    const handleEditInfoOk = () => {
        form2.submit();
        setEditModal(false);
    };

    const handleEditModalCancel = () => {
        form2.resetFields();
        setEditModal(false);
    };

    const handleEditFormSubmit = async (formData: UpdateUserInfo) => {
        if (!currMember) return;
        try {
            setIsLoading(true);
            const { data } = await updateMemberPosition(
                currMember.id,
                formData
            );
            await getMembers();
            message.success('Cập nhật thông tin thành viên thành công');
        } catch (error: any) {
            message.error(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'VIT | Quản lý nhân sự';
        getMembers();
    }, []);

    return (
        <div className="content member">
            <h2 className="title mb-15">Quản lý nhân sự</h2>
            <div className="d-flex mb-6 gap-2">
                <Input
                    placeholder="tìm theo username"
                    style={{ width: 250 }}
                    className="ml-auto"
                    value={filter}
                    onChange={onFilterChange}
                    onKeyDown={onKeyPress}
                />
                <Button
                    className="d-center gap-2"
                    type="primary"
                    icon={<AiOutlinePlus />}
                    onClick={() => setOpen(true)}
                >
                    Thêm thành viên
                </Button>
            </div>
            <Table
                loading={loading || isLoading}
                columns={columns}
                dataSource={dataSource}
                size="small"
                className="content-table"
                bordered
            />

            <CreateMember
                form={form1}
                handleSubmit={handleSubmit}
                handleChangeFile={handleChangeFile}
                isFileEmpty={isFileEmpty}
                isSendMail={isSendMail}
                setIsSendMail={setIsSendMail}
                openCreateModal={open}
                handleCancel={handleCancel}
                handleOK={handleOK}
                tab={tab}
                onTabChange={onChange}
            />

            <Modal
                title="Chỉnh sửa thông tin TNV"
                open={editModal}
                onOk={handleEditInfoOk}
                onCancel={handleEditModalCancel}
                okText="Lưu"
                cancelText="Huỷ"
            >
                <Form
                    form={form2}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    labelAlign="left"
                    initialValues={currMember}
                    onFinish={handleEditFormSubmit}
                >
                    <Form.Item label="Username" name="username">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Họ tên"
                        name="fullname"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ tên' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại',
                            },
                        ]}
                        label="Số điện thoại"
                        name="phone"
                    >
                        <Input maxLength={10} />
                    </Form.Item>
                    <Form.Item label="Giới tính" name="gender">
                        <Radio.Group>
                            <Radio value="MALE">Nam</Radio>
                            <Radio value="FEMALE">Nữ</Radio>
                            <Radio value="OTHER">Khác</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Trường (Khoa/Viện)" name="school">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Lớp" name="class">
                        <Input />
                    </Form.Item>
                    <Form.Item label="MSSV" name="studentId">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        id="position-select"
                        label="Vị trí"
                        name="position"
                    >
                        <Select options={Position} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Member;
