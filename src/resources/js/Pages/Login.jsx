import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { Form, Input, Checkbox, Button ,DatePicker, message } from 'antd';
import { BiUser } from 'react-icons/bi'
import { FiEyeOff } from 'react-icons/fi'

const Login = () => {

  const [messageApi, contextHolder] = message.useMessage()

  const { data, setData,  errors, post } = useForm({
    email:'',
    password: ''
  })

  const handleSubmit = async ()=>{
        post('/login', {}, data)
  }

  useEffect(()=>{
    if(errors && errors.authentication_error){
        messageApi.open({
            type: 'error',
            content: errors.authentication_error
        })
    }
  },[errors])

  return (
      <React.Fragment>
        {contextHolder}
        <div className="flex h-screen flex-col justify-center items-center font-poppins" style={{backgroundColor: '#001529'}}>
            <h1 className='font-gupter font-semibold mb-4 text-4xl text-white'>ODJU</h1>
            <div className='login-form w-1/4'>

                <Form name="login" className="login" onFinish={handleSubmit} initialValues={{
                    remember: true
                }}>
                    <Form.Item name="email"  className='h-8' rules={
                    [
                        {
                            required: true,
                            message: 'Champ email requis !.'
                        }
                    ]
                    }>
                    <Input placeholder="Email" value={data.email} prefix={<BiUser />} className='font-poppins' onChange={(e)=>setData('email', e.target.value)} />
                    </Form.Item>
                    <span className='text-red-400'>{errors && errors.email}</span>

                    <Form.Item name="password" className='font-poppins my-3' rules={
                    [
                        {
                        required: true,
                        message: 'Champ password requis !.',
                        style: 'color'
                        }
                    ]
                    }>
                    <Input placeholder="Password" value={data.password} type="password" prefix={<FiEyeOff />} onChange={(e)=>setData('password', e.target.value)}/>
                    </Form.Item>
                    <span className='text-red-400'>{errors && errors.password}</span>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox className='font-poppins text-white'>Remember me</Checkbox>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="bg-blue-400 block w-full font-poppins">
                            Se connecter
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
      </React.Fragment>
  );
};


export default Login;
