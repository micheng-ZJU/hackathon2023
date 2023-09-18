import React, { useState } from 'react'; 
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ChatContainer from './components/ChatContainer';
import "./App.css";
import DefaultPage from './components/DefaultPage';
import ProcessPage from './components/ProcessPage';
import WorkflowPage from './components/WorkflowPage';
import SuggestionPage from './components/SuggestionPage';

function App() {
    const [showChatbot, setShowChatbot] = useState(false)
    const [leftSectionContent, setLeftSectionContent] = useState(DefaultPage);

    // 定义函数来更新左侧2／3的内容
    const updateLeftSectionContent = (content, text) => {
        if (content === "emailpage") {
            setLeftSectionContent(<WorkflowPage text={text} />);
        } else if (content === "processpage") {
            setLeftSectionContent(<ProcessPage />);
        } else if (content === "suggestpage") {
            setLeftSectionContent(<SuggestionPage text={text} />);
        } else {
            //设置其他页面内容
            setLeftSectionContent(<DefaultPage />);
        }
    };
    const openChatbot = () => {
        setShowChatbot(true);
        console.log('Opening chatbot');
    };

    return (
        <Router>
            <div className="App">
                <header className="header">
                    <h1>Seals APAC ChatBot APP</h1>
                </header>
                <div className="content">
                    <div className="section left-section">
                        {leftSectionContent ? (
                            leftSectionContent
                        ) : (
                            <Switch>
                                <Route path="/chat" component={DefaultPage} />
                                <Route path="/emailpage" component={WorkflowPage} />
                                <Route path="/processpage" component={ProcessPage} />
                                ｛／＊其他路由和页面组件＊／｝
                            </Switch>
                        )}
                    </div>
                    <div className="section right-section">
                        <div className="robot-background">
                            <ChatContainer updateLeftSectionContent={updateLeftSectionContent} />
                        </div>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;