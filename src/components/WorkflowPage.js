import { useEffect, useState } from 'react'
import { Button, Icon, Spin, Steps, Upload, Modal, Row, Col, Input } from 'antd'
import { LoadingOutlined, UserOutlined, FileAddOutlined, RobotOutlined, CheckCircleOutlined, BarChartOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { Line, HistogramConfig, Pie, PieConfig, Histogram } from '@ant-design/plots'
import './WorkflowPage.less'


const workflowSequence = ['RDA', 'Alteryx', 'Python']


const commonStepItems = [
    {
        key: 0,
        title: 'Upload Input File',
        description: (<div>
            <p>
                Please select a file as input.
            </p>
            <div style={{ height: "60px", flexDirection: 'row' }}>
                <Upload name='file' className='upload'><Button>Upload File</Button></Upload>

            </div>
        </div>),
        icon: <FileAddOutlined />
    },
    {
        key: 1,
        title: 'Authentication',
        description: 'Please logon to the sytem with your credentials',
        icon: (<UserOutlined />)
    },
    {
        key: 2,
        title: 'Process',
        description: 'The automation is running',
        icon: (<RobotOutlined />)
    },
]

const resultData = [
    {
        "FUND": "SGF2",
        "LOC": "CN",
        "TRADE ID": "IBNBBHKX",
        "SETTLE ACCT ID": "SPEC",
        "CORY TYPE": "FI",
        "STATUS": "PAI"
    },
    {
        "FUND": "SGF2",
        "LOC": "CN",
        "TRADE ID": "IBNBBHKX",
        "SETTLE ACCT ID": "SPEC",
        "CORY TYPE": "CORP",
        "STATUS": "PAI"
    },
    {
        "FUND": "SGF3",
        "LOC": "NZ",
        "TRADE ID": "SIAODDKD",
        "SETTLE ACCT ID": "LOAN",
        "CORY TYPE": "FI",
        "STATUS": "PAI"
    },
    {
        "FUND": "SGF3",
        "LOC": "AUS",
        "TRADE ID": "SIAODDKD",
        "SETTLE ACCT ID": "LOAN",
        "CORY TYPE": "FI",
        "STATUS": "PAI"
    },
    {
        "FUND": "SGF5",
        "LOC": "NZ",
        "TRADE ID": "WDIWDFFF",
        "SETTLE ACCT ID": "LOAN",
        "CORY TYPE": "FI",
        "STATUS": "OPEN"
    },
    {
        "FUND": "SGF5",
        "LOC": "NZ",
        "TRADE ID": "WDIWDFFF",
        "SETTLE ACCT ID": "LOAN",
        "CORY TYPE": "FI",
        "STATUS": "CAL"
    }
]

const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
]

const lineConfig = {
    data,
    autoFit: true,
    xField: 'year',
    yField: 'value',
    point: {
        size: 5,
        shape: 'diamond',
    },
    label: {
        style: {
            fill: '#aaa',
        },
    },
}

// const pieData = [
//     { item: 'Case 1', count: 40, percent: 0.4 },
//     { item: 'Case 2', count: 221, percent: 0.4 },
//     { item: 'Case 3', count: 17, percent: 0.17 },
//     { item: 'Case 4', count: 13, percent: 0.13 },
//     { item: 'Case 5', count: 9, percent: 0.09 },
// ];


const tmpCnt = {
    'LOC': {},
    'CORY TYPE': {},
    'STATUS': {}
}
resultData.forEach(r => {
    for (const key in r) {
        if (!tmpCnt[key]) continue
        if (!(r[key] in tmpCnt[key])) {
            tmpCnt[key][r[key]] = {
                item: r[key],
                count: 1
            }
        } else {
            tmpCnt[key][r[key]].count += 1
        }
    }
    console.log(tmpCnt)
})
const pieData = []
for (const name in tmpCnt) {
    pieData.push({
        title: name,
        config: {
            data: Object.values(tmpCnt[name]),
            angleField: 'count',
            colorField: 'item',
            label: 'count',
            radius: 120,
            interactions: [
            {
                type: 'pie-legend-active',
            },
            {
                type: 'element-active',
            },
            ],
        }
    })
}


const WorkflowPage = (props) => {
    const { text } = props;
    const [jsonData, setJsonData] = useState({title: ''});
    const [current, setCurrent] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [showLogon, setShowLogon] = useState(false)
    const [showReport, setShowReport] = useState(false)
    const [showEdit, setShowEdit] = useState(false)

    useEffect(() => {
        //发送请求到 get＿data
        const encodedText = encodeURIComponent(text);
        fetch(`http://127.0.0.1:5000/initial-workflow?text=${encodedText}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                setJsonData(data);
            })
            .catch(error => {
                console.error('Error:', error);
                // 可能还需要其他的错误处理逻辑
            });
    }, [text]);

    console.log('jsonData', jsonData)

    const start = () => {
        setCurrent(0)
        setIsRunning(true)
        setTimeout(() => {
            setCurrent(1)
            setShowLogon(true)
        }, 2000)
    }
    const logon = () => {
        setCurrent(2)
        setShowLogon(false)
    }

    const generateChart = () => {
        setShowReport(true)
    }

    useEffect(() => {
        if (!showLogon && current >= 2) {
            setTimeout(() => {
                setCurrent(c => c+1)
            }, 2500)
        }
    }, [showLogon])

    useEffect(() => {
        if (current >= stepItems.length) {
            setIsRunning(false)
        } else if (current > 2) {
            setTimeout(() => {
                setCurrent(c => c + 1)
            }, 2500)
        }
    }, [current])

    const stepItems = [...commonStepItems]
    if (Object.keys(jsonData).length !== 0) {
        stepItems.pop()
        workflowSequence.forEach(wf => {
            if (jsonData[wf]) {
                stepItems.push({
                    key: stepItems.length,
                    title: `${wf} Process`,
                    description: jsonData[wf],
                    icon: <RobotOutlined />
                })
            }
        })
        
    }

    const clonedStepItems = stepItems.map(stepProps => {
        let icon = stepProps.icon
        if (current == stepProps.key && isRunning) {
            icon = <Spin indicator={LoadingOutlined} />
        } else if (current > stepProps.key) {
            icon = <CheckCircleOutlined />
        }
        return {
            ...stepProps,
            icon,
        }
    })

    const hideReport = () => {
        setShowReport(false)
    }

    return <div className='container'>
        <h2>Welcome to the Workflow</h2>
        <h3 className='wf-title'>{jsonData.title}</h3>
        <p>We have customized a workflow from your description. If this is not the workflow you want: <Button icon={<EditOutlined />} onClick={setShowEdit}>Edit the Workflow</Button></p>
        <p style={{marginBottom: '20px'}}>Follow the steps below and click START button.</p>

        <Steps direction='vertical' className='steps' current={current} size='medium' items={clonedStepItems} />
        <div>
            <Button type='primary' onClick={start} className='left-btn'>START</Button>
            {!isRunning && current == stepItems.length ?
                <Button onClick={generateChart} icon={<BarChartOutlined />}>Generate Report</Button> : null
            }
        </div>
        <Modal title="Logon" width={360} open={showLogon} onOk={logon} onCancel={() => {setShowLogon(false)}}>
            <div className='logon-form'>
                <Row>
                    <Col span={6} className='logon-label'>User ID</Col>
                    <Col span={15}><Input /></Col>
                </Row>
                <Row>
                    <Col span={6} className='logon-label'>Password</Col>
                    <Col span={15}><Input type='password' /></Col>
                </Row>
            </div>
        </Modal>
        <Modal title="Report" open={showReport} className='report' onOk={hideReport} onCancel={hideReport}>
            <div className='content'>
                {/* <Line {...lineConfig} className='left-chart' /> */}
                {pieData.map(data => {
                    console.log(data)
                    return <div style={{flex: 1}}>
                        <p>{data.title}</p>
                        <Pie {...data.config}  />
                    </div>
                })}
            </div>
        </Modal>
        <Modal title="Re-arrange Workflow" open={showEdit} className='edit' onOk={() => {setShowEdit(false)}} onCancel={() => {setShowEdit(false)}}>
            <textarea multiple={true} defaultValue={JSON.stringify(stepItems)} className='edit-text' />
        </Modal>
    </div>
}

export default WorkflowPage









