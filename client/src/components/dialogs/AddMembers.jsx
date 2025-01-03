import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import UserItem from '../shared/UserItem'
import { useAsyncMutation, useError } from '../../hooks/hook'
import { useAddMemberMutation, useAvailableFriendsQuery } from '../../store/api/apiSlice'
import { useSelector } from 'react-redux'

const AddMembers = ({ chatId, handleClose }) => {

    const { isAddMembers } = useSelector(state => state.misc)
    const [selectedMembers, setSelectedMembers] = useState([])

    const availableFriends = useAvailableFriendsQuery(chatId)
    const [addMember, isAddMemberLoading] = useAsyncMutation(useAddMemberMutation)

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) =>
            prev.includes(id)
                ? prev.filter((currElement) => currElement !== id)
                : [...prev, id])
    }

    const addMemberHandler = () => {
        addMember("Adding Members...", { chatId, members: selectedMembers })
        handleClose()
    }

    console.log(availableFriends?.data);


    useError([{
        isError: availableFriends.isError,
        error: availableFriends.error
    }])

    return (
        <Dialog open={isAddMembers} onClose={handleClose}>
            <DialogTitle textAlign={"center"}>
                Add Members
            </DialogTitle>
            <Stack
                p={"2rem"}
                width={"20rem"}
                spacing={"1rem"}
            >
                {
                    availableFriends?.data?.friends?.length > 0 ?
                        (<>
                            {availableFriends?.data?.friends.map((user) => (
                                <UserItem key={user._id} user={user} handlerAddFriend={selectMemberHandler} isAdded={selectedMembers.includes(user._id)} />
                            ))}
                            <Button onClick={addMemberHandler} disabled={isAddMemberLoading} >Add</Button>
                        </>)
                        : <Typography textAlign={"center"}>No Friends</Typography>
                }
            </Stack>
        </Dialog>
    )
}

export default AddMembers