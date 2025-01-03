import React from 'react'
import { Avatar, Stack, Typography } from '@mui/material'
import {
    Face as FaceIcon,
    AlternateEmail as UsernameIcon,
    CalendarMonth as CalernderIcon
} from '@mui/icons-material'
import moment from 'moment'

const Profile = ({ user }) => {
    return (
        <Stack spacing={"2rem"} alignItems={"center"}>
            <Avatar
                src={user?.avatar?.url}
                sx={{
                    width: 200,
                    height: 200,
                    objectFit: "contain",
                    marginBottom: "1rem",
                    border: "5px solid white"
                }}
            />
            <ProfileCard heading={"Bio"} text={user?.bio} />
            <ProfileCard icon={<UsernameIcon />} heading={"Username"} text={user?.username} />
            <ProfileCard icon={<FaceIcon />} heading={"Name"} text={user?.name} />
            <ProfileCard icon={<CalernderIcon />} heading={"Joined"} text={moment(user?.createdAt).fromNow()} />
        </Stack>
    )
}

const ProfileCard = ({ icon, heading, text }) => {
    return (
        <Stack
            direction={"row"}
            spacing={"1rem"}
            textAlign={"center"}
            color={"white"}
            alignItems={"center"}>
            {icon && icon}
            <Stack>
                <Typography variant="body1">{text}</Typography>
                <Typography color={"gray"} variant="caption">{heading}</Typography>
            </Stack>
        </Stack>
    )

}

export default Profile