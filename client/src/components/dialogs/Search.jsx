import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import UserItem from '../shared/UserItem'
import { sampleUsers } from '../constants/sampleData'

const Search = () => {
  const [users, setUsers] = useState(sampleUsers)

  const { register, watch } = useForm()
  const search = watch("search")

  const handlerAddFriend = (_id) => {

  }

  const isLoadingSendFriendReq = () => {

  }

  return (
    <Dialog open>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            size="small"
            placeholder='Search by username'
            fullWidth
            InputProps={{
              ...register("search")
              ,
              startAdornment: (
                <InputAdornment position="start" >
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <List>
            {
              users.map((i) => (
                <UserItem key={i._id} user={i} handlerAddFriend={handlerAddFriend} handlerIsLoading={isLoadingSendFriendReq} />
              ))
            }
          </List>
        </DialogContent>
      </Stack>
    </Dialog >
  )
}

export default Search