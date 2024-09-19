import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Box, Typography } from '@mui/material'

const Home = () => {
    return (
        <Box sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor:"darkgray"
        }} >
            <Typography p={"2rem"} textAlign={"center"}>
                Select a friend to chat
            </Typography>
        </Box>
    )
}

export default AppLayout()(Home)