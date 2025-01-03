import { Box, Stack, Typography } from '@mui/material'
import { motion } from 'motion/react'
import React, { memo } from 'react'
import { Link } from '../styles/StyledComponents'
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
            <motion.div
                initial={{ opacity: 0, Y: "-100%" }}
                whileInView={{ opacity: 1, Y: 0 }}
                transition={{ delay: index * 0.1 }}
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
                    <Typography fontWeight={"bold"}>{name}</Typography>
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
            </motion.div>
        </Link >
    )
}

export default memo(ChatItem)