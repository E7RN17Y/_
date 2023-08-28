import React, { useState } from 'react'
import { Breadcrumb, Layout, Menu, theme, Avatar, Dropdown, Space } from 'antd';
import { AiOutlineDashboard, AiOutlinePieChart, AiOutlineCalendar, AiOutlineSetting, AiOutlineUser, AiOutlineSearch } from 'react-icons/ai'
import { VscArchive } from 'react-icons/vsc'
import { usePage, InertiaLink  } from '@inertiajs/inertia-react';
// import { Link } from '@inertiajs/react';

const DashboardLayout = ({ children }) => {

  const { Header, Content, Footer, Sider } = Layout

  const { auth } = usePage().props;

  // console.log({auth})

  const  [nom, prenom] = auth !=null ? auth.user.username.split(' '): []

  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  function getItem(label, key, icon, children) {
    console.log({label})
    return {
      key,
      icon,
      children,
      label,
    };
  }

  const genAvatarText = ()=> nom[0] + ' ' + prenom[0];

  const side_items = [
    {
        label: (
            <InertiaLink href='/dashboard'>Tableau de bord</InertiaLink>
        ),
        icon: <AiOutlineDashboard size={20} />,
        key: 'dashboard'
    },
    auth.user.role == 'admin' && {
        label: (
            <InertiaLink replace href='/dashboard/utilisateurs'>Gestion des utilisateurs</InertiaLink>
        ),
        icon: <AiOutlineUser size={20} />,
        key: 'users'
    },
    auth.user.role == 'admin' && {
      label: (
          <InertiaLink  href='/dashboard/rechercher'>Recherche</InertiaLink>
      ),
      icon: <AiOutlineSearch size={20} />,
      key: 'recherche'
  },
    auth.user.role == 'admin' && {
      label: (
          <InertiaLink  href='/dashboard/personalisation'>Personalisation</InertiaLink>
      ),
      icon: <AiOutlineSetting size={20} />,
      key: 'personalisation'
  },
    auth.user.role == 'admin' && {
      label: (
          <InertiaLink replace href='/dashboard/logs'>Logs</InertiaLink>
      ),
      icon: <VscArchive size={20} />,
      key: 'logs'
    }
  ];

  const items = [
    {
      key: '1',
      label: (
        <InertiaLink href='/logout' method="post" as="button" type="button">
          Deconnexion
        </InertiaLink>
      ),
    }
  ];

  return (
    <div className='dashboard-layout'>
        <Layout
            style={{
                minHeight: '100vh',
            }}
            >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} width={250}>
                <div className="demo-logo-vertical my-4 flex justify-center items-center text-white font-semibold" style={{height: '3rem', fontSize: '1.5rem'}} >ODJU</div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={side_items} />
            </Sider>
            <Layout>
                <Header

                    style={{
                        background: colorBgContainer,
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0 2rem'
                    }}
                >
                    <div className='flex-1'>

                    </div>
                    <div>
                        <Dropdown menu={{items,}} trigger={['click']} placement='bottom'>
                            { nom && prenom ? (<div style={{cursor: 'pointer'}}>{nom + ' ' + prenom}</div>): <>{JSON.stringify(auth)}</> }
                        </Dropdown>
                    </div>
                </Header>
                <Content
                style={{
                    margin: '0 16px',
                }}
                >
                    {children}
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Copyright ©2023
                </Footer>
            </Layout>
        </Layout>
    </div>
  )
}

export default DashboardLayout
