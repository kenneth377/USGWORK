import React from 'react';
import { Form, Input, Button, Typography, Card } from 'antd';
import { postData } from './Fectchdata'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import './styles/loginpage.css';
import Lottie from 'lottie-react';
import loginAnimation from "./img/login.json"
import logimg from "./img/avatarimgla.jpg"

const { Title } = Typography;

export default function Login({ setIsAuthenticated, nowUser, setNowuser }) {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      console.log('Login successful:', values);
      const response = await postData('http://localhost:3000/user/login', values);
      if (response.success) {
        console.log("Login response:", response.data);
        setNowuser(response.data.user)
        setIsAuthenticated(true);
        localStorage.setItem('authToken', response.data.token); // Store auth token if needed
        navigate('/'); // Navigate to the dashboard on successful login
      } else {
        console.error('Login failed:', response.message); // Handle unsuccessful login
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='loginpage' style={{ display: "flex", padding: "20px 100px", height: "100vh", width: "100vw", gap: "10px", justifyContent: "center" }}>
      <div className="loginform" style={{ flexBasis: "40%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginRight: "-100px" }}>
        <Card bordered={false} style={{ width: "100%", padding: "20px", textAlign: "center" }}>
          <Title level={3}>Welcome Back</Title>
          <p style={{ color: '#888' }}>Please enter your login details</p>
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block style={{ marginTop: '20px' }}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <div className="lottiecontainer image-overlay" style={{ flexBasis: "60%", borderRadius: "10px", background: "red", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* <Lottie animationData={loginAnimation} loop={true} style={{ width: '80%', height: '80%' }} /> */}
        <img src={logimg} style={{width:"100%", height:"100%", backgroundColor:"rgba(0,0,0,.7)"}}></img>
      </div>
    </div>
  );
}
