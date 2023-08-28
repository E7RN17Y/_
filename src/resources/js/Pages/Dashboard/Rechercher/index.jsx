import { React, useEffect, useState } from "react";
import axios from "axios"
import { useForm } from "@inertiajs/inertia-react"
import { Link  } from '@inertiajs/inertia-react'
import { FiEyeOff } from 'react-icons/fi'
import { Form, Input, Checkbox, Button ,Space, Modal, Select,  Table, Divider } from 'antd';
import { FaList, FaRegFolder, FaRegFolderOpen, FaFileAlt } from "react-icons/fa";
import { AiOutlineSearch } from 'react-icons/ai'
import DashboardLayout from '@/Shared/DashboardLayout'
import Neutrino from '@/Shared/Neutrino'



const Rechercher = ({neutrino_result, blocklist_result})=>{  
    const [folder_data, set_folder_data]= useState([])
    const { data, setData,  errors, post } = useForm({
        ip:'',
        service_name:'shadowserver',
        date: new Date().toISOString().split('T')[0]
    })
    

    const [show_date, set_show_date] = useState(true)

    const asnlists = [
        {
            key: ["AS28683", "AS328228"],
            value: "SBIN"
        },
        {
            key: ["AS37090"],
            value: "ISOCEL"
        },
        {
            key: ["AS37292"],
            value: "OTI Telecom"
        },{
            key: ["AS328092"],
            value: "SUD  TELECOM SOLUTIONS"
        },
        {
            key: ["AS37424"],
            value: "SPACETEL BENIN"
        },
        {
            key: ["AS37136"],
            value: "ETISALAT BENIN"
        },
        {
            key: ["AS328098"],
            value: "JENY SAS"
        }
    ]

    const [shadowserverdata, set_shadowserverdata] = useState([])

    const options = [
        {
            name: "Shadow Server",
            value: "shadowserver"
        },
        {
            name: "Neutrino API",
            value: "neutrino"
        },
        // {
        //     name: "IP Quality Score",
        //     value: "ipqualityscore"
        // },
    ]

    const columns = [
        {
            title: 'ip',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
            title: 'hostname',
            dataIndex: 'hostname',
            key: 'hostname',
            render: (_, record) => (
                <div className="flex flex-col">
                  {_ ? _ : 'Aucune info'}
                </div>
              ),
        },
        {
            title: 'region',
            dataIndex: 'region',
            key: 'region',
            render: (_, record) => (
                <div className="flex flex-col">
                  {_ ? _ : 'Aucune info'}
                </div>
              ),
        },
        {
            title: 'tag',
            dataIndex: 'tag',
            key: 'tag',
            render: (_, record) => (
                <div className="flex flex-col">
                  {_ ? _ : 'Aucune info'}
                </div>
              ),
        },
        {
            title: 'sector',
            dataIndex: 'sector',
            key: 'sector',
            render: (_, record) => (
                <div className="flex flex-col">
                  {_ ? _ : 'Aucune info'}
                </div>
              ),
        },
        {
          title: 'asn',
          dataIndex: 'asn',
          key: 'asn_name',
          render: (_, record) => {
            const asnrealname = asnlists.filter(el=>el.key.includes('AS'+_))
            return (
                <div className="flex flex-col">
                    {_ ? asnrealname.length!=0 ? asnrealname[0].value: 'AS'+_: 'Aucune info' }
                </div>
            )
          }
        },
        {
            title: 'type',
            dataIndex: 'type',
            key: 'type',
            render: (_, record) => (
                <div className="flex flex-col">
                  blocklist
                </div>
              ),
        },
        {
            title: 'source',
            dataIndex: 'source',
            key: 'source',
            render: (_, record) => (
                <div className="flex flex-col">
                  {_ ? _ : 'Aucune info'}
                </div>
              ),
        },
        {
            title: 'reason',
            dataIndex: 'reason',
            key: 'reason',
            render: (_, record) => (
                <div className="flex flex-col">
                  {_ ? _ : 'Aucune info'}
                </div>
              ),
        },
    ];
    const columns_neutrino = [
        {
            title: 'ip',
            dataIndex: 'ip',
            key: 'ip',
        },
        {
          title: 'Reasons',
          dataIndex: 'blocklists',
          key: 'blocklist',
          render: (_, record) => (
            <div className="flex flex-col">
              {
                _.length!=0?
                _.map($=>{
                    return (
                        <div className='ml-2'>
                           <div>{$}</div> 
                        </div>
                    )
                }): 'Aucune info'
              }
            </div>
          ),
        },
        {
            title: 'Description',
            dataIndex: 'sensors',
            key: 'sensors',
            render: (_, record) => (
                <div className="flex flex-col">
                    {
                        _.length!=0?_.map($=>{
                            return (
                                <div className='ml-2'>
                                    <div>{$.description}</div> 
                                </div>
                            )
                        }):'Aucune info'
                    }
                </div>
            ),
        }
    ];

    const handleSubmit = async (e)=>{
        try {
            if(data.service_name === 'neutrino'){
                post('/get-ip-blocklist-infos', data)
            }else if(data.service_name === 'shadowserver'){
                try {
                    post('/get-ip-blocklist-infos',data)
                } catch (error) {
                    console.log({errors})
                }
            }
        } catch (error) {
            console.log({error})
        }
    }

    const handleChange = async (e)=>{
        if(e.target.value === "neutrino"){ set_show_date(false)}
        else{
            set_show_date(true)
        }
        setData({...data,service_name:e.target.value})
    }

    useEffect(()=>{

        if(neutrino_result.info){
            const folder = [{
                blocklists: neutrino_result.info['blocklists'],
                sensors:neutrino_result.info['sensors'],
                ip:neutrino_result.info['ip']
            }]
            set_folder_data(folder)
        }
    }, [neutrino_result])

    useEffect(()=>{

        if(blocklist_result.info){
            console.log({blocklist_result})
            if(blocklist_result.info.length){
                set_shadowserverdata(blocklist_result.info)
            }else{
                const datas = [
                    {
                        ip: data.ip,
                        hostname: '',
                        tag: '',
                        city: '',
                        region: '',
                        sector: '',
                        asn_name: '',
                        source:'',
                        reason: ''
                    }
                ]
                set_shadowserverdata(datas)
            }
        }
    }, [blocklist_result])

    const FolderIcon = ({ isOpen }) =>
    isOpen ? (
        <FaRegFolderOpen color="e8a87c" className="icon" />
    ) : (
        <FaRegFolder color="e8a87c" className="icon" />
    );



    return (
        <DashboardLayout>
            <h1 className="text-2xl text-center my-4 hidden">Rechercher une info par rapport a une IP</h1>
            <div className='flex justify-end my-2'>
                {
                    show_date &&  ( <input type="date"  defaultValue={data.date} onChange={e=>setData({...data, date: e.target.value})} className="bg-gray-200/[.8] h-[2.4rem] ml-2" />)
                } 
            </div>
            <Form name="login" className="login" onFinish={handleSubmit} initialValues={data}>
                    <Form.Item className='h-8 my-2 ' rules={
                    [
                        {
                            required: true,
                            message: 'Champ search requis !.'
                        }
                    ]
                    }>
                        <div className="flex items-center space-x-4">
                            <Input placeholder="Ex:XXX.XXX.XXX.XXX" value={data.ip} prefix={<AiOutlineSearch />} className='font-poppins' onChange={(e)=>setData('ip', e.target.value)} />
                            <select onChange={handleChange} className='p-[.3rem] ml-2'>
                                {
                                    options.map((el, i)=>(
                                        <option value={el.value} key={i}>{el.name}</option>
                                    ))
                                }
                            </select>
                            <Button  htmlType="submit" className="bg-[#001529] block text-white font-poppins outline-none ">
                                    Rechercher
                            </Button>
                        </div>
                    </Form.Item>
            </Form>

            {
                (()=>{
                    if(Object.keys(errors).length){
                        return <span className='text-red-400'>{errors.api_error? errors.api_error: errors.ip_format_incorrect}</span>
                    }else{
                        if(data.service_name === "neutrino"){
                            // return folder_data!=null && result.info!=null ? (
                               return ( 
                                    <div>
                                        <Table columns={columns_neutrino} dataSource={folder_data} pagination={{ defaultPageSize: 5 }} />
                                        {/* {JSON.stringify(result.info, null, 2)}
                                        {
                                            folder_data.children.map((_,i)=>{
                                                return (
                                                    <Neutrino data={_} />
                                                )
                                            })
                                        } */}
                                    </div>
                                )
                            // ): ''
                        }else if(data.service_name === 'shadowserver'){
                            return (<Table columns={columns} dataSource={shadowserverdata} pagination={{ defaultPageSize: 5 }} />)
                        }
                    }
                })()
            }

        </DashboardLayout>
    )
}

export default Rechercher;