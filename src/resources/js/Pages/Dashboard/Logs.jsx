import React from 'react'
import DashboardLayout from '@/Shared/DashboardLayout';
import { Table, Divider} from 'antd'

const Logs = ({logs}) => {
    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
        },
        {
          title: 'Message',
          dataIndex: 'message',
          key: 'message',
        },
        {
          title: 'Utilisateur',
          dataIndex: 'user',
          key: 'user',
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        }
    ];

      
      const data = logs.map(el=>({id: el.id,date:el.logged_at,message: el.message, type:el.level_name,user: JSON.parse(el.context).username}))
    console.log({logs})

  return (
    <DashboardLayout>
        <div className="my-4">
            <Table columns={columns} dataSource={data} pagination={{ defaultPageSize: 5 }} />
        </div>
    </DashboardLayout>
  )
}


export default Logs;
