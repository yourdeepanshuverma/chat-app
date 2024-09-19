import React from 'react'
import { Avatar, Stack, Typography } from '@mui/material'
import {
    Face as FaceIcon,
    AlternateEmail as UsernameIcon,
    CalendarMonth as CalernderIcon
} from '@mui/icons-material'
import moment from 'moment'

const Profile = () => {
    return (
        <Stack spacing={"2rem"} alignItems={"center"}>
            <Avatar
                sx={{
                    width: 200,
                    height: 200,
                    objectFit: "contain",
                    marginBottom: "1rem",
                    border: "5px solid white"
                }}
            />
            <ProfileCard icon={<FaceIcon />} heading={"Username"} text={"ufffcoding"} />
            <ProfileCard icon={<UsernameIcon />} heading={"Name"} text={"Deepanshu Verma"} />
            <ProfileCard icon={<CalernderIcon />} heading={"Joined"} text={moment("2003-10-09").fromNow()} />
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