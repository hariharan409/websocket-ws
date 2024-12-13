import React,{ useState } from "react";
import useWebSocket from "react-use-websocket";
import "./chat-bot.css";
import { DarkLoader } from "../loader/Spinner";


const ChatBot = () => {
    const [query,setQuery] = useState("");
    const [isLoading,setIsLoading] = useState(false);
    const [messageList,setMessageList] = useState([]);
    const [lastMessage,setLastMessage] = useState("");
    const WS_URL = 'ws://localhost:7777';

    // WebSocket setup with react-use-websocket
    const {sendMessage} = useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('WebSocket connection established.');
        },
        onMessage: (message) => {
            setIsLoading(false);
            if(message.data === "stream-done") {
                // once streaming has done, can append last message into the message list, and make the last message to empty
                setMessageList((prevList) => [
                    ...prevList,lastMessage
                ]);
                setLastMessage("");
                return;
            }
            // set last message to the ui
            setLastMessage((prevMessage) => (
                prevMessage + "" + message.data
            ));
        },
        onClose: () => {
            console.log('WebSocket connection closed.');
            setIsLoading(false);
        },
        onError: (error) => {
            console.error('WebSocket error:', error);
            setIsLoading(false);
        },
        // Optional: enable automatic reconnection if needed
        shouldReconnect: () => true,
    });

    const googleBardPalm2Api = async() => {
        try {
            setIsLoading(true);
            setLastMessage(query + " - ");
            setQuery("");
            if (!query.trim()) return; // Avoid sending empty queries
            sendMessage(JSON.stringify(query));
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const onInputKeyDown = (e) => {
        if(e.code === "Enter") {
            e.preventDefault();
            googleBardPalm2Api();
        }
    }

    return(
        <div className="chat-bot-grand-parent">
            <h5 className="chat-bot-title-text">CHAT-BOT</h5>
            <div className="chat-bot-card">
                {
                    messageList?.map((message,index) => {
                        return(
                            <div className="chat-bot-message-card" key={index}>
                                <span style={{color: "green",fontFamily: "sans-serif",textTransform: "uppercase",fontSize: "14px",fontWeight: "bold"}}>{message.split("-")[0]}</span>
                                <span> - </span>
                                <span>{message.split("-")[1]}</span>
                            </div>
                        )
                    })
                }
                {
                    lastMessage && (
                        <div className="chat-bot-message-card">
                            <span style={{color: "green",fontFamily: "sans-serif",textTransform: "uppercase",fontSize: "14px",fontWeight: "bold"}}>{lastMessage.split("-")[0]}</span>
                            <span> - </span>
                            <span>{lastMessage.split("-")[1]}</span>
                        </div>
                    )
                }
                {
                    isLoading && <DarkLoader />
                }
            </div>
            <div className="chat-bot-footer">
                <textarea type="text" className="chat-bot-input-box" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onInputKeyDown} />
                <button onClick={() => googleBardPalm2Api()} className="btn btn-primary chat-bot-run" style={{pointerEvents: isLoading ? "none" : "auto"}}>Run</button>
            </div>
        </div>
    )
}

export default ChatBot;