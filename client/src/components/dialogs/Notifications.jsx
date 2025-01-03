import { useDispatch } from 'react-redux'
import React, { memo } from 'react'
import { Avatar, Dialog, DialogTitle, List, ListItem, Stack, Typography, Tooltip, Button, Skeleton } from '@mui/material'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../store/api/apiSlice'
import { setNotification } from '../../store/reducers/miscSlice'
import { useSelector } from 'react-redux'
import { useError } from '../../hooks/hook'

const Notifications = () => {
  const dispatch = useDispatch()
  const { isNotification } = useSelector(state => state.misc)

  const { isError, isLoading, error, data, refetch } = useGetNotificationsQuery()
  const [acceptFriendRequest] = useAcceptFriendRequestMutation()

  const handleAcceptRequest = async ({ _id, accept }) => {
    dispatch(setNotification(false))
    const res = await acceptFriendRequest({ requestId: _id, accept })
    if (res?.data?.success) {
      console.log("Socket here");
    }
  }

  const handleClose = () => dispatch(setNotification(false))

  useError([{ isError, error }])

  return (
    <Dialog open={isNotification} onClose={handleClose} maxWidth={"25rem"}>
      <Stack p={{ xs: "1rem", sm: "2rem" }}>
        <DialogTitle>Notifications</DialogTitle>
        {isLoading ? <Skeleton /> :
          (<>
            {data?.requests.length > 0 ?
              <List>
                {data?.requests?.map(({ sender, _id }) => (
                  <NotificationItem key={_id} sender={sender} _id={_id} handler={handleAcceptRequest} />
                ))}
              </List>
              :
              <Typography textAlign={"center"}>0 Notifications</Typography>
            }
          </>
          )
        }
      </Stack>
    </Dialog>
  )
}

const NotificationItem = memo(({ sender, _id, handler }) => {

  const { name, avatar } = sender

  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar
          src={avatar.url}
        />
        <Tooltip title={`${name} sent you a friend request.`}>
          <Typography
            variant="body1"
            sx={{
              width: "100%",
              flexGlow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textoverflow: "ellipsis",
            }}
          >
            {`${name} sent you a friend request.`}
          </Typography>
        </Tooltip>
        <Stack direction={"row"} spacing={1}>
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color='error' onClick={() => handler({ _id, accept: false })}>Reject</Button>
        </Stack>
      </Stack>
    </ListItem >
  )
})

export default Notifications