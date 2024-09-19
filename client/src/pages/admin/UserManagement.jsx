import { Avatar, Stack, } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { dashboardData } from '../../components/constants/sampleData'


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
        width: 200
    },
    {
        field: 'username',
        headerName: 'Username',
        headerClassName: 'table-header',
        width: 200
    },
    {
        field: 'friends',
        headerName: 'Friends',
        headerClassName: 'table-header',
        width: 150
    },
    {
        field: 'groups',
        headerName: 'Groups',
        headerClassName: 'table-header',
        width: 150
    },
]

const UserManagement = () => {
    const [rows, setRows] = useState([])

    useEffect(() => {
        setRows(dashboardData.users.map((i) => ({ ...i, id: i._id })))
    }, [])


    return (
        <AdminLayout>
            <Table heading={'All Users'} columns={columns} rows={rows} />
        </AdminLayout>
    )
}

export default UserManagement