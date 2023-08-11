import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Typography,
  Upload,
  message,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { Loading } from 'components';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { BiCamera } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { DATE_FORMAT } from 'src/constants';
import { User, authSelector } from 'src/redux/slices/auth.slice';
import { getUser } from 'src/services/user';
import { getPosition } from 'utils';
import NotFound from '../NotFound';
import './index.scss';

const Title = Typography.Title;

const Profile: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<User>();
  const { user } = useSelector(authSelector);

  const showModal = () => {
    setOpen(true);
  };

  const handleBeforeUpload = (file: File) => {
    getBufferFromFile(file)
      .then((buffer) => {
        console.log(buffer);
      })
      .catch((error: any) => {
        message.error('Lỗi khi tải lên ảnh của bạn.');
      });
    return false;
  };

  const getBufferFromFile = (file: File) => {
    return new Promise<ArrayBuffer>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as ArrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleOk = () => {};

  const handleCancel = () => {
    setOpen(false);
  };

  const getInfo = async () => {
    if (!id) {
      if (user) setProfile(user);
      return;
    }

    try {
      setLoading(true);
      const { data } = await getUser(id);
      setProfile(data.data);
    } catch (error: any) {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInfo();
  }, [id]);

  if (isError) return <NotFound />;

  return (
    <>
      <div className="profile d-center w-full">
        <div className="container w-full">
          <Title className="text-center mb-10" level={2}>
            Thông tin cá nhân
          </Title>
          <Row>
            <Col xs={24} sm={8} className="d-center mb-auto">
              <div className="profile-ava">
                <div className="img-wrap">
                  <Avatar
                    size={200}
                    className="w-full d-center"
                    src={profile?.avatar}
                  >
                    <Title className="mb-0 text-white">
                      {user?.username.charAt(0).toUpperCase()}
                    </Title>
                  </Avatar>
                </div>
                <ImgCrop rotationSlider>
                  <Upload
                    beforeUpload={handleBeforeUpload}
                    showUploadList={false}
                    accept="image/*"
                  >
                    <Button
                      className="d-center"
                      shape="circle"
                      icon={<BiCamera />}
                      title="Thay đổi ảnh đại diện"
                    />
                  </Upload>
                </ImgCrop>
                <div className="bio mt-3 text-center">
                  <Typography.Text>{profile?.bio}</Typography.Text>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={16}>
              <Row align="middle">
                <Col span={6}>
                  <Title level={4}>Họ và tên:</Title>
                </Col>
                <Col span={18}>
                  <Title level={4}>{profile?.fullname}</Title>
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>
                  <Title level={4}>Chức vụ:</Title>
                </Col>
                <Col span={18}>
                  <Title level={4}>
                    {profile && getPosition(profile?.position)}
                  </Title>
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>
                  <Title level={4}>Địa chỉ email:</Title>
                </Col>
                <Col span={18}>
                  <Title level={4}>
                    <a href={`mailto:${profile?.email}`}>{profile?.email}</a>
                  </Title>
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>
                  <Title level={4}>Số điện thoại:</Title>
                </Col>
                <Col span={18}>
                  <Title level={4}>
                    <a href={`tel:${profile?.phone}`}>{profile?.phone}</a>
                  </Title>
                </Col>
              </Row>
              <Row align="middle">
                <Col span={6}>
                  <Title level={4}>Giới tính:</Title>
                </Col>
                <Col span={18}>
                  <Title level={4}>
                    {profile?.gender === 'MALE'
                      ? 'Nam'
                      : profile?.gender === 'FEMALE'
                      ? 'Nữ'
                      : 'Khác'}
                  </Title>
                </Col>
              </Row>
              {profile?.birthday && (
                <Row align="middle">
                  <Col span={6}>
                    <Title level={4}>Ngày sinh:</Title>
                  </Col>
                  <Col span={18}>
                    <Title level={4}>
                      {dayjs(profile?.birthday).format(DATE_FORMAT)}
                    </Title>
                  </Col>
                </Row>
              )}
              {profile?.hometown && (
                <Row align="middle">
                  <Col span={6}>
                    <Title level={4}>Quê quán:</Title>
                  </Col>
                  <Col span={18}>
                    <Title level={4}>{profile?.hometown}</Title>
                  </Col>
                </Row>
              )}
              {profile?.address && (
                <Row align="middle">
                  <Col span={6}>
                    <Title level={4}>Địa chỉ hiện tại:</Title>
                  </Col>
                  <Col span={18}>
                    <Title level={4}>{profile?.address}</Title>
                  </Col>
                </Row>
              )}
              {profile?.school && (
                <Row align="middle">
                  <Col span={6}>
                    <Title level={4}>Trường:</Title>
                  </Col>
                  <Col span={18}>
                    <Title level={4}>{profile?.school}</Title>
                  </Col>
                </Row>
              )}
              {profile?.class && (
                <Row align="middle">
                  <Col span={6}>
                    <Title level={4}>Lớp:</Title>
                  </Col>
                  <Col span={18}>
                    <Title level={4}>{profile?.class}</Title>
                  </Col>
                </Row>
              )}
              {profile?.student_id && (
                <Row align="middle">
                  <Col span={6}>
                    <Title level={4}>MSSV:</Title>
                  </Col>
                  <Col span={18}>
                    <Title level={4}>{profile?.student_id}</Title>
                  </Col>
                </Row>
              )}
              {profile?.cccd && (
                <Row align="middle">
                  <Col span={6}>
                    <Title level={4}>Số CCCD/CMT:</Title>
                  </Col>
                  <Col span={18}>
                    <Title level={4}>{profile?.cccd}</Title>
                  </Col>
                </Row>
              )}
              {profile?.date_join && (
                <Row align="middle">
                  <Col span={6}>
                    <Title level={4}>Ngày vào Đội:</Title>
                  </Col>
                  <Col span={18}>
                    <Title level={4}>
                      {dayjs(profile?.date_join).format('MM/YYYY')}
                    </Title>
                  </Col>
                </Row>
              )}
              {profile?.date_out && (
                <Row align="middle">
                  <Col span={6}>
                    <Title level={4}>Ngày rời Đội:</Title>
                  </Col>
                  <Col span={18}>
                    <Title level={4}>
                      {dayjs(profile?.date_out).format('MM/YYYY')}
                    </Title>
                  </Col>
                </Row>
              )}
              <Row align="middle">
                <Button type="primary" onClick={showModal}>
                  Chỉnh sửa thông tin
                </Button>
              </Row>
            </Col>
          </Row>
        </div>

        <Modal
          title="Chỉnh sửa thông tin TNV"
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Lưu"
          cancelText="Huỷ"
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{
              ...profile,
              birthday: dayjs(profile?.birthday),
            }}
            // onFinish={onFinish}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
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
                  message: 'Please input your phone!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="DatePicker"
              name="birthday"
              rules={[
                {
                  required: true,
                  message: 'Please input your birthday!',
                },
              ]}
            >
              <DatePicker className="w-full" format={DATE_FORMAT} />
            </Form.Item>
            <Form.Item label="Quê quán" name="hometown">
              <Input />
            </Form.Item>
            <Form.Item label="Địa chỉ tạm trú" name="address">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>

      {loading && <Loading />}
    </>
  );
};

export default Profile;
