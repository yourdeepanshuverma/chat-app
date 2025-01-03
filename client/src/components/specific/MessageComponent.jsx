import { Box, Typography } from '@mui/material'
import moment from 'moment'
import React from 'react'
import { fileformatter, transformImage } from '../lib/features'
import RenderAttachment from '../shared/RenderAttachment'
import { msgPillTilte } from '../constants/color'
import { motion } from "motion/react";

const MessageComponent = ({ message, user }) => {

    const { sender, content, attachments = [], createdAt } = message

    const sameSender = sender?._id === user?._id

    const timeAgo = moment(createdAt).fromNow()

    return (
        <motion.div
        initial={{ opacity: 0, x: "-100%" }}
        whileInView={{ opacity: 1, x: 0 }}
            style={{
                backgroundColor: "white",
                color: "black",
                margin: "0.5rem",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                width: "fit-content",
                alignSelf: sameSender ? "flex-end" : "flex-start",
                display: "flex",
                flexDirection: "column",
                alignItems: sameSender ? "flex-end" : "flex-start"
            }}
        >
            {!sameSender && <Typography variant="caption" fontWeight={600} color={msgPillTilte}>
                {sender?.name}
            </Typography>}

            {content && <Typography>
                {content}
            </Typography>}


            {
                attachments.length > 0 &&
                attachments.map((attachment, index) => {
                    const url = attachment.url
                    const file = fileformatter(url);
                    return (
                        <Box
                            key={index}
                        >
                            <a
                                href={url}
                                target="_blank"
                                download
                                style={{
                                    color: "black",
                                }}
                            >
                                {RenderAttachment(file, transformImage(url))}
                            </a>
                        </Box>
                    )
                })
            }

            <Typography variant="caption" color={"text.secondary"}>
                {timeAgo}
            </Typography>
        </motion.div>
    )
}

export default MessageComponent