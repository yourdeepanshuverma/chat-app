import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import {
    AdminPanelSettings as AdminPanelSettingsIcon,
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Group as GroupIcon,
    Person as PersonIcon,
    Message as MessageIcon
} from '@mui/icons-material'
import { AdminSearchBar, AdminSearchBtn } from '../../components/styles/StyledComponents'
import moment from 'moment'
import { mateBlack } from '../../components/constants/color'
import { DoughnutChart, LineChart } from '../../components/specific/Charts'

const Dashboard = () => {

    const Appbar = (
        <Paper
            elevation={3}
            sx={{
                padding: '2rem',
                margin: '2rem 0',
                borderRadius: '1rem'
            }}
        >
            <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={'1rem'}>
                <AdminPanelSettingsIcon sx={{ fontSize: '3rem' }} />
                <AdminSearchBar placeholder='Type...' />
                <AdminSearchBtn>
                    <SearchIcon />
                </AdminSearchBtn>
                <Box flexGrow={1} />
                <Typography sx={{ display: { xs: 'none', md: 'block' } }}>{moment().format('dddd, D MMMM YYYY')}</Typography>
                <NotificationsIcon />
            </Stack>
        </Paper>
    )

    const Widgets = (
        <Stack
            direction={{ xs: 'column', sm: "row" }}
            spacing={'2rem'}
            justifyContent={'space-between'}
            alignItems={'center'}
            margin={'2rem 0'}
        >
            <Widget Icon={<PersonIcon />} title={'Users'} value={34} />
            <Widget Icon={<GroupIcon />} title={'Chats'} value={3} />
            <Widget Icon={<MessageIcon />} title={'Messages'} value={453} />
        </Stack>
    )

    return (
        <AdminLayout>
            <Container component={"main"}>
                {Appbar}
                <Stack spacing={'2rem'} direction={{ xs: 'column', lg: 'row' }} flexWrap={1} alignItems={{ xs: 'center', lg: 'stretch' }}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: '2rem 3.5rem',
                            borderRadius: '1rem',
                            width: '100%',
                            maxWidth: '45rem'

                        }}
                    >
                        <Typography margin={{ xs: '1rem 0', lg: "2rem 0" }} variant='h6'>Last Messages</Typography>
                        <LineChart value={[6, 9, 8, 1, 6, 55, 4]} />
                    </Paper>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: '1rem',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: "center",
                            width: { xs: "100%", sm: "50%" },
                            position: "relative",
                            maxWidth: '25rem',
                        }}
                    >
                        <DoughnutChart labels={["Single Chat", "Group Chat"]} value={[6, 4]} />
                        <Stack
                            position={"absolute"}
                            direction={"row"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            spacing={"0.5rem"}
                            width={"100%"}
                            height={"100%"}
                        >
                            <GroupIcon />
                            <Typography variant='h4'>Vs</Typography>
                            <PersonIcon />
                        </Stack>
                    </Paper>
                </Stack>
                <Stack>
                    <Paper>

                    </Paper>
                </Stack>
                {Widgets}
            </Container>
        </AdminLayout>
    )
}

const Widget = ({ title, value, Icon }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                padding: '2rem',
                margin: '2rem 0',
                borderRadius: '1.5rem',
                width: '20rem',

            }}
        >
            <Stack alignItems={'center'} spacing={'1rem'}>
                <Typography
                    sx={{
                        color: "rgba(0,0,0,0.7)",
                        borderRadius: "50%",
                        border: `5px solid ${mateBlack}`,
                        width: "5rem",
                        height: "5rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: 700
                    }}
                >{value}</ Typography>
                <Stack direction={'row'} spacing={"1rem"} alignItems={'center'}>
                    {Icon}
                    <Typography>{title}</Typography>
                </Stack>
            </Stack>
        </Paper >
    )
}

export default Dashboard