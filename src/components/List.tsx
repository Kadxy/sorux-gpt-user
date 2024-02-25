//List.tsx

import {API, showError} from "../api/api";
import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, Col, Form, Input, message, Modal, Row, Space, Tag} from "antd";
import {ListResponse, VerifyLoginStatusResponse} from "../types/sorux-types";
import {OpenAIOutlined} from "@ant-design/icons";
import {getUserInfo} from "./Login";
import {ProList} from '@ant-design/pro-components';
import {useNavigate} from "react-router-dom";
import {isMobile} from "../helper";

const {Meta} = Card;

export const verifyLoginStatus = async () => {
    try {
        const res = await API.post(`/api/node/refresh?token=${localStorage.getItem('Token')}`);
        const {StatusCode} = res.data as VerifyLoginStatusResponse;
        if (StatusCode === 0) {
            console.log('登录状态有效');
            return true;
        } else {
            message.error('登录过期，请重新登录');
            console.log('登录状态无效', res);
            localStorage.clear();
            window.location.href = '/login';
            return false;
        }
    } catch (e) {
        showError(e);
        return false;
    }
}

const List = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [lists, setLists] = useState<any[]>([] as ListResponse['data']);
    const [loading, setLoading] = useState(false);
    const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);

    const handelResetPassword = () => {
        console.log('reset')
        setIsResetPasswordModalVisible(true);
    }

    const handelLogout = async () => {
        await API.post('/api/user/logout')
        localStorage.clear();
        navigate('/login');
    }

    const handelClickLink = async (link: string) => {
        if (!await verifyLoginStatus()) return;
        window.open(`https://${link}/logintoken?access_token=${localStorage.getItem('AccessToken')}`);
    }

    const onResetPasswordFinish = async (values: any) => {
        values.username = localStorage.getItem('UserName') || 'undefined';
        if (values.username === 'undefined') {
            console.error('用户名为空');
            return;
        }
        if (values.old_password === values.new_password) {
            console.error('新密码与旧密码相同');
            return;
        }
        if (values.new_password !== values.new_password2) {
            console.error('两次输入的新密码不一致');
            return;
        }
        const res = await API.post('/api/user/editPassword', {
            username: values.username,
            old_password: values.old_password,
            new_password: values.new_password
        });
        const {StatusCode, StatusMsg} = res.data;
        if (StatusCode === 0) {
            message.success('修改密码成功');
            setIsResetPasswordModalVisible(false);
        } else {
            message.error('修改密码失败' + StatusMsg);
        }
    }

    useEffect(() => {
        const getLists = async () => {
            setLoading(true);
            try {
                const res = await API.get(`/api/node/getNodeLists?token=${localStorage.getItem('Token')}`);
                const {StatusCode, StatusMsg, data} = res.data as ListResponse;
                if (StatusCode === 0) {
                    console.log('获取列表成功', data);
                    setLists(data);
                    //时间格式：2024-02-25T20:36:42Z
                    //遍历列表，获取time中距离现在最长的时间，作为有效期
                    const ExpireTime = data.reduce((prev, current) => {
                        return new Date(prev.time) > new Date(current.time) ? prev : current;
                    }).time;
                    const date = new Date(ExpireTime);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1; // getMonth() returns a zero-based value (where zero indicates the first month of the year)
                    const day = date.getDate();
                    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    localStorage.setItem('ExpireTime', formattedDate);
                } else if (StatusCode === 20003) {
                    message.error('登录过期，请重新登录');
                    localStorage.clear();
                    navigate('/login');
                } else {
                    console.log('获取列表失败', StatusMsg);
                }
            } catch (e) {
                showError(e)
            } finally {
                setLoading(false);
            }
        }
        Promise.allSettled([getLists(), getUserInfo()]).then();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <div style={{padding: '24px'}}>
                <Col offset={isMobile ? 0 : 8} span={isMobile ? 24 : 8}>
                    <Row gutter={[16, 16]} style={{marginTop: '24px'}}>
                        <Col span={24}>
                            <Card>
                                <Meta
                                    avatar={<Avatar src={'./avatar.webp'}/>}
                                    title={localStorage.getItem('UserName')}
                                    description={<Tag color="#5BD8A6">有效期至: {localStorage.getItem('ExpireTime')}</Tag>}/>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <ProList<typeof lists[0]>
                                loading={loading}
                                cardBordered={true}
                                ghost={true}
                                locale={{emptyText: '暂无数据',}}
                                size="large"
                                rowKey="id"
                                dataSource={lists}
                                showActions="hover"
                                metas={{
                                    title: {
                                        dataIndex: 'name',
                                    },
                                    avatar: {
                                        render: (_text, row) =>
                                            <Avatar
                                                icon={<OpenAIOutlined/>}
                                                style={{backgroundColor: row.is_plus ? '#9D66DF' : '#6CA784',}}
                                            />
                                    },
                                    description: {
                                        dataIndex: 'description',
                                    },
                                    actions: {
                                        render: (_, row) => [
                                            <a
                                                key="link"
                                                type={'link'}
                                                onClick={() => handelClickLink(row.link)}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                使用
                                            </a>,
                                        ],
                                    },
                                }}/>
                        </Col>

                        <Col span={24}>
                            <Card>
                                <Space direction="vertical" style={{width: '100%'}}>
                                    <Button
                                        size={isMobile ? 'large' : undefined}
                                        block
                                        onClick={async () => {
                                            handelResetPassword();
                                        }}>修改密码
                                    </Button>
                                    <Button
                                        type={'primary'}
                                        size={isMobile ? 'large' : undefined}
                                        block
                                        danger
                                        onClick={async () => {
                                            await handelLogout();
                                        }}>退出登录
                                    </Button>
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </div>
            <Modal
                title="修改密码"
                width={300}
                open={isResetPasswordModalVisible}
                footer={null}
                centered={isMobile}
                onCancel={() => setIsResetPasswordModalVisible(false)}
                afterClose={() => form.resetFields()}
            >
                <Form
                    form={form}
                    style={{marginTop: '24px'}}
                    onFinish={onResetPasswordFinish}
                >
                    <Form.Item rules={[{required: true, message: '请输入原密码'}]} name='old_password'>
                        <Input.Password placeholder="原密码"/>
                    </Form.Item>
                    <Form.Item rules={[{required: true, message: '请输入新密码'}]} name='new_password'>
                        <Input.Password placeholder="新密码"/>
                    </Form.Item>
                    <Form.Item rules={[{required: true, message: '请输入确认密码'}]} name='new_password2'>
                        <Input.Password placeholder="确认密码"/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType={'submit'} block>确认</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default List;