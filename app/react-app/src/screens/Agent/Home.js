import React, {useState} from 'react';
import { Layout, Icon, Row, Button } from 'antd';
import {Redirect} from 'react-router-dom';

import Sidebar from '../../components/Sidebar';
import AdCard from '../../components/AdCard';


const { Header, Content, Footer, Sider } = Layout;




function Home() {

  const [redir, setRedir] = useState(false)

  if(redir === true) {
    return <Redirect to="/createform/step1"/>
  }

  return (
    
    <Layout>

        <Sidebar/>

        <Layout className='main-content'>

            <Content style={{ margin: '24px 16px 0' }}>

              <h1 className='pageTitle'>Mes biens</h1>
              <Button onClick={() => setRedir(true)} type="primary" ghost style={buttonAdd}>Ajouter un bien<Icon type="plus-circle" /></Button>


                <Row gutter={16}>
                    <AdCard/><AdCard/><AdCard/><AdCard/>
                </Row>

            </Content>
        </Layout>
    
    </Layout>

  );
}



const buttonAdd = {
  marginTop : "1em",
  marginBottom : "1em",
  color: "#052040",
  fontWeight: 600,
  borderColor: "#052040",
  borderWidth : 2,

}

export default Home;
