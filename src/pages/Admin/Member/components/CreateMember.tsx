import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Checkbox,
    Col,
    DatePicker,
    Form,
    FormInstance,
    Input,
    Modal,
    Radio,
    Row,
    Select,
    Tabs,
    TabsProps,
    Typography,
} from 'antd';
import { DATE_FORMAT } from '../../../../constants';
import { Position } from '../../../../constants/position';
import { BsDownload } from 'react-icons/bs';

interface CreateMemberProp {
    form: FormInstance;
    handleSubmit: (values: any) => void;
    handleChangeFile: (values: any) => void;
    isFileEmpty: boolean;
    isSendMail: boolean;
    setIsSendMail: (values: any) => void;
    openCreateModal: boolean;
    handleCancel: (values: any) => void;
    handleOK: (values: any) => void;
    tab: string;
    onTabChange: (values: any) => void;
}

const CreateMember: React.FC<CreateMemberProp> = (props) => {
    const handleDownload = () => {
        const fileUrl = '/src/assets/excel/template-data.xlsx';
        window.open(fileUrl, '_blank');
    };

    const items: TabsProps['items'] = [
        {
            key: 'manual',
            label: <Typography.Text>Nhập tay</Typography.Text>,
            children: (
                <Form
                    name="create-member"
                    form={props.form}
                    className="mt-6"
                    labelCol={{ span: 6 }}
                    labelAlign="left"
                    onFinish={props.handleSubmit}
                    initialValues={{
                        gender: 'OTHER',
                        position: 'THANH_VIEN',
                        isSendMail: true,
                    }}
                >
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
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại',
                            },
                        ]}
                    >
                        <Input maxLength={10} />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập Email' },
                        ]}
                    >
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item label="Giới tính" name="gender">
                        <Radio.Group>
                            <Radio value="MALE">Nam</Radio>
                            <Radio value="FEMALE">Nữ</Radio>
                            <Radio value="OTHER">Khác</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Ngày sinh" name="birthday">
                        <DatePicker
                            placeholder=""
                            className="w-full"
                            format={DATE_FORMAT}
                        />
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
                    <Form.Item label="Ngày vào Đội" name="dateJoin">
                        <DatePicker
                            placeholder=""
                            className="w-full"
                            picker="month"
                            format="MM/YYYY"
                        />
                    </Form.Item>
                    <Form.Item
                        id="position-select"
                        label="Vị trí"
                        name="position"
                    >
                        <Select options={Position} />
                    </Form.Item>
                    <Form.Item
                        valuePropName="checked"
                        wrapperCol={{ offset: 6, span: 18 }}
                        name="isSendMail"
                    >
                        <Checkbox>Gửi email?</Checkbox>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: 'file',
            label: <Typography.Text>Thêm tệp</Typography.Text>,
            children: (
                <>
                    <div className="d-flex mt-6">
                        <Button
                            className="d-center ml-auto gap-2"
                            type="primary"
                            icon={<BsDownload />}
                            onClick={handleDownload}
                        >
                            Tải file mẫu
                        </Button>
                    </div>
                    <Row className="mt-6">
                        <Col span={6}>
                            <label htmlFor="upload-file">
                                <span style={{ color: 'red' }}>* </span>
                                File excel :
                            </label>
                        </Col>
                        <Col span={18}>
                            <input
                                onChange={props.handleChangeFile}
                                id="upload-file"
                                type="file"
                                name="file"
                                accept=".xlsx,.xls"
                            />
                            {props.isFileEmpty && (
                                <p className="mb-0" style={{ color: 'red' }}>
                                    Bạn chưa chọn file nào
                                </p>
                            )}
                        </Col>
                    </Row>
                    <Row className="my-4">
                        <Col span={6}></Col>
                        <Col span={18}>
                            <Checkbox
                                checked={props.isSendMail}
                                onChange={props.setIsSendMail}
                            >
                                Gửi email?
                            </Checkbox>
                        </Col>
                    </Row>
                </>
            ),
        },
    ];

    return (
        <Modal
            open={props.openCreateModal}
            title="Thêm thành viên"
            onCancel={props.handleCancel}
            onOk={props.handleOK}
            cancelText="Huỷ"
            width={600}
        >
            <Tabs items={items} onChange={props.onTabChange} />
        </Modal>
    );
};

export default CreateMember;
