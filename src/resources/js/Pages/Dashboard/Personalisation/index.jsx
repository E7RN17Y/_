import { React, useEffect, useState } from "react";
import { useForm } from "@inertiajs/inertia-react"
import { Link  } from '@inertiajs/inertia-react'
import { FiEyeOff } from 'react-icons/fi'
import { Form, Input, Checkbox, Button ,Space, Modal, Select,  Table, Divider } from 'antd';
import DashboardLayout from '@/Shared/DashboardLayout'



const Personalisation = ({types})=>{
    const [open, setOpen] = useState(false)
    const [action_to_make, setActionToMake] = useState({
        title: 'create',
        url: '/dashboard/personalisation'
    })
    const [types_data, setTypesData] = useState([])
    const { data, setData,  errors, post, put } = useForm({type:'', category: ''})
    const handleClick = ()=>{
         setOpen(true)
         setActionToMake({
            title: 'create',
            url: '/dashboard/personalisation'
         })

         setData({type:''})
    }

    const handleEdit = async (id)=>{
        let response = await fetch('/dashboard/personalisation/'+id+'/edit')
        let data = await response.json()

        const res = data.pop()

        setData({
            type: res.type,
            category: res.category
        })

        setActionToMake({
            title: 'edit',
            url: '/dashboard/personalisation/'+ id 
        })

        setOpen(true)
    }

    const handleChange = (value)=>{
        setData({...data, category: value})
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
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                  <button onClick={()=>handleEdit(record.id)}>Modifier</button>
                  <Link href={"/dashboard/personalisation/"+ record.id} method="delete" as="button">Supprimer</Link>
                </Space>
            ),
        }
    ];

    useEffect(()=>{
        setTypesData(types)
    }, [types])

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
                    <span className='text-red-400 text-xs'>{errors && errors.type}</span>
                    <Form.Item   className='h-8 mb-2 text-xs'>
                    <Input placeholder="Type" value={data.type}  className='font-poppins' onChange={(e)=>setData({...data, type: e.target.value})} />
                    </Form.Item>

                    <span className='text-red-400 text-xs'>{errors && errors.category}</span>
                    <Form.Item className="mb-2"  >
                        <Select
                            value={data.category}
                            style={{ width: '100%' }}
                            onChange={handleChange}
                            options={[
                                { value: 'scan', label: 'Scan' },
                                { value: 'not-scan', label: 'Non Scan' }
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
                    Ajouter un type
                </Button>
            </div>
            <div>
                <Table columns={columns} dataSource={types_data} pagination={{ defaultPageSize: 5 }} />
            </div>
        </DashboardLayout>
    )
}

export default Personalisation;