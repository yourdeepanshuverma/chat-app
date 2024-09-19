import { Avatar, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { dashboardData } from '../../components/constants/sampleData'
import AdminLayout from '../../components/layout/AdminLayout'
import AvatarCard from '../../components/shared/AvatarCard'
import Table from '../../components/shared/Table'

const columns = [
    {
        field: 'id',
        headerName: 'ID',
        headerClassName: 'table-header',
        width: 200
    },
    {
        field: 'avatar',
        headerName: 'Avatar',
        headerClassName: 'table-header',
        width: 150,
        renderCell: (params) => (
            <Stack direction={'row'} alignItems={'center'} height={'100%'}>
                <Avatar alt={params.row.name} src={params.row.avatar} />
            </Stack>
        )
    },
    {
        field: 'name',
        headerName: 'Name',
        headerClassName: 'table-header',
        width: 300
    },
    {
        field: 'members',
        headerName: 'Members',
        headerClassName: 'table-header',
        width: 400,
        renderCell: (params) => (
            <Stack direction={'row'} alignItems={'center'} height={'100%'}>
                <AvatarCard avatar={params.row.members} max={100} />
            </Stack>
        )
    },
    {
        field: 'totalMessages',
        headerName: 'Total Messages',
        headerClassName: 'table-header',
        width: 120
    },
    {
        field: 'creator',
        headerName: 'Created By',
        headerClassName: 'table-header',
        width: 250,
        renderCell: (params) => (
            <Stack direction={'row'} alignItems={'center'} height={'100%'} spacing={'1rem'}>
                <Avatar src={params.row.creator.avatar} alt={params.row.creator.name} />
                <span>{params.row.creator.name}</span>
            </Stack>
        )
    },
]

const ChatManagement = () => {
    const [rows, setRows] = useState([])

    useEffect(() => {
        setRows(dashboardData.chats.map((i) => ({ ...i, id: i._id, members: i.members.map((i) => i.avatar) })))
    }, [])


    return (
        <AdminLayout>
            <Table heading={'All Chats'} rows={rows} columns={columns} />
        </AdminLayout>
    )
}

export default ChatManagement