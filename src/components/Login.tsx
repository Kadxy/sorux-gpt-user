import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {API, showError} from "../api/api";
import {LoginRequest, LoginResponse, UserInfoResponse} from "../types/sorux-types";
import {Button, Form, Input, message} from "antd";
import {useNavigate} from "react-router-dom";
import {isMobile} from "../helper";
import {useEffect, useState} from "react";
import {verifyLoginStatus} from "./List";

export const getUserInfo = async () => {
    try {
        const res = await API.get('/api/user/me?token=' + localStorage.getItem('Token'));
        const {StatusCode, StatusMsg, Data} = res.data as UserInfoResponse;
        if (StatusCode === 0) {
            console.log('获取用户信息成功', Data);
            localStorage.setItem('UserName', Data.UserName);
            localStorage.setItem('UserID', Data.ID.toString());
            return true;
        } else if (StatusCode === 20003) {
            message.error('登录过期，请重新登录');
            localStorage.clear();
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            return false;
        } else {
            alert('获取用户信息失败' + StatusMsg);
            return false;
        }
    } catch (e) {
        showError(e)
    }
}

const Login = () => {
    const navigate = useNavigate();
    const [logging, setLogging] = useState(false);
    const onFinish = async (values: LoginRequest) => {
        if (logging) return;
        setLogging(true);
        try {
            const res = await API.post('/api/user/login', values);
            const {StatusCode, StatusMsg, Token, AccessToken} = res.data as LoginResponse;
            if (StatusCode === 0) {
                message.success('登录成功')
                navigate('/list');
                Token && localStorage.setItem('Token', Token);
                AccessToken && localStorage.setItem('AccessToken', AccessToken);
                await getUserInfo();
            } else {
                message.error('登录失败：' + StatusMsg);
            }
        } catch (e) {
            showError(e)
        } finally {
            setLogging(false);
        }
    }

    //如果缓存有Token，就获取用户信息，获取成功就跳转到列表页
    useEffect(() => {
        verifyLoginStatus().then((susccess) => {
            susccess && navigate('/list');
        });
        // eslint-disable-next-line
    }, []);

    return (
        <div
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${isMobile ? '80%' : '24%'}`,//移动端宽度100%，PC端宽度400px
                padding: `${isMobile ? '24px' : '48px'}`,
                borderRadius: '15px',
                boxShadow: '0 0 100px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
            }}
        >
            <h1 style={{textAlign: 'center'}}>登录</h1>
            <Form name="normal_login" onFinish={onFinish} size={'large'}>
                <Form.Item name="username" rules={[{required: true, message: '请输入用户名!'}]}>
                    <Input prefix={<UserOutlined/>} placeholder={'用户名'}/>
                </Form.Item>
                <Form.Item name="password" rules={[{required: true, message: '请输入密码！'}]}>
                    <Input.Password prefix={<LockOutlined/>} placeholder={'密码'}/>
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={logging}>登录</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;