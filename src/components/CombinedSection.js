import React, { useEffect, useState } from 'react';
import '../CombinedSection.css';
import { useSpring, animated, config } from 'react-spring';
import style from './executionStyles'

function CombinedSection({ updateContent }) {
    const [showOptions, setShowOptions] = useState(false);
    const [showLicenseInfo, setShowLicenseInfo] = useState(false);
    const [executionStatus, setExecutionStatus] = useState('idle');
    const [userChoice, setUserChoice] = useState(null);
    const [tryrunChoice, setTryrunChoice] = useState(null);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    //10个水平显示的sections数据
    const sections = [
        {
            name: 'Feed Asset Set up Form information from SharePoint to WSO',
            description: 'The process of this RDA primarily encompasses retrieving corresponding Feed Asset information ' +
                'from sharePoint and Excel files. Subsequently, this information is automatically populated into ' +
                'Wall street Office.Wall Street Office is a desktop - level application of AppV.Through RDA ' +
                'automation, human resources can be redirected towards more critical tasks.',
            tryRunText: 'Try Run',
        },
        {
            name: 'FED Cash Mark Email Notification',
            description: 'The process of this RDA include generate sOD margin for all FED Cash brokers, and draft margin ' +
                'call emails/repriced amount emails to specific brokers only based on cash mark logic for that ' +
                'particular day. The project involves the integration of Outlook and Excel, as well as the ' +
                'handling of databases, ultimately saving users at least 30 minutes per day and reducing ' +
                'associated risks.',
            tryRunText: 'Try Run',
        },
        {
            name: 'Client KPI Automation',
            description: 'The process of this RDA primarily encompasses compiling a final PowerPoint report, and copying ' +
                'data from multiple Excel files and adjusting the2format based on the inserted data. To complete ' +
                'the report, the RDA automation could compile over 120 slides, copy data from 10+ files and 150+ ' +
                'tables, and adjust the format of tables and charts in PowerPoint.Through RDA automation, ' +
                'human resources can be redirected towards more critical tasks.',
            tryRunText: 'Try Run',
        },
        {
            name: 'eCFM Data Download and Extract',
            description: 'The process of this RDA primarily encompasses retrieving corresponding information from POFs ' +
                'which are downloaded from eCFM. The RDA automation could eliminate manual touch points. And ' +
                'users could release more energy to focus on more value - added activities.The risk of error or ' +
                'audit finding will be reduced. Users can use configuration files to cover multiple business ' +
                'lines. The automated tool uses the OCRPortal activity to extract information from PDFs.',
            tryRunText: 'Try Run',
        },
        {
            name: 'Custody JPSS_GTM Trade Blotter Report',
            description: 'The process of this RDA primarily encompasses downloading trade blotter file from GTM and saving ' +
                'to daily task folder, doing general review of trade blotter file,doing checking against Mch/MYSS ' +
                'data and make updates. The automated tool uses the method of invoking the OSA service instead of ' +
                'Capturing data from the MCH through UMAS.',
            tryRunText: 'Try Run',
        },
        {
            name: 'AXA Collateral Reports',
            description: 'Its for collateral team which require send daily/weekly/monthly collateral report to AXA client ' +
                'via email and the source data file is download from AXA citrix manually.This process will filter ' +
                'required data from source file based on the inventory file, change values for some fields, ' +
                'add password to protected the final report...draft mail with the report.',
            tryRunText: 'Try Run',
        },
        {
            name: 'West Lake Daily Report',
            description: 'West Lake is an online reporting application and contains APAC OKRI and Client View two ' +
                'dashboard to display manage reporting and client performance on accounting, custody, ' +
                'failed trade and other ss service.It takes hours to manually prepare raw data for West Lake ' +
                ' reports from shared folder, website, email, attachment and online box folder.',
            tryRunText: 'Try Run',
        },
        {
            name: 'HKE Price Download Upload',
            description: 'The process instead of manually completing the tasks of downloading source price from EPW, ' +
                'calculating prices, and uploading reports to EPw, through this automation, business team can ' +
                'save 30 mins every day.',
            tryRunText: 'Try Run',
        },
        {
            name: 'SP Multiple Rate Update Automation',
            description: 'Hangzhou Security Valuation team has 6 daily tasks to read from email body and attachments, ' +
                'and update rates into MCH by 86_bexr_browse.xlsm and 169_ufwd_browse_book.xlsm. The process 100% ' +
                'automate all tasks.Through RDA automation, business team can save 167 hours every year.',
            tryRunText: 'Try Run',
        },
        {
            name: 'UAT Regression Report Recon',
            description: 'This process mainly realizes the function of comparing files instead of using Compare Tool ' +
                'manually. The number of files is 2000+, so every time you use this robot, you can save at ' +
                'least 8 hours for the business team.',
            tryRunText: 'Try Run',
        },
    ];


    const handleExecutionClick = async (optionName) => {
        // const selected Value = selectedoptions [optionName];
        // Debug Code
        const selected_Value = "C:\\Users\\e654099\\Documents\\UiPath\\WSOAPP\\Main.xaml";
        console.log("selected_Value", selected_Value);
        // Set the execution status to 'executing'
        setExecutionStatus('executing');
        try {
            const response = await fetch('http://127.0.0.1:5000/execute-robot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                },
                body: JSON.stringify({ selectedValue: selected_Value }), // Send data as JSON
            });

            const data = await response.json();
            // Set the execution status based on the result
            if (data.result) {
                setExecutionStatus('success');
            } else {
                setExecutionStatus('error');
            }
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

    const getStatusColor = () => {
        switch (executionStatus) {
            case 'executing':
                return '#f2b705'; // Light yellow
            case 'success':
                return '#3dbb3d'; // Light green
            case 'error':
                return '#e74c3c'; // Light red
            default:
                return '#007bff';
        }
    };

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
                <p style={{ fontWeight: 'bold', color: 'black' }}>UiPath studio License:</p>
                <p>
                    UiPath Studio is the core development tool for creating automation workflows. A Studio License allows you to design and build automation solutions. It's like having a toolbox to create automation robots.
                </p>
                <p style={{ fontWeight: 'bold', color: 'black' }}>UiPath Studiox License:</p>
                <p>
                    UiPath StudioX is a simplified version of studio, designed for business users who want to create automation without needing deep technical skills. With a Studiox license, you can build simple automation tasks, making it easy for non-developers to automate routine work.
                </p>
                <p style={{ fontWeight: 'bold', color: 'black' }}>UiPath Attended License:</p>
                <p>
                    An Attended license is for automations that require human interaction. It allows a human worker to collaborate with a robot to complete tasks together. Imagine it as having a helpful robot assistant alongside you.
                </p>
                <p>Do You Have License Already?</p>
                <div>
                    <button style={{ marginRight: '20px' }} onClick={() => handleYesClick()}>Yes</button>
                    <button onClick={() => handleNoClick()}>No</button>
                </div>
            </div>
        )
    };

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
        config: config.slow
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => {
                if (prev < 2) return prev + 1;
                return 0;
            });
        }, 2000); // 2秒切换下一段文本
        return () => clearInterval(interval);
    }, []);

    const texts = [
        { content: 'After verification, your account is authorized to execute this process. You may click the Execution button to initial the process.', key: 'text1' },
        { content: 'Do not switch or close the page during the execution process.', key: 'text2' },
        { content: 'If there are any issues during the execution process, please contact the SEALS APAC Team', key: 'text3' },
    ]

    const ExecutionPage = () => {
        return (
            <div style={styles.container}>
                {texts.map((text, index) => (
                    <animated.div key={text.key} style={{ ...style.text, ...fadeText, display: currentTextIndex === index ? 'block' : 'none' }}>
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


    const renderLicenseInfo = () => {
        return (
            <div className='license-middle'>
                <p>
                    If users want to apply for UiPath license, firstly, you need to send the users info with Lan ID, Name, and busniess team to "APAC RDA CoE" so that we can add the users to the corresponding list.
                </p>
                <p>
                    Then you need to make sure if the users have joined the business team on GMAS. If not, they need to add access for the business team before raising a request on SailPoint.
                </p>
                <p>
                    For example, if users want to raise a request for "GMS_BTM_581", they should make sure their name is listed on the corresponding business team on GMAS (no matter owners or members).
                </p>
                <p>
                    At last, raise SailPoint requests for the below entitlements:
                </p>
                <ul>
                    <li><strong>RPA_UIP_PROD_ATTENDEDUSER</strong></li>
                    <li><strong>DaaS-VDI_Desktop_dc3gdc_prd_S_W10_UiPath_Attended_PROD</strong></li>
                    <li><strong>The correct Business Team AD Group</strong></li>
                </ul>
            </div >
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
}

export default CombinedSection;