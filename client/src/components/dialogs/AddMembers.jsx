import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { sampleUsers } from '../constants/sampleData'
import UserItem from '../shared/UserItem'

const AddMembers = ({ open, handleClose }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle textAlign={"center"}>
                Add Members
            </DialogTitle>
            <Stack
                p={"2rem"}
                width={"20rem"}
                spacing={"1rem"}
            >
                {
                    sampleUsers.length > 0 ? sampleUsers.map((user) => (
                        <UserItem key={user._id} user={user} />
                    )) : <Typography textAlign={"center"}>No Friends</Typography>
                }
            </Stack>
        </Dialog>
    )
}

export default AddMembers