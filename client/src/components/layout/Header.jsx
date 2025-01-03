import {
    Add as AddIcon,
    Group as GroupIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Search as SearchIcon,
} from '@mui/icons-material'
import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import axios from 'axios'
import { lazy, Suspense, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { logout } from '../../store/reducers/authSlice'
import { resetNotificationCount } from '../../store/reducers/chatSlice'
import { setAddMembers, setMobile, setNewGroup, setNotification, setSearch } from '../../store/reducers/miscSlice'
import { server } from '../constants/config'

const Search = lazy(() => import("../dialogs/Search"))
const NewGroup = lazy(() => import("../dialogs/NewGroup"))
const Notifications = lazy(() => import("../dialogs/Notifications"))

const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isNewGroup, setIsNewGroup] = useState(false);

    const { isSearch, isAddMembers, isNotification } = useSelector(state => state.misc)
    const { notificationCount } = useSelector(state => state.chat)

    const handleMobile = () => dispatch(setMobile(true))
    const handleSearch = () => dispatch(setSearch(true))
    const handleNotifications = () => {
        dispatch(setNotification(true))
        dispatch(resetNotificationCount())
    }
    const handleAddMembers = () => dispatch(setAddMembers(true))
    const handleGroups = () => dispatch(setNewGroup(true))

    const navigateToGroup = () => navigate("/groups")
    const handlelogout = async () => {
        try {
            const data = await axios.get(`${server}/users/logout`, { withCredentials: true })
            toast.success(data?.data?.message)
            dispatch(logout())
            navigate("/login")
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }} maxHeight={"4rem"}>
                <AppBar
                    color='transparent'
                    position='static'
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            CHUGLI
                        </Typography>

                        <Box
                            sx={{
                                display: { xs: 'block', sm: 'none' },
                            }}
                        >
                            <IconButton onClick={handleMobile}>
                                <MenuIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{
                            flexGrow: 1
                        }} />
                        <Box>
                            <IconBtn
                                title={"Search User"}
                                icon={<SearchIcon />}
                                onClick={handleSearch}
                            />
                            <IconBtn
                                title={"Add Group"}
                                icon={<AddIcon />}
                                onClick={handleAddMembers}
                            />
                            <IconBtn
                                title={"Manage Groups"}
                                icon={<GroupIcon />}
                                onClick={navigateToGroup}
                            />
                            <IconBtn
                                title={"Notificatons"}
                                icon={<NotificationsIcon />}
                                onClick={handleNotifications}
                                value={notificationCount}
                            />
                            <IconBtn
                                title={"Logout"}
                                icon={<LogoutIcon />}
                                onClick={handlelogout}
                            />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            {isSearch &&
                <Suspense fallback={<Backdrop open />}>
                    <Search />
                </Suspense>
            }
            {isAddMembers &&
                <Suspense fallback={<Backdrop open />}>
                    <NewGroup />
                </Suspense>
            }
            {isNewGroup &&
                <Suspense fallback={<Backdrop open />}>
                    <Groups />
                </Suspense>
            }
            {isNotification &&
                <Suspense fallback={<Backdrop open />}>
                    <Notifications />
                </Suspense>
            }
        </>
    )
}

const IconBtn = ({ title, icon, onClick, value }) => {
    return (
        <Tooltip title={title}>
            <IconButton
                onClick={onClick}
            >
                {value ? (
                    <Badge badgeContent={value} color="error">
                        {icon}
                    </Badge>
                ) : (
                    icon
                )}
            </IconButton>
        </Tooltip>
    )
}

export default Header;