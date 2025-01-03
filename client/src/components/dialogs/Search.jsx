import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import UserItem from '../shared/UserItem'
import { setSearch } from '../../store/reducers/miscSlice'
import { useLazySearchUsersQuery, useSendFriendRequestMutation } from '../../store/api/apiSlice'
import { useAsyncMutation } from '../../hooks/hook'

const Search = () => {
  const dispatch = useDispatch()
  const [users, setUsers] = useState([])
  const { isSearch } = useSelector(state => state.misc)

  const [searchUser] = useLazySearchUsersQuery()
  const [sendFriendRequest, isLoadingSendFriendReq] = useAsyncMutation(useSendFriendRequestMutation)


  const { register, watch } = useForm()
  const search = watch("search")

  const handlerAddFriend = async (_id) => {
    await sendFriendRequest("Sending Friend Request...", { userId: _id })
  }


  const handleClose = () => dispatch(setSearch(false))

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search)
        .then(({ data }) => setUsers(data))
        .catch(err => console.log(err))
    }, 1000);

    return () => {
      clearInterval(timeOutId)
    }
  }, [search])


  return (
    <Dialog open={isSearch} onClose={handleClose}>
      <Stack sx={{ height: "80vh" }} p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <DialogContent>
          <TextField
            sx={{
              position: "sticky",
              top: "0",
              left: "0",
              backgroundColor: 'white',
              zIndex: "999"
            }}
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