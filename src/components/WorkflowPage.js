import { useEffect, useState } from 'react'
import { Button, Icon, Spin, Steps, Upload, Modal, Row, Col, Input } from 'antd'
import { LoadingOutlined, UserOutlined, FileAddOutlined, RobotOutlined, CheckCircleOutlined, BarChartOutlined } from '@ant-design/icons'
import { Line, HistogramConfig, Pie, PieConfig, Histogram } from '@ant-design/plots'
import './WorkflowPage.less'

const stepItems = [{
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

const pieData = [
    { item: 'Case 1', count: 40, percent: 0.4 },
    { item: 'Case 2', count: 221, percent: 0.4 },
    { item: 'Case 3', count: 17, percent: 0.17 },
    { item: 'Case 4', count: 13, percent: 0.13 },
    { item: 'Case 5', count: 9, percent: 0.09 },
];

const pieConfig = {
    data: pieData,
    angleField: 'percent',
    colorField: 'item',
    label: 'percent',
    radius: 120
}

const WorkflowPage = () => {
    const [current, setCurrent] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showReport, setShowReport] = useState(false)

    const start = () => {
        setCurrent(0)
        setIsRunning(true)
        setTimeout(() => {
            setCurrent(1)
            setShowModal(true)
        }, 2000)
    }
    const logon = () => {
        setCurrent(2)
        setShowModal(false)
    }

    const generateChart = () => {
        setShowReport(true)
    }

    useEffect(() => {
        if (!showModal && current == 2) {
            setTimeout(() => {
                setCurrent(3)
                setIsRunning(false)
            }, 4000)
        }
    }, [showModal])

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
        <p>We have generated a workflow for your job</p>
        <p style={{ marginBottom: '30px' }}>Please click START button to run the job</p>
        <Steps direction='vertical' className='steps' current={current} size='medium' items={clonedStepItems} />
        <div>
            <Button type='primary' onClick={start} className='left-btn'>START</Button>
            {!isRunning && current == 3 ?
                <Button onClick={generateChart} icon={<BarChartOutlined />}>Generate Report</Button> : null
            }
        </div>
        <Modal title="Logon" width={360} open={showModal} onOk={logon}>
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
        <Modal title="Report" open={showReport} className='report' onOk={hideReport} cancelButtonProps={{ style: { display: 'none' } }} closable={false}>
            <div className='content'>
                <Line {...lineConfig} className='left-chart' />
                <Pie {...pieConfig} className='right-chart' />

            </div>
        </Modal>
    </div>
}

export default WorkflowPage









