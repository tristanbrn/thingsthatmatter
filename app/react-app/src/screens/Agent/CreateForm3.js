import React, {useState, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import { Layout, Steps, Button, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import {Redirect} from 'react-router-dom';
import {DeleteOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';

const { Step } = Steps;
const {Content} = Layout;
const { Dragger } = Upload;

function CreateFormThree(props) {

    const [currentPage, setCurrentPage] = useState(0)
    const [redir, setRedir] = useState(false)
    const [backRedir, setBackRedir] = useState(false)

    const[fileList, setFileList] = useState([])

    useEffect(() => {
        setCurrentPage(props.step)     // Gets current page number from redux sotre for steps display
        if(props.formData.files) {
            setFileList(props.formData.files)
        }
      },[]);

    const handleClick = () => {
            props.saveFormData(fileList)
            props.nextStep();
            setRedir(true)    
    }

    if(redir === true) {
        return <Redirect to="/createform/step4"/> // Triggered by button-validate handleClick
    }
    if(backRedir === true) {
        return <Redirect to="/createform/step2"/> // Triggered by button-back handleClick
    }

    console.log(fileList)
    return (

        <Layout>

            <Sidebar/>

            <Layout className='main-content'>

                <Content style={{ margin: '24px 16px 0' }}>

                    <Steps progressDot current={currentPage}>
                            <Step title="Localisation" />
                            <Step title="Description" />
                            <Step title="Documents" />
                            <Step title="Prix/honnoraires" />
                            <Step title="Plateformes" />
                            <Step title="Créneaux" />
                            <Step title="Récap" />
                    </Steps>

                    <div style={{width : "60%", marginLeft: 25, marginTop: "2%"}}>

                        <form>

                            <p className='formLabel'>Documents (10 max)</p>
                            <Dragger
                            name= 'file'
                            accept= ".png,.jpeg,.pdf"
                            multiple= {true}
                            showUploadList= {false}
                            action='/pro/upload'
                            method='post'
                            data={{token : props.formData.adID}}
                            onChange={(info) => {
                                const { status } = info.file;
                                if (status !== 'uploading') {
                                console.log(info.file);
                                if(fileList.findIndex((e) => e.name === info.file.name) === -1){
                                    setFileList([...fileList, info.file])
                                }
                                
                                }
                                if (status === 'done') {
                                message.success(`${info.file.name} file uploaded successfully.`);
                                } else if (status === 'error') {
                                message.error(`${info.file.name} file upload failed.`);
                            }}}
                            >
                                <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                band files
                                </p>
                            </Dragger>
                            {fileList.map((e, i) => (
                            <div>{e.name} <DeleteOutlined 
                            onClick={async () => {
                                setFileList(fileList.filter((f) =>  f.name !== e.name ))
                                await fetch(`/pro/upload/${props.formData.adID}-${e.name}`, {
                                    method: "delete"
                                })
                            }}
                            />
                            </div>)
                            )}
  
                        </form>

                        <Button type="primary" className="button-back"
                        onClick={() => {
                            setBackRedir(true)
                            props.previousStep()
                        }}
                        >
                        Précédent</Button> 

                        <Button type="primary" className="button-validate" onClick={() => handleClick()}>Suivant</Button>
                    </div>
              
                
                
                   
                </Content>  

         </Layout>
            
    
    </Layout>

    );
  }

  function mapStateToProps(state) {
    return { step : state.step, formData : state.formData }
  }

    function mapDispatchToProps(dispatch) {
    return {
        nextStep : function() { 
            dispatch( {type: 'nextStep'} ) 
        },
        previousStep : function() {
            dispatch( {type: 'prevStep'} )
        },
        saveFormData : function(fileList) { 
        dispatch( {
            type: 'saveFormData',
            files : fileList
        } ) 
    }

    }
    }
    
  export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(CreateFormThree);
