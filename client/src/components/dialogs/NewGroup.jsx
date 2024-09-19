import React, { useState } from 'react'
import { sampleUsers } from '../constants/sampleData'
import UserItem from '../shared/UserItem'
import { Button, Dialog, DialogTitle, List, Stack } from '@mui/material'

const NewGroup = () => {

  const [members, setMembers] = useState(sampleUsers)
  const [selectedMembers, setSelectedMembers] = useState([])

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id])
  }

  const handleSubmit = () => { }
  const handleClose = () => { }

  return (
    <Dialog open maxWidth={"25rem"} onClose={handleClose}>
      <Stack p={{ xs: "1rem", sm: "2rem" }}>
        <DialogTitle>Create New Group</DialogTitle>
        <List>
          {members?.map((i) => (
            <UserItem
              key={i._id}
              user={i}
              handlerAddFriend={selectMemberHandler}
              isAdded={selectedMembers.includes(i._id)}
            />
          ))}
        </List>
        <Stack>
          <Button variant="text" color="primary" onClick={handleSubmit}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup