import React, { useEffect, useState } from 'react';
import '../CombinedSection.css';
import { useSpring, animated, config } from 'react-spring';
import styles from './executionStyles'
import { OperationSection } from './CombinedSection_Alteryx';

function CombinedSection_Python({ updateContent }) {
    const [showOptions, setShowOptions] = useState(false);
    const [showLicenseInfo, setShowLicenseInfo] = useState(false);
    const [executionStatus, setExecutionStatus] = useState('idle');
    const [userChoice, setUserChoice] = useState(null);
    const [tryrunChoice, setTryrunChoice] = useState(null);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    //10个水平显示的sections数据
    const sections = [
        {
            name: 'Weekly Unpriced Stale Report',
            description: 'The automation processes the medium-sized dataset and automate the comments for exceptions to ' +
                'eliminate the manual work. It has optimized data processing, leading to faster insights, ' +
                'improved accuracy. This achievement demonstrates the power of python automation.',
            tryRunText: 'Try Run',
        },
        {
            name: 'Failed Trade Report',
            description: 'The automation assists on failed trade checking and notification. It generates 100+ notification ' +
                'reports every month to let operation team focus on value-added work.',
            tryRunText: 'Try Run',
        },
        {
            name: 'CA Calculation Template',
            description: 'The automation captures 14 Corporate Event to execute validation. It takes 10 seconds for each ' +
                'event against 15 minutes for each event manually.',
            tryRunText: 'Try Run',
        },
        {
            name: 'Income Repatriation Transaction Report',
            description: 'This is a bespoke report required by client. The automation comments the exception based on ' +
                'business rule line by line. It allows the client service team focus on the audit process.',
            tryRunText: 'Try Run',
        },
        {
            name: 'Broker Statement Reconciliation',
            description: 'This automation extracts transaction data from broker statement and reconciliate against that ' +
                'from client perspective.',
            tryRunText: 'Try Run',
        },
        {
            name: 'Client Health Check',
            description: 'This automation checks various indicators to validate the healthy status for client. It is able' +
                'to onboarding new client with the configuration and provides the whole picture for each client.',
            tryRunText: 'Try Run',
        },
    ];

    const handleExecutionClick = async (optionName) => {
        // const selected_Value = selectedOptions [optionName];
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

    const getstatusColor = () => {
        switch (executionStatus) {
            case 'executing':
                return '#f2b705'; // Light yellow
            case 'success':
                return '#3dbb3d'; // Light green
            case 'error':
                return '#e74c3c'; // Light red
            default:
                return '#007bff';
        };
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
                <p style={{ fontWeight: 'bold', color: 'black' }}>Python Developer Role:</p>
                <p>
                    If you wish to execute a Python application, you will need to have the "Python Developer" role on the GMAS portal.
                </p>
                <></>
                <p>Do You Have The Role Already?</p>
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
            <div style={{ ...styles.container, backgroundColor: 'rgba(255, 222, 86, 0.7)' }}>
                <div style={styles.textContainer}>
                    {texts.map((text, index) => (
                        <animated.div key={text.key} style={{ ...styles.text, ...fadeText, display: currentTextIndex === index ? 'block' : 'none' }}>
                            {text.content}
                        </animated.div>
                    ))}
                </div>
                {/* <button style={{ ...styles.button, ...styles[executionStatus] }} onClick={handleExecutionClick}>
                    {renderButtonContent()}
                </button> */}
                <OperationSection handleExecutionClick={handleExecutionClick} executionStatus={executionStatus} />
            </div>
        );
    };

    const renderLicenseInfo = () => {
        return (
            <div className='license-middle'>
                <p>

                    Getting Python Developer role on GMAS portal requires you to be a member of any Development Team. You can request Development Team membership on SailPoint portal by following guide below.
                </p>
                <a href="">GMAS Access Management Guide</a>
                <p>

                    After completing steps listed in the previous section you will be albe to request Python Developer role. In order to acquire it you need to:
                </p>
                <ul>
                    <li><strong>Navigate to SailPoint access request page.</strong></li>
                    <li><strong>On "Select User" page select your account and click Next.</strong></li>
                    <li><strong>In the next "Mange Access" section, enter "GMAS Python Dedveloper" into search bar and select the group using [✓] button next to the group name.</strong></li>
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
};

export default CombinedSection_Python;
