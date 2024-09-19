import React, { memo } from 'react'
import { Avatar, Dialog, DialogTitle, List, ListItem, Stack, Typography, Tooltip, Button } from '@mui/material'
import { notifications } from '../constants/sampleData'

const Notifications = () => {
  return (
    <Dialog open maxWidth={"25rem"}>
      <Stack p={{ xs: "1rem", sm: "2rem" }}>
        <DialogTitle>Notifications</DialogTitle>
        {notifications.length > 0 ?
          <List>
            {notifications.map(({ sender, _id }) => (
              <NotificationItem key={_id} sender={sender} _id={_id} />
            ))}
          </List>
          :
          <Typography textAlign={"center"}>0 Notifications</Typography>
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
          src={avatar}
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