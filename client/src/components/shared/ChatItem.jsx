import React, { memo } from 'react'
import { Link } from '../styles/StyledComponents'
import { Box, Stack, Typography } from '@mui/material'
import AvatarCard from './AvatarCard'

const ChatItem = ({
    avatar = [],
    name,
    _id,
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index = 0,
    handleChatDelete,
}) => {
    return (
        <Link to={`/chat/${_id}`} onContextMenu={(e) => handleChatDelete(e, _id, groupChat)}>
            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: sameSender ? "gray" : "unset",
                    color: sameSender ? "white" : "unset",
                    position: "relative",
                }}
            >

                <AvatarCard avatar={avatar} />

                <Stack>
                    <Typography color={'white'}>{name}</Typography>
                    {newMessageAlert && (
                        <Typography olor={'white'}>{newMessageAlert.count} New Message</Typography>
                    )}
                </Stack>
                {isOnline && (
                    <Box
                        sx={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "green",
                            position: "absolute",
                            top: "50%",
                            right: "1rem",
                            transform: "translateY(-50%)",
                        }}
                    />
                )}
            </div>
        </Link >
    )
}

export default memo(ChatItem)