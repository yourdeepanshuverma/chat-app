import { Stack } from '@mui/material';
import React from 'react';
import ChatItem from '../shared/ChatItem';

const ChatList = ({
    w = "100%",
    chats = [],
    chatId,
    onlineUsers = [],
    newMessagesAlert = [
        {
            chatId: "",
            count: 0
        }
    ],
    handleChatDelete
}) => {
    return (
        <Stack width={w} color='transparent' p={'1rem'} spacing={'0.5rem'}>
            {
                chats.map((data, index) => {
                    const { avatar, name, _id, groupChat, members } = data
                    const newMessageAlert = newMessagesAlert.find(
                        ({ chatId }) => chatId === _id
                    );

                    const isOnline = members?.some((member) => onlineUsers.includes(_id));

                    return <ChatItem
                        newMessageAlert={newMessageAlert}
                        isOnline={isOnline}
                        avatar={avatar}
                        name={name}
                        index={index}
                        _id={_id}
                        key={_id}
                        sameSender={chatId === _id}
                        groupChat={groupChat}
                        handleChatDelete={handleChatDelete}
                    />;
                })
            }
        </Stack >
    )
};

export default ChatList;