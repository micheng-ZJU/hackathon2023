import React, { useEffect, useState, useCallback, useRef } from 'react'
import '../CombinedSection.css';
import { useSpring, animated, config } from 'react-spring';
import styles from './executionStyles'
import './CombinedSection_Alteryx.less'
import { DeleteOutlined, PlayCircleOutlined, CheckCircleFilled, CloseCircleFilled, LoadingOutlined }  from '@ant-design/icons'
import { Button, Modal, Tree, Upload } from 'antd';


function CombinedSection_Alteryx({ updateContent }) {
    const [showOptions, setShowOptions] = useState(false);
    const [showLicenseInfo, setShowLicenseInfo] = useState(false);
    const [executionStatus, setExecutionStatus] = useState('idle');
    const [userChoice, setUserChoice] = useState(null);
    const [tryrunChoice, setTryrunChoice] = useState(null);
    const [currentTextIndex, setCurrentTextIndex] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const fileList = useRef([]);
    const [showModal, setShowModal] = useState(false);
    const responseData = useRef(null);

    const { Dragger } = Upload
    // 10个水平显示的sections数据
    const sections = [
        {
            name: 'JPB Monthly SD Holding Report',
            description: 'Provide all the securities position on settlement date as of last month end on monthly basis, reduce Manual Touches: from 8 to 0',
            tryRunText: 'Try Run',
        },
        {
            name: 'FRS Currency Breakdown - FSDF',
            description: 'Two customized reports are required to be delivered to Gain/Loss and Translation Gain/Loss based on Currency level for 9 funds.Projected Free-up Manual capacity:  600 Mins, Reduce Manual Touches: from 321 to 1',
            tryRunText: 'Try Run',
        },
        {
            name: 'Customized Reporting - JPGC - Nippon Life Dividend Received Report',
            description: 'Provide tax reclaim received report on daily basis. Reduce Manual Touches: from 16 to 1',
            tryRunText: 'Try Run',
        },
        {
            name: 'Open Trade Check Automation',
            description: 'Validate and provide comments for all open trades on custody and accounting side on daily basis. Reduce Manual Touches: from 396 to 0, Free-up Manual capacity: 334 Hours',
            tryRunText: 'Try Run',
        },
        {
            name: 'JTSB Bond Interest Report',
            description: 'Bond Interest Report is a daily task by Japan GC team for JTSB client. This demand is to heIp BU automatically audit the interest and principal of Bond trade which are processed by HCL team. Free up 827 hours BU capacity annually',
            tryRunText: 'Try Run',
        },
        {
            name: 'JTSB/MTBJ Failed & Unmatched Trade',
            description: 'Provide overall real time custody failed and unmatched trade reports to client service and HK Transaction processing so that they could take proper actions accordingly. Free-up Manual capacity:344 Hours, Reduce Manual Touches: from 612 to 3',
            tryRunText: 'Try Run',
        },
        {
            name: 'JTSB Security Lending Report',
            description: 'Provide client report for daily loan transactions for stock funds. Reduce Manual Touches: from 21 to 1, Free-up Manual capacity: 167 Hours/year',
            tryRunText: 'Try Run',
        },
        {
            name: 'JTSB Contractual Settelment Check',
            description: 'To ensure both cash and share of all trades are non-contractual settlement policy. For which not apply contractual accordingly. Reduce Manual Touches: from 178 to 1, Free-up Manual capacity: 230 hours',
            tryRunText: 'Try Run',
        },
        {
            name: 'JTSB Corp Action Cash Settlement Report',
            description: 'Provide the cash line for Corp Action event to client Manual Touches: from 149 to 1',
            tryRunText: 'Try Run',
        },
        {
            name: 'Customized Reporting - JPGC - JTSB Net Amount Different check report',
            description: 'on-book currencies that have difference between contractual settlement amount and actual settlement amount. Free-up Manual capacity: 50 Hours, Reduce Manual Touches: from 181 to 1',
            tryRunText: 'Try Run',
        },
    ];

    const handleExecutionClick = async (optionName) => {
        setExecutionStatus('executing');
        // setTimeout(() => {
        //     try {
        //         setExecutionStatus('success');
        //     } catch (error) {
        //         console.error('Error executing robot:', error);
        //         setExecutionStatus('error');
        //     }
        // }, 2000)
        const fList = fileList.current;
        const formData = new FormData();
        fList.forEach(file => {
            formData.append('file', file.originFileObj);
            formData.append('name', file.name)
        })
        // Upload to server
        fetch('http://127.0.0.1:5000/readData', {
            method: 'POST',
            body: formData
        }).then(res => res.json()).then(res => {
            if (res.success === 'true') {
                setExecutionStatus('success')
                const rr = []
                for (let k in res.data) {
                    const itemList = JSON.parse(res.data[k])
                    rr.push({
                        title: k,
                        children: itemList.map(item => {
                            const cl = [];
                            for (const t in item) {
                                cl.push({
                                    title: `${t}: ${item[t]}`
                                })
                            }
                            return {
                                title: item.Fund,
                                children: cl
                            }
                        })
                    })
                }
                console.log(rr)
                responseData.current = rr
            }
        })
    };

    const handleTryRunClick = () => {
        setTryrunChoice('yes');
    };

    const handleYesClick = () => {
        setShowOptions(true);
        setShowLicenseInfo(false);
        setUserChoice("yes");
        const newContent = ExecutionPage();
        //更新内容为 option list
        updateContent(newContent);
    };

    const handleNoClick = () => {
        setShowOptions(false);
        setShowLicenseInfo(true);
        setUserChoice("no");
        const newContent = renderLicenseInfo();
        //更新内容为提示文字
        updateContent(newContent);
    };

    const onDraggerChange = (info) => {
        if (!info.file.xhr) return;
        fileList.current = info.fileList;
    }

    const renderProcessSections = () => {
        return (
            <div className="process-sections">
                {sections.map((process, index) => (
                    <div
                        key={index}
                        className="process-subsection"
                    >
                        <div className="process-name">{process.name}</div>
                        <div className="process-description">{process.description}</div>
                        <div className='process-operation'>
                            <button className="process-button" onClick={() => handleTryRunClick()}>{process.tryRunText}</button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderLicenseSections = () => {
        return (
            <div className='license-middle'>
                <p style={{ fontWeight: 'bold', color: 'black' }}>Alteryx Designer License:</p>
                <p>
                    It is tailored for individuals who require the capabilities to create, design, and prepare data workflows. With this license, user gain access to Alteryx Designer, which serves as the cor application for tasks such as data blending, transoformation and advance analytics.
                </p >
                <p>Do You Have License Already?</p >
                <div>
                    <button style={{ marginRight: '20px' }} onClick={() => handleYesClick()}>Yes</button>
                    <button onClick={() => handleNoClick()}>No</button>
                </div>
            </div>
        )
    }

    const fadeText = useSpring({
        opacity: currentTextIndex >= 0 ? 1 : 0,
        from: { opacity: 0 },
        delay: 200,
        config: config.slow
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => {
                if (prev < 2) return prev + 1;
                return 0;
            });
        }, 2000); //2秒切换下一段文本

        return () => clearInterval(interval);
    }, []);


    const texts = [
        { content: 'After verification, your account is authorized to execute this process. You may click the Execute button to initiate the process.', key: "text1" },
        { content: 'Do not switch or close the page during the execution process.', key: 'text2' },
        { content: 'If there are any issues during the execution process, please contact the SEALS APAC team', key: 'text3' },
    ]

    const ExecutionPage = () => {
        return (
            <div style={{ ...styles.container, backgroundColor: 'rgba(0,145,209,0.2)' }}>
                <div style={styles.textContainer}>
                    {texts.map((text, index) => (
                        <animated.div key={text.key} style={{ ...styles.text, ...fadeText, display: currentTextIndex === index ? 'block' : 'none' }}>
                            {text.content}
                        </animated.div>
                    ))}
                </div>
                <Dragger onChange ={onDraggerChange} multiple={true} className='dragger'>
                    <p>Drag And Drop Files Here</p>
                    <p>Or Click To Select</p>
                </Dragger>
                <OperationSection {...{executionStatus, handleExecutionClick}} />
                <div>
                    {executionStatus === 'success' ? <Button onClick={() => { setShowModal(true) }} >Check Result</Button>:null}
                </div>
                <Modal open={showModal} onOk={()=>{setShowModal(false)}} onCancel={() => {setShowModal(false)}}>
                    <Tree className='json-data' defaultExpandAll={true} treeData={responseData.current} />
                </Modal>
            </div>
        );
    };


    const renderLicenseInfo = () => {
        return (
            <div className='license-middle'>
                <p>
                    If you wish to apply for an Alteryx license, please reach out
                    to the Seals APAC team. We will guide you through the process
                    of obtaining the license and executing the Alteryx process.
                </p >
                <p>
                    Designer License:
                </p >
                <ul>
                    <li><strong>The Designer License is meant for individuals who need to create, design, and prepare data workflows</strong></li>
                    <li><strong>It provides access to Alteryx Designer, which is the core application for data blending, preparation, and advanced analytics</strong></li>
                    <li><strong>Users can create and run workflows with this license</strong></li>
                </ul>
            </div>);
    };

    return (
        <div className="combined-section">
            {tryrunChoice === null && renderProcessSections()}
            {(userChoice === null && tryrunChoice != null) && renderLicenseSections()}
            {showOptions && ExecutionPage()}
            {showLicenseInfo && renderLicenseInfo()}
        </div>
    );
}
export default CombinedSection_Alteryx;
export const OperationSection = (props) => {
    const { handleExecutionClick, executionStatus } = props
    return (
        <div className='operation-zone'>
            <Button 
                size='large'
                type="primary" 
                disabled={executionStatus==='executing'} 
                icon={executionStatus === 'executing'? <LoadingOutlined />:<PlayCircleOutlined />} 
                onClick={handleExecutionClick}
            >{executionStatus === 'executing'? 'Running' : 'Execute'}</Button>
            <p>
                {executionStatus === 'success'? <CheckCircleFilled className='check-icon' />:executionStatus === 'error'?<CloseCircleFilled className='close-icon' />:null}
                {executionStatus === 'success'? 'Success!': executionStatus === 'error' ? 'Failed!':''}</p>
        </div>
    )
}