import React from "react"
import axios from "axios";

const MessageForm = ({ addMessage, input, setInput, handleInputChange }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!input) return;
        setIsLoading(true);
        addMessage(input, true);
        setInput("");

        const apiUrl = "http://127.0.0.1:5000";// Replace with your API key
        try {
            const response = await axios.post(apiUrl, { query: input });
            const botMessage = response.data.result;
            const isImage = response.data.isImage;
            const imageUrls = response.data.imageUrls;
            const history = response.data.history;
            addMessage(botMessage, false, isImage, imageUrls, history);
        } catch (error) {
            console.error("Error generating response:", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="message-form" onSubmit={handleFormSubmit}>
            <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={handleInputChange}
            />
            <button type="submit" disabled={isLoading}>
                Send
            </button>
        </form>
    );
};

export default MessageForm;