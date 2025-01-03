import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material'
import { Menu, Stack, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../../hooks/hook'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../store/api/apiSlice'
import { setDeleteMenu } from '../../store/reducers/miscSlice'

const DeleteChatMenu = ({ dispatch, deleteAnchorMenu }) => {
    const navigate = useNavigate()

    const { isDeleteMenu, selectedDeleteChat } = useSelector(state => state.misc);

    const [leaveGroup, isLeaveGroupLoading] = useAsyncMutation(useLeaveGroupMutation)
    const [deleteChat, isDeleteChatLoading] = useAsyncMutation(useDeleteChatMutation)

    const handleClose = () => {
        dispatch(setDeleteMenu(false))
    };

    const deleteChatHandler = () => {
        deleteChat("Deleting Chat...", selectedDeleteChat.chatId)
        navigate("/")
    };

    const leaveGroupHandler = () => {
        leaveGroup("Leaving Group...", selectedDeleteChat.chatId)
        navigate("/")
    };

    return (
        <Menu
            open={isDeleteMenu}
            anchorEl={deleteAnchorMenu.current}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}>
            <Stack
                sx={{
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    width: '10rem',
                }}
                direction={"row"}
                alignItems={"center"}
                spacing={"0.5rem"}
                onClick={selectedDeleteChat.groupChat ? leaveGroupHandler : deleteChatHandler}
            >
                {selectedDeleteChat.groupChat ? <><ExitToAppIcon />
                    <Typography variant="body1" color="initial">Leave Group</Typography>
                </> : <><DeleteIcon />
                    <Typography variant="body1" color="initial">Delete Chat</Typography>
                </>}
            </Stack>
        </Menu>
    )
}

export default DeleteChatMenu