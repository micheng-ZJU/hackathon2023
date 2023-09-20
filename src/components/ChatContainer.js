import React from "react";
import MessageForm from "./MessageForm";
import MessageList from "./MessageList";

const ChatContainer = ({ updateLeftSectionContent }) => {
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState("");
    let server_response = "";

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const addMessage = (text, isUser = true, isImage, imageUrls, history) => {
        server_response = text;
        if (!isImage || (isImage && imageUrls && imageUrls.length > 0)) {
            if (history && history.length > 0) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text, isUser, isImage, imageUrls, history }
                ]);
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text, isUser, isImage, imageUrls }
                ]);
            }
        }
        else {
            if (history && history.length > 0) {
                setMessages((prevMessages) => [...prevMessages, { text, isUser, history }]);
            } else {
                setMessages((prevMessages) => [...prevMessages, { text, isUser }]);
            }
        }

        if (server_response && server_response.length > 0) {
            if (server_response[0].includes("详细的工作流配置") || server_response[0].includes("Please Perform Workflow Detailed Configuration")) {
                //使用回调函数来更新左侧2／3的内容
                updateLeftSectionContent("emailpage", input);
            } else if (
                server_response[0].includes("详细的配置请在左侧页面操作") ||
                server_response[0].includes("Please Perform Detailed Configuration On The Left-Hand Side Of The Page")
            ) {
                //使用回调函数来更新左侧2／3的内容
                updateLeftSectionContent("processpage");
            } else if (
                server_response[0].includes("最匹配用户需求的几个解决方案") ||
                server_response[0].includes("Please Continue To View And Operate On The Left Page To Find The Matching Solutions According To The Requirements")
            ) {
                // 使用回调函数来更新左侧2／3的内容
                updateLeftSectionContent("suggestpage", input);
            }
        }
    };

    return (
        <div className="chat-container">
            <MessageList messages={messages} addMessage={addMessage} />
            <MessageForm addMessage={addMessage} input={input} setInput={setInput} handleInputChange={handleInputChange} />
        </div>
    );
};

export default ChatContainer;