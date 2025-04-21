import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Modal,
    Row,
    TimePicker,
    Typography,
    Radio,
    Select,
} from 'antd';
import dayjs from 'dayjs';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi2';
import { createActivity } from 'redux/actions';
import { useAppDispatch } from 'redux/store';
import { DATE_FORMAT, TIME_FORMAT } from 'src/constants';
import { ActivityValues } from '../types';
import { log } from 'node:console';
import { Campain } from '../../../../redux/slices/activity.slice';

interface CreateActivityModalProps {
    show: boolean;
    setShow: Dispatch<SetStateAction<boolean>>;
    listCampains: Campain[];
}

const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
    show,
    setShow,
    listCampains,
}) => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm<ActivityValues>();
    const [initialValues, setInitialValues] = useState({
        times: [{}],
    });

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setShow(false);
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };

    const handleSubmit = async (data: ActivityValues) => {
        dispatch(
            createActivity({
                name: data.name,
                description: data.description,
                location: data.location,
                isCampain: Boolean(data.isCampain),
                parentId: data.parentId,
                deadline: dayjs(data.deadline_date)
                    .hour(data.deadline_time.hour())
                    .minute(data.deadline_time.minute())
                    .second(0)
                    .millisecond(0)
                    .toISOString(),
                times: data.times.map((time) => ({
                    name: time.name,
                    numberRequire: time.numberRequire,
                    startTime: dayjs(time.date)
                        .hour(time.time[0].hour())
                        .minute(time.time[0].minute())
                        .second(0)
                        .millisecond(0)
                        .toISOString(),
                    endTime: dayjs(time.date)
                        .hour(time.time[1].hour())
                        .minute(time.time[1].minute())
                        .second(0)
                        .millisecond(0)
                        .toISOString(),
                })),
            })
        ).then((res) => {
            if (res.type.endsWith('fulfilled')) {
                form.resetFields();
                setInitialValues({
                    times: [{}],
                });
            }
        });
        setShow(false);
    };

    return (
        <Modal
            title="Tạo hoạt động mới"
            open={show}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Tạo hoạt động"
            cancelText="Huỷ"
            width={640}
        >
            <Form
                form={form}
                name="create-activity"
                layout="vertical"
                onFinish={handleSubmit}
                className="mt-10"
                initialValues={initialValues}
            >
                <Form.Item
                    label="Tên hoạt động"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên hoạt động',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập mô tả của hoạt động',
                        },
                    ]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    label="Địa điểm"
                    name="location"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập địa điểm diễn ra hoạt động',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Loại hoạt động"
                    name="isCampain"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn loại hoạt động',
                        },
                    ]}
                >
                    <Radio.Group
                        options={[
                            {
                                value: 0,
                                label: 'Hoạt động bình thường',
                            },
                            {
                                value: 1,
                                label: 'Chiến dịch',
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label="Chọn chiến dịch (nếu hoạt động nằm trong chiến dịch)"
                    name="parentId"
                >
                    <Select
                        showSearch
                        placeholder="Chọn chiến dịch"
                        allowClear
                        optionFilterProp="label"
                        onSearch={onSearch}
                        options={listCampains.map((campain) => {
                            return {
                                label: campain.name,
                                value: campain.id,
                            };
                        })}
                    />
                </Form.Item>
                <Typography>Deadline đăng ký</Typography>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày"
                            name="deadline_date"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Vui lòng chọn deadline đăng ký hoạt động',
                                },
                            ]}
                        >
                            <DatePicker
                                placeholder=""
                                className="w-full"
                                format={DATE_FORMAT}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giờ"
                            name="deadline_time"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Vui lòng chọn deadline đăng ký hoạt động',
                                },
                            ]}
                        >
                            <TimePicker
                                placeholder=""
                                className="w-full"
                                format={TIME_FORMAT}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Typography>Thời gian diễn ra</Typography>
                <Form.List name="times">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(
                                ({ key, name, ...restField }, index) => (
                                    <Row gutter={16} key={key}>
                                        <Col span={5}>
                                            <Form.Item
                                                {...restField}
                                                label="Tên"
                                                name={[name, 'name']}
                                                initialValue={`Kíp ${
                                                    index + 1
                                                }`}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Vui lòng nhập tên kíp hoạt động này',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    disabled={
                                                        form.getFieldValue(
                                                            'isCampain'
                                                        ) == 0
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                {...restField}
                                                label="Ngày"
                                                name={[name, 'date']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Vui lòng chọn ngày diễn ra kíp hoạt động này',
                                                    },
                                                ]}
                                            >
                                                <DatePicker
                                                    placeholder=""
                                                    className="w-full"
                                                    format={DATE_FORMAT}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={7}>
                                            <Form.Item
                                                {...restField}
                                                label="Giờ"
                                                name={[name, 'time']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Vui lòng chọn giờ diễn ra kíp hoạt động này',
                                                    },
                                                ]}
                                            >
                                                <TimePicker.RangePicker
                                                    className="w-full"
                                                    placeholder={[
                                                        'Bắt đầu',
                                                        'Kết thúc',
                                                    ]}
                                                    format={[
                                                        TIME_FORMAT,
                                                        TIME_FORMAT,
                                                    ]}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Form.Item
                                                {...restField}
                                                label="Số lượng"
                                                name={[name, 'numberRequire']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Vui lòng nhập số lượng người yêu cầu cho kíp này',
                                                    },
                                                ]}
                                            >
                                                <Input type="number" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} className="d-flex">
                                            <Button
                                                className="d-center my-auto"
                                                type="primary"
                                                danger
                                                shape="circle"
                                                icon={<HiOutlineTrash />}
                                                disabled={fields.length <= 1}
                                                onClick={() => remove(name)}
                                            />
                                        </Col>
                                    </Row>
                                )
                            )}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                >
                                    Thêm kíp
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default CreateActivityModal;
