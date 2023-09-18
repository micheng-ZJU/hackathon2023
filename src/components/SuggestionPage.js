import React, { useEffect, useState } from 'react';
import '../CombinedSection.css';
import { useSpring, animated, config } from 'react-spring';


const SuggestionPage = (props) => {
    const { text } = props;
    const [data, setData] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [showLicenseInfo, setShowLicenseInfo] = useState(false);
    const [executionStatus, setExecutionStatus] = useState('idle');
    const [userChoice, setUserChoice] = useState(null);
    const [tryrunChoice, setTryrunChoice] = useState(null)
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    useEffect(() => {
        //发送请求到 get＿data
        fetch(`http://127.0.0.1:5000/suggest-solution?text=${text}`)
            .then(response => response.json())
            .then(data => {
                // 更新数据状态
                setData(data);
            })
            .catch(error => { console.error('Error:', error) });
    }, [text]);


    const handleExecutionClick = async (optionName) => {
        // const selected_Value = selectedoptions [optionName];
        // Debug Code
        // Set the execution status to 'executing'
        setExecutionStatus('executing');
        try {
            setExecutionStatus('success');
        } catch (error) {
            console.error('Error executing robot:', error);
            setExecutionStatus('error');
        }
    };


    const handleTryRunClick = () => {
        setTryrunChoice('yes');
    };

    const handleYesClick = () => {
        setShowOptions(true);
        setShowLicenseInfo(false);
        setUserChoice("yes");
        const newContent = ExecutionPage();
        // 更新内容为 option list
        updateContent(newContent);
    };

    const handleNoClick = () => {
        setShowOptions(false);
        setShowLicenseInfo(true);
        setUserChoice("no");
        const newContent = renderLicenseInfo();
        // 更新内容为提示文字
        updateContent(newContent);
    };

    const renderProcessSections = () => {
        return (
            <div className="process-sections">
                {data.map((process, index) => (
                    <div
                        key={index} className="process-subsection"
                    >
                        <div className="process-name">{process.name}</div>
                        <div className='process-operation'>
                            <button className="process-button" onClick={() => handleTryRunClick()}>Try Run</button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };


    const renderLicenseSections = () => {
        return (
            <div>
                <p style={{ fontWeight: 'bold', color: 'black' }}>UiPath Studio License:</p>
                <p>
                    UiPath Studio is the core development tool for creating automation solutions. It's like having a toolbox to create automation robots.
                </p >
                <p style={{ fontWeight: 'bold', color: 'black' }}>UiPath StudioX License :</p >
                <p>
                    UiPath StudioX is a simplified version of Studio, designed for business skills. With a StudioX license, you can build simple automation tasks,making it easy for non-developers to automate routine work.
                </p >
                <p style={{ fontWeight: 'bold', color: 'black' }}>UiPath Attended License:</p >
                <p>
                    An Attended license is for automations that require human interaction.
                    It allows a human worker to collaborate with a robot to complete tasks
                    together. Imagine it as having a helpful robot assistant alongside you.
                </p >
                <p>Do You Have License Already?</p >
                <button onClick={() => handleYesClick()}>Yes</button>
                <button onClick={() => handleNoClick()}>No</button>
            </div>
        )
    }

    const renderButtonContent = () => {
        switch (executionStatus) {
            case 'idle':
                return 'Execute';
            case 'execution':
                return 'Executing...';
            case 'success':
                return 'Execution successful!';
            case 'error':
                return 'Error executing task.';
            default:
                return 'Execute';
        }
    };


    const fadeText = useSpring({
        opacity: currentTextIndex >= 0 ? 1 : 0,
        from: { opacity: 0 },
        delay: 200,
        config: config.s1ow
    });
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => {
                if (prev < 2) return prev + 1;
                return 0;
            });
        }, 2000);//2秒切换下一段文本

        return () => clearInterval(interval);
    }, []);


    const texts = [
        { content: 'After verifcation, your acount is authorized to execute this process. You may click the Execute button to initiate the process.', key: 'text1' },
        { content: 'Do not switch or close the page during the execution process.', key: 'text2' },
        { content: 'If there are any issues during the execution process, please contact the SEALS APAC Team.', key: 'text3' },
    ]

    const ExecutionPage = () => {
        return (
            <div style={styles.container}>
                {texts.map((text, index) => (
                    <animated.div key={text.key} style={{ ...styles.text, ...fadeText, display: currentTextIndex === index ? 'block' : 'none' }}>
                        {text.content}
                    </animated.div>
                ))}
                <br />
                <br />
                <br />
                <br />
                <br />
                <button style={{ ...styles.button, ...styles[executionStatus] }} onClick={handleExecutionClick}>
                    {renderButtonContent()}
                </button>
            </div>
        );
    };

    const styles = {
        container: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)'
        },
        button: {
            padding: '15px 30px',
            marginBottom: '20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            color: '#000',
            fontSize: '18px'
        }, idle: {
            backgroundColor: 'rgba(255, 255, 255,0.8)',
        },
        execution: {
            backgroundColor: 'orange',
        },
        success: {
            backgroundColor: 'lightgreen',
        },
        error: {
            backgroundColor: 'pink',
        },
        text: {
            fontSize: '18px',
            color: '#000',
            fontFamily: 'Calibri, sans-serif'
        }
    };

    const renderLicenseInfo = () => {
        return (
            <div>
                <p>
                    If users want to apply for UiPath license, firstly, you need to send the user's info with Lan ID, and business team to "APAC RD CoE" so that we can add the users to the corresponding list.
                </p>
                <p>
                    Then you need to make sure if the users have joined the business team on GMAS. If not, they need to add access for the business team before raising a request on Sailpoint.
                </p>
                <p>
                    For example, if users want to raise a request for "GMS_BTM_581", they
                    should make sure their name is listed on the corresponding business team
                    on GMAS (no matter owners or members).
                </p>
                <p>
                    At last, raise SailPoint requests for the below entitlements:
                </p>
                <ul>
                    <li><strong>RPA_UIP_PROD_ATTENDEDUSER</strong></li>
                    <li><strong>DaaS-VDI_Desktop_dc3gdc_prd_S_W10_UiPath_Attended_PROD</strong></li>
                    <li><strong>The correct Business Team AD Group</strong></li>
                </ul>
            </div>
        );
    };


    return (
        <div className="combined-section">
            {tryrunChoice === null && renderProcessSections()}
            {(userChoice === null && tryrunChoice != null) && renderLicenseSections()}
            {showOptions && ExecutionPage()}
            {showLicenseInfo && renderLicenseInfo()}
        </div>
    );
};


export default SuggestionPage;