import React, { memo } from 'react'
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material'
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material'

const UserItem = ({ user, handlerAddFriend, handlerIsLoading, isAdded = false, styling }) => {

    const { name, avatar, _id } = user

    return (
        <ListItem>
            <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={"1rem"}
                width={"100%"}
                {...styling}
            >
                <Avatar
                    src={avatar}
                />
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
                    {name}
                </Typography>
                <IconButton
                    sx={{
                        bgcolor: isAdded ? "error.main" : "primary.main",
                        color: "white",
                        "&:hover": {
                            bgcolor: isAdded ? "error.dark" : "primary.dark",
                        },
                    }}
                    onClick={() => handlerAddFriend(_id)}
                    disabled={handlerIsLoading} >
                    {!isAdded ? <AddIcon /> : <RemoveIcon />}
                </IconButton>

            </Stack>
        </ListItem >
    )
}

export default memo(UserItem)