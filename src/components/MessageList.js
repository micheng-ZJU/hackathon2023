import React from 'react';
import axios from "axios";

const MessageList = ({ messages, addMessage }) => {
    const [input, setInput] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [buttonsDisabled, setButtonsDisabled] = React.useState(false)
    const [noButtonsDisabled, setNoButtonsDisabled] = React.useState(false);
    const apiUrl = "http://127.0.0.1:5000";

    // 定义不同图片对应的预定义查询
    const predefinedInputs = [
        'RDA',
        'Python',
        'Alteryx',
        //...更多预定义查询
    ];

    const renderTextWithLinks = (text) => {
        console.log("Text type:", typeof text);
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const formattedText = text.replace(/(\.|。)/g, (match) => match + '<br />');
        const textWithLinks = formattedText.replace(urlRegex, '<a href="$&" target="_blank">$&</a>');
        return { __html: textWithLinks };
    };


    const renderContent = (text) => {
        if (typeof text === "string") {
            return <div className="message-text" dangerouslySetInnerHTML={renderTextWithLinks(text)} />;
        } else if (typeof text === "object") {
            return (
                <div className="message-text">
                    {Object.values(text).map((textItem, textIndex) => (
                        <div key={textIndex} className="object-text">
                            {typeof textItem === "string" && (
                                <p dangerouslySetInnerHTML={renderTextWithLinks(textItem)} />
                            )}
                        </div>
                    ))}
                </div>
            );
        } else {
            const formattedText = text.replace(/(\.|。)/g, (match) => match + '<br/>');
            return <div className="message-text">{formattedText}</div>;
        }
    };


    // 处理图片点击事件
    const handleImageClick = async (message) => {
        setIsLoading(true);
        // addMessage (input, true);
        // setInput("");
        const requestBody = { query: message };
        try {
            const response = await axios.post(apiUrl, requestBody);
            const botMessage = response.data.result;
            const isImage = response.data.isImage;
            const imageUrls = response.data.imageUrls;
            addMessage(botMessage, false, isImage, imageUrls);
            console.log("responseData:", botMessage);
        } catch (error) {
            // 处理错误情况 console.error("Error generating response:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleYes = async (history, index) => {
        // Disable only the clicked "Yes" button
        updatedMessages[index].buttonsDisabled = true;
        await sendToBackend("FNGPT:" + history);
    };

    const handleNo = async (history, index) => {
        // Disable only the clicked "No" button
        const updatedMessages = [...messages];
        updatedMessages[index].noButtonsDisabled = true;
        await sendToBackend("SSGPT:" + history);
    };

    const sendToBackend = async (message) => {
        setIsLoading(true);
        const requestBody = { query: message };
        console.log("requestBody:", requestBody);
        try {
            const response = await axios.post(apiUrl, requestBody);
            const botMessage = response.data.result;
            const isImage = response.data.isImage;
            const imageUrls = response.data.imageUrls;
            addMessage(botMessage, false, isImage, imageUrls);
            console.log("responseData:", botMessage);
        } catch (error) {
            //处理错误情况
            console.error("Error generating response:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="message-list">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`message ${message.isUser ? "user" : "bot"}`}
                >
                    {renderContent(message.text)}
                    {message.isImage && message.imageUrls && message.imageUrls.length > 0 && (
                        <div className="image-container">
                            {message.imageUrls.map((imageUrl, imgIndex) => (
                                <img
                                    key={imgIndex}
                                    src={imageUrl}
                                    alt={`Image ${imgIndex + 1}`}
                                    onClick={() => handleImageClick(predefinedInputs[imgIndex])}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    )}
                    {message.history && message.history.length > 0 && (
                        <div>
                            <button className="styled-button" onClick={() => handleYes(message.history, index)} disabled={message.buttonsDisabled}>Yes</button>
                            <button className="styled-button" onClick={() => handleNo(message.history, index)} disabled={message.noButtonsDisabled}>No</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MessageList;