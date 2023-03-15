import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from 'socket.io-client';
import "./MessageForm.css";

let socket;

function MessageForm() {
    // const dispatch = useDispatch();
    const [content, setContent] = useState("");
    const [messages, setMessages] = useState([]); // default messages should be channelMessages
    const user = useSelector(state => state.session.user)
    // const channel = useSelector(state => state.channels.currentChannel)
    let channel = "#sample-channel"

    // will need room functionality tp broadcast to just users in the room (channel), not all users --> add channel to dependency array?
    useEffect(() => {
        // open socket connection
        // create websocket
        socket = io();

        // socket.on('subscribe', function(channel) {
        //     try{
        //       console.log('[socket]','join channel :', channel)
        //       socket.join(channel);
        //       socket.to(channel).emit('user joined', socket.id);
        //     }catch(e){
        //       console.log('[error]','join channel :',e);
        //       socket.emit('error','couldnt perform requested action');
        //     }
        // })

        socket.on("chat", (chat) => {
            setMessages(messages => [...messages, chat])
        })
        // when component unmounts, disconnect
        return (() => {
            socket.disconnect()
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();

        // add .to('channelName') before .emit when adding room functionality?
        socket.emit("chat", { user: user.username, msg: content });

        // await dispatch("insert create message thunk here")
        //   .catch(
        //     async (res) => {
        //       const data = await res.json();
        //       if (data && data.errors) setErrors(data.errors);
        //     }
        //   );
        setContent("");
        return "thunk in progress..." // will be deleted once thunk is created
    };

    return (
        <>
            <div>
                    {messages.map((message, ind) => (
                        <div key={ind}>{`${message.user.slice(0, -5)} ${message.msg}`}</div>
                    ))}
            </div>
            <div className='message-form-container'>
                <form className="message-form" onSubmit={handleSubmit}>
                {/* at 1800 characters start a counter for characters allowed left (starts at 200), disable the send button above 2000  */}
                {/* need to figure out dynamic sizing with css? */}
                <textarea
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Message ${channel}`}
                required
                />
                <div className="message-form-right-side">
                    <div className={content.length >= 1800 ? (content.length > 2000 ? "character-count-error" : "character-count-warning") : "message-hidden"}>{2000 - content.length}</div>
                    <button className="message-form-button message-form-text" type="submit" disabled={content.length > 2000}>Send</button>
                </div>
                </form>
            </div>
        </>
    )
}


export default MessageForm;
