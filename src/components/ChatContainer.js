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
            console.log("server_response:", server_response);
            if (server_response.includes("详细的工作流配置请在左侧页面操作") || server_response.includes("Please Perform Workflow Detailed Configuration On The Left-Hand Side Of The Page")) {
                //使用回调函数来更新左侧2／3的内容
                updateLeftSectionContent("emailpage", input);
            } else if (
                server_response.includes("详细的配置请在左侧页面操作") ||
                server_response.includes("Please Perform Detailed Configuration On The Left-Hand Side Of The Page")
            ) {
                //使用回调函数来更新左侧2／3的内容
                updateLeftSectionContent("processpage");
            } else if (
                server_response.includes("根据需求查找到以下匹配的解决方案，请在左侧页面继续查看以及操作") ||
                server_response.includes("Please Continue To View And Operate On The Left Page To Find The Matching Solutions According To The Requirements")
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