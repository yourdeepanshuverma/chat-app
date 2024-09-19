import { useNavigate } from 'react-router-dom'
import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import {
    Menu as MenuIcon,
    Add as AddIcon,
    Group as GroupIcon,
    Search as SearchIcon,
    Logout as LogoutIcon,
    Notifications as NotificationsIcon,
} from '@mui/icons-material'
import { orange } from '../constants/color'
import { lazy, Suspense, useState } from 'react'

const Search = lazy(() => import("../dialogs/Search"))
const NewGroup = lazy(() => import("../dialogs/NewGroup"))
const Notifications = lazy(() => import("../dialogs/Notifications"))

const Header = () => {

    const navigate = useNavigate()

    const [isMobile, setIsMobile] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [isNewGroup, setIsNewGroup] = useState(false);
    const [isNotification, setIsNotification] = useState(false);

    const handleMobile = () => setIsMobile((prev) => !prev)
    const handleSearch = () => setIsSearch((prev) => !prev)
    const handleNotifications = () => setIsNotification((prev) => !prev)
    const handleNewGroup = () => setIsNewGroup((prev) => !prev)

    const navigateToGroup = () => navigate("/groups")

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
                            <IconButton>
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
                                onClick={handleNewGroup}
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
                            />
                            <IconBtn
                                title={"Logout"}
                                icon={<LogoutIcon />}
                                onClick={handleMobile}
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
            {isNewGroup &&
                <Suspense fallback={<Backdrop open />}>
                    <NewGroup />
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

const IconBtn = ({ title, icon, onClick }) => {
    return (
        <Tooltip title={title}>
            <IconButton
                onClick={onClick}
            >
                {icon}
            </IconButton>
        </Tooltip>
    )
}

export default Header;