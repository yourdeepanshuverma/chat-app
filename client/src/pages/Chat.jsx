import { useInfiniteScrollTop } from "6pp";
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import { IconButton, Skeleton, Stack, } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { grey } from "../components/constants/color";
import { NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../components/constants/event.js";
import FileMenu from "../components/dialogs/FileMenu.jsx";
import AppLayout from "../components/layout/AppLayout";
import { TypingLoader } from "../components/Loaders.jsx";
import MessageComponent from "../components/specific/MessageComponent";
import { InputBox } from "../components/styles/StyledComponents";
import { useError, useSocketEvents } from "../hooks/hook.jsx";
import { getSocket } from "../socket.jsx";
import { useChatDetailsQuery, useGetMessagesQuery } from "../store/api/apiSlice.js";
import { removeNewNotificationAlert } from "../store/reducers/chatSlice.js";
import { setFileMenu } from "../store/reducers/miscSlice.js";

const Chat = ({ chatId, user }) => {
    const containerRef = useRef(null);
    const socket = getSocket();
    const dispatch = useDispatch();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [fileAnchorMenu, setFileAnchorMenu] = useState(null);
    const [iAmTyping, setIAmTyping] = useState(false)
    const [userTyping, setUserTyping] = useState(false)

    const typingTimeout = useRef(null);
    const bottomRef = useRef(null);

    const chatDetails = useChatDetailsQuery({ chatId, }, { skip: !chatId });
    const oldMessagesChunk = useGetMessagesQuery({ chatId, page }, { skip: !chatId });

    const errors = [
        { isError: chatDetails.isError, error: chatDetails.error },
        { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error }
    ]

    const members = chatDetails?.data?.chat?.members;

    const sendMessage = (e) => {
        e.preventDefault()
        if (!message.trim()) return

        socket.emit(NEW_MESSAGE, { chatId, members, message })
        setMessage("")
    };

    useEffect(() => {
        dispatch(removeNewNotificationAlert(chatId))
        return () => {
            setMessages([])
            setMessage("")
            setPage(1)
            setOldMessages([])
        }
    }, [chatId])

    useEffect(() => {
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages])


    const newMessageHandler = useCallback((data) => {
        if (chatId != data.chatId) return
        setMessages(prev => [...prev, data.message])
    }, []);

    const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
        containerRef,
        oldMessagesChunk?.data?.totalPages,
        page,
        setPage,
        oldMessagesChunk?.data?.messages
    )

    const handleFileOpen = (e) => {
        dispatch(setFileMenu(true))
        setFileAnchorMenu(e.currentTarget)
    }

    const messageOnChangeHandler = (e) => {
        e.preventDefault();
        setMessage(e.target.value);

        if (!iAmTyping) {
            socket.emit(START_TYPING, { chatId, members })
            setIAmTyping(true)
        }

        if (typingTimeout.current) clearTimeout(typingTimeout.current)

        typingTimeout.current = setTimeout(() => {
            socket.emit(STOP_TYPING, { chatId, members })
            setIAmTyping(false)
        }, 2000)
    }

    const startTypingListner = useCallback((data) => {
        if (chatId != data.chatId) return
        setUserTyping(true)
    })

    const stopTypingListner = useCallback((data) => {
        if (chatId != data.chatId) return
        setUserTyping(false)
    })


    const eventHandler = {
        [NEW_MESSAGE]: newMessageHandler,
        [START_TYPING]: startTypingListner,
        [STOP_TYPING]: stopTypingListner,
    };

    useSocketEvents(socket, eventHandler);
    useError(errors)

    const allMessages = [...oldMessages, ...messages]

    return chatDetails.isLoading ? (<Skeleton />) :
        (
            <>
                <Stack
                    ref={containerRef}
                    boxSizing={"border-box"}
                    padding={"1rem"}
                    spacing={"1rem"}
                    bgcolor={grey}
                    height={"90%"}
                    sx={{
                        borderRadius: "1rem",
                        overflowX: "hidden",
                        overflowY: "auto",
                    }}>
                    {allMessages.map((i) =>
                        <MessageComponent key={i?._id} user={user} message={i} />
                    )
                    }
                    {userTyping && <TypingLoader />}

                    <div ref={bottomRef} />
                </Stack>
                <form
                    style={{
                        height: '10%'
                    }}
                    onSubmit={sendMessage}
                >
                    <Stack
                        height={'100%'}
                        direction={"row"}
                        sx={{
                            position: "relative",
                            padding: "0.5rem",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}
                    >
                        <IconButton
                            sx={{
                                position: 'absolute',
                                left: "1rem",
                                rotate: "30deg"
                            }}
                            onClick={handleFileOpen}
                        >
                            <AttachFileIcon />
                        </IconButton>
                        <InputBox
                            placeholder="Type a message"
                            value={message}
                            onChange={messageOnChangeHandler}
                        />
                        <IconButton type="submit">
                            <SendIcon />
                        </IconButton>
                    </Stack>
                </form >
                <FileMenu anchorE1={fileAnchorMenu} chatId={chatId} />
            </>
        );
};

export default AppLayout()(Chat);