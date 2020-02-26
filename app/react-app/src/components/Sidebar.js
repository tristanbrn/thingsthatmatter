import React from 'react';
import {Link} from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';

const { Header, Content, Footer, Sider } = Layout;


function Sidebar() {
  return (
    
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        className="sidebar"
      >
        <div className="logo">
          <img width="100%" src='logo.jpg'/>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>

          <Menu.Item key="1">
            <Icon type="home" />
            <span className="nav-text">Biens</span>
          </Menu.Item>

          <Menu.Item key="2">
            <Icon type="euro" />
            <span className="nav-text">Offres</span>
          </Menu.Item>

          <Menu.Item key="3">
            <Icon type="calendar" />
            <span className="nav-text">Rendez-vous</span>
          </Menu.Item>

          <Menu.Item key="4">
            <Icon type="mail" />
            <span className="nav-text">Messages</span>
          </Menu.Item>

        </Menu>
      </Sider>
    

  );
}

export default Sidebar;
