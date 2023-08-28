import { React, useEffect, useState } from "react";
import { useForm } from "@inertiajs/inertia-react"
import { Link  } from '@inertiajs/inertia-react'
import { FiEyeOff } from 'react-icons/fi'
import { Form, Input, Checkbox, Button ,Space, Modal, Select,  Table, Divider } from 'antd';
import DashboardLayout from '@/Shared/DashboardLayout'



const Users = ({users})=>{
    const [open, setOpen] = useState(false)
    const [action_to_make, setActionToMake] = useState({
        title: 'create',
        url: '/dashboard/utilisateurs'
    })
    const [users_data, setUsersData] = useState([])
    const { data, setData,  errors, post, put } = useForm({email:'', nom: '', prenom:'',password:'', role: ''})
    const handleClick = ()=>{
         setOpen(true)
         setActionToMake({
            title: 'create',
            url: '/dashboard/utilisateurs'
         })

         setData({email:'', nom: '', prenom:'',password:'', role: ''})
    }

    const handleEdit = async (id)=>{
        let response = await fetch('/dashboard/utilisateurs/'+id+'/edit')
        let data = await response.json()

        const res = data.pop()

        setData({
            email: res.email,
            nom: res.name.split(' ')[0],
            prenom: res.name.split(' ')[1],
            role: res.role
        })

        setActionToMake({
            title: 'edit',
            url: '/dashboard/utilisateurs/'+ id 
        })

        setOpen(true)
    }

    const handleChange = (value)=>{
        setData({...data, role: value})
    }

    const handleSubmit = async ()=>{
        if(action_to_make.title!=='create' && action_to_make.title.includes('edit')){
            put(action_to_make.url, {}, data)
        }else{
            post(action_to_make.url, {}, data)
        }
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Role',
          dataIndex: 'role',
          key: 'role',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                  <button onClick={()=>handleEdit(record.id)}>Modifier</button>
                  <Link href={"/dashboard/utilisateurs/"+ record.id} method="delete" as="button">Supprimer</Link>
                </Space>
            ),
        }
    ];

    useEffect(()=>{
        setUsersData(users)
    }, [users])

    useEffect(()=>{
        if(!Object.keys(errors).length) setOpen(false);
    }, [errors])

    return (
        <DashboardLayout>
            <Modal
                title={
                    <>
                        <div className='flex space-x-8 pr-8'>
                            <div></div>
                        </div>
                    </>
                }
                centered
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <Form name="login" className="login my-8" onFinish={handleSubmit} initialValues={data}>
                    <span className='text-red-400 text-xs'>{errors && errors.nom}</span>
                    <Form.Item  className='h-8 mb-2 '>
                        <Input placeholder="Nom"  value={data.nom} className='font-poppins' onChange={(e)=>setData({...data, nom: e.target.value})} />
                    </Form.Item>

                    <span className='text-red-400 text-xs'>{errors && errors.prenom}</span>
                    <Form.Item className='h-8 mb-2 '>
                        <Input placeholder="Prenom" value={data.prenom}  className='font-poppins' onChange={(e)=>setData({...data, prenom: e.target.value})} />
                    </Form.Item>

                    <span className='text-red-400 text-xs'>{errors && errors.email}</span>
                    <Form.Item   className='h-8 mb-2 text-xs'>
                    <Input placeholder="Email" value={data.email}  className='font-poppins' onChange={(e)=>setData({...data, email: e.target.value})} />
                    </Form.Item>

                    <span className='text-red-400 text-xs'>{errors && errors.password}</span>
                    <Form.Item  className='font-poppins mb-2'>
                    <Input placeholder="Password" value={data.password} type="password" prefix={<FiEyeOff />} onChange={(e)=>setData({...data, password: e.target.value})}/>
                    </Form.Item>

                    <span className='text-red-400 text-xs'>{errors && errors.role}</span>
                    <Form.Item className="mb-2"  >
                        <Select
                            value={data.role}
                            style={{ width: '100%' }}
                            onChange={handleChange}
                            options={[
                                { value: 'admin', label: 'Administrateur' },
                                { value: 'user', label: 'Utilisateur simple' }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="bg-[#001529] users block w-full font-poppins">
                            Soumettre
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div className="flex justify-end my-4 ">
                <Button type="primary" htmlType="submit" onClick={handleClick} className="bg-[#001529] users block font-poppins">
                    Créer un utilisateur
                </Button>
            </div>
            <div>
                <Table columns={columns} dataSource={users_data} pagination={{ defaultPageSize: 5 }} />
            </div>
        </DashboardLayout>
    )
}

export default Users;