import { useDispatch } from 'react-redux'
import React, { useState } from 'react'
import UserItem from '../shared/UserItem'
import { Button, Dialog, DialogTitle, List, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { setAddMembers } from '../../store/reducers/miscSlice'
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../store/api/apiSlice'
import { useAsyncMutation, useError } from '../../hooks/hook'
import { toast } from 'react-toastify'

const NewGroup = () => {
  const dispatch = useDispatch()
  const [groupName, setGroupName] = useState("")
  const [selectedMembers, setSelectedMembers] = useState([])

  const { isError, error, isLoading, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation)

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id])
  }

  const GroupNameChange = (e) => {
    setGroupName(e.target.value)
  }

  const handleSubmit = () => {
    if (!groupName) return toast.error("Group name is required")
    if (selectedMembers < 2) return toast.error("Please select at least 3 members")

    newGroup("Creating New Group...", { name: groupName, members: selectedMembers })
      .then((res) => {
        if (res?.data) {
          toast.success("Group Created Successfully")
          handleClose()
        }
      })
  }
  const handleClose = () => dispatch(setAddMembers(false))

  const errors = [{
    isError,
    error
  }]

  useError(errors)

  return (
    <Dialog open maxWidth={"25rem"} onClose={handleClose}>
      <Stack gap={"0.5rem"} p={{ xs: "1rem", sm: "2rem" }}>
        <DialogTitle>Create New Group</DialogTitle>
        <TextField
          label="Group Name"
          value={groupName}
          onChange={GroupNameChange}
        />
        <Typography variant='body1'>Select Members</Typography>
        <List>
          {isLoading ? <Skeleton /> : data?.friends?.map((i) => (
            <UserItem
              key={i._id}
              user={i}

              handlerAddFriend={selectMemberHandler}
              isAdded={selectedMembers.includes(i._id)}
            />
          ))}
        </List>
        <Stack>
          <Button variant="text" color="primary" onClick={handleSubmit} disabled={isLoadingNewGroup}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup