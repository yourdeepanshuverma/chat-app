import { Navigate, useLocation } from 'react-router-dom'
import React, { useState } from 'react'
import { Box, Drawer, Grid, IconButton, Stack, styled, Typography } from '@mui/material'
import {
    Close as CloseIcon,
    Dashboard as DashboardIcon,
    ExitToApp as ExitToAppIcon,
    Groups as GroupsIcon,
    ManageAccounts as ManageAccountsIcon,
    Menu as MenuIcon,
    Message as MessageIcon
} from '@mui/icons-material'
import { Link as LinkComponent } from 'react-router-dom'
import { mateBlack } from '../constants/color'

const adminRoutes = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <DashboardIcon />,
    },
    {
        name: "Users",
        path: "/admin/users",
        icon: <ManageAccountsIcon />,
    },
    {
        name: "Chats",
        path: "/admin/chats",
        icon: <GroupsIcon />,
    },
    {
        name: "Messages",
        path: "/admin/messages",
        icon: <MessageIcon />,
    },
]

const Link = styled(LinkComponent)`
    text-decoration: none;
    color: black;
    font-size: 1.5rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    &:hover {
        background-color: #f5f5f5
    };
    &.active {
        background-color: #f5f5f5
    };
`

const isAdmin = true

const SideBar = ({ w = '100%' }) => {
    const location = useLocation();

    const handleLogout = () => { };

    return (
        <Stack width={w} direction={'column'} p={{ xs: '0.5rem', md: '3rem' }} spacing={{ xs: '1rem', md: '3rem' }} >
            <Typography variant='h5' textAlign={'center'} textTransform={'uppercase'}>Chugli</Typography>
            <Stack direction={"column"} spacing={'1rem'}>
                {adminRoutes.map((route) => (
                    <Link key={route.path} to={route.path}
                        sx={
                            location.pathname === route.path
                            && {
                                backgroundColor: mateBlack,
                                color: 'white'
                                , ':hover': {
                                    backgroundColor: mateBlack,
                                    color: 'white'
                                }
                            }
                        }>
                        <Stack direction={'row'} alignItems={"center"} spacing={'1rem'}>
                            {route.icon}
                            <Typography>{route.name}</Typography>
                        </Stack>
                    </Link>
                ))}
                <Link onClick={handleLogout}>
                    <Stack direction={'row'} alignItems={"center"} spacing={'1rem'}>
                        <ExitToAppIcon />
                        <Typography>Logout</Typography>
                    </Stack>
                </Link>
            </Stack>
        </Stack >
    )
}

const AdminLayout = ({ children }) => {

    const [isMobile, setIsMobile] = useState(false)
    const handleClose = () => setIsMobile(false)

    const handleMobile = () => {
        setIsMobile((prev) => !prev)
    }

    if (!isAdmin) return <Navigate to="/admin-login" /> // Redirect to home page if user is not admin

    return (
        <Grid container>
            <Box
                sx={{
                    display: {
                        xs: "block",
                        md: "none",
                    },
                    position: "fixed",
                    top: "1rem",
                    right: "1rem",
                }}
            >
                <IconButton onClick={handleMobile}>
                    {isMobile ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
            </Box>
            <Grid item display={{ xs: "none", md: "block" }} md={4} lg={3}>
                <SideBar />
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
                {children}
            </Grid>
            <Drawer open={isMobile} onClose={handleClose}>
                <SideBar w="50vw" />
            </Drawer>
        </Grid>
    )
}

export default AdminLayout