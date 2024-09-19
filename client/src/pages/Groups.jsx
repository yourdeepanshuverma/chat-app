import React, { lazy, memo, Suspense, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Backdrop, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { mateBlack, orange } from '../components/constants/color'
import {
    Add,
    Add as AddIcon,
    Delete as DeleteIcon,
    Done as DoneIcon,
    Edit as EditIcon,
    KeyboardBackspace as KeyboardBackspaceIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import { Link } from '../components/styles/StyledComponents';
import AvatarCard from '../components/shared/AvatarCard';
import { sameplechats, sampleUsers } from '../components/constants/sampleData';
import AddMembers from '../components/dialogs/AddMembers';
import UserItem from '../components/shared/UserItem';

const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDelete'))

const Groups = () => {



    const navigate = useNavigate()

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const [isEdit, setIsEdit] = useState(false)

    const [groupName, setGroupName] = useState("")
    const [groupNameUpdateValue, setGroupNameUpdateValue] = useState("")

    const [openAddFriend, setOpenAddFriend] = useState(false)
    const [openConfirmDelete, setOpenConfirmDelete] = useState(false)

    const chatId = useSearchParams()[0].get("chatId")

    const [members, setMembers] = useState(sampleUsers)
    const [selectedMembers, setSelectedMembers] = useState([])


    const removeMemberHandler = (id) => { }

    const navigateBack = () => {
        navigate("/")
    }

    const openMenu = () => {
        setIsMobileMenuOpen((prev) => !prev)
    }

    const handleMobileClose = () => setIsMobileMenuOpen(false)

    const updateGroupName = e => {
        setIsEdit(false)
    }

    const openAddFrindHandler = () => {
        setOpenAddFriend(true)
    }
    const closeAddFrindHandler = () => {
        setOpenAddFriend(false)
    }

    const openConfirmDeleteHandler = () => {
        setOpenConfirmDelete(true)
    }

    const closeConfirmDeleteHandler = () => {
        setOpenConfirmDelete(false)
    }


    useEffect(() => {
        if (chatId) {
            setGroupName(`Group Name ${chatId}`)
            setGroupNameUpdateValue(`Group Name ${chatId}`)
        }
    }, [chatId])

    const IconBtn = (
        <>
            {/* menu btn for desktop */}
            <IconButton
                sx={{
                    display: { xs: "block", sm: "none" },
                    position: "fixed",
                    top: "2rem",
                    right: "2rem",
                    color: "black",

                }}
                onClick={openMenu}
            >
                <MenuIcon fontSize='large' />
            </IconButton>

            {/* back btn for mobile */}
            <Tooltip title="Back">
                <IconButton
                    sx={{
                        position: "absolute",
                        top: "2rem",
                        left: "2rem",
                        color: "white",
                        bgcolor: mateBlack,
                        "&:hover": { bgcolor: "rgba(0,0,0,0.8)" }
                    }}
                    onClick={navigateBack}
                >
                    <KeyboardBackspaceIcon fontSize='large' />
                </IconButton>
            </Tooltip>
        </>
    )

    const GroupName = (
        <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={"1rem"}
            p={"3rem"}
        >
            {isEdit ?
                <>
                    <TextField
                        value={groupNameUpdateValue}
                        onChange={e => setGroupNameUpdateValue(e.target.value)}
                    />
                    <IconButton onClick={updateGroupName} >
                        <DoneIcon />
                    </IconButton>
                </> :
                <>
                    <Typography variant='h4'>{groupName}</Typography>
                    <IconButton onClick={() => setIsEdit(true)} >
                        <EditIcon />
                    </IconButton>
                </>}
        </Stack >
    )

    const ButtonGroup = (
        <Stack
            direction={{
                xs: "column-reverse",
                sm: "row"
            }}
            spacing={"1rem"}
            p={"3rem"}
        >
            <Button startIcon={<DeleteIcon />} color='error' onClick={openConfirmDeleteHandler} >
                Leave Group
            </Button>
            <Button startIcon={<AddIcon />} variant='contained' onClick={openAddFrindHandler} >
                Add Member
            </Button>

        </Stack>
    )

    return (
        <Grid container height={"100vh"}>
            <Grid
                item
                sm={4}
                sx={{
                    display: { xs: "none", sm: "block" },
                    bgcolor: orange,
                }}
            >
                <GroupsList myGroups={sameplechats} chatId={chatId} />
            </Grid>

            <Grid
                item
                xs={12}
                sm={8}
                height={"100vh"}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    padding: "1rem 3rem"
                }}
            >
                {IconBtn}
                {groupName && (
                    <>
                        {GroupName}

                        <Typography margin={"2rem"} alignSelf={"flex-start"} variant='body1'>Members</Typography>
                        <Stack
                            maxWidth={"45rem"}
                            width={"100%"}
                            boxSizing={"border-box"}
                            padding={{
                                xs: "0",
                                sm: "1rem",
                                md: "1rem 4rem"
                            }}
                            spacing={"2rem"}
                            height={"50vh"}
                            overflow={"auto"}
                        >
                            {members?.map((i) => (
                                <UserItem
                                    key={i._id}
                                    user={i}
                                    styling={{
                                        boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                                        padding: "1rem 2rem",
                                        borderRadius: "1rem"
                                    }}
                                    handlerAddFriend={removeMemberHandler}
                                    isAdded
                                />
                            ))}

                        </Stack>

                        {ButtonGroup}
                    </>)}

                {openAddFriend && <Suspense fallback={<Backdrop />}>
                    <AddMembers open={openAddFriend} handleClose={closeAddFrindHandler} />
                </Suspense>}

                {openConfirmDelete && <Suspense fallback={<Backdrop />}>
                    <ConfirmDeleteDialog open={openConfirmDelete} handleClose={closeConfirmDeleteHandler} />
                </Suspense>}

            </Grid>

            <Drawer sx={{
                display: { xs: "block", sm: "none" },
            }} open={isMobileMenuOpen} onClose={handleMobileClose}>
                <GroupsList w={"50vw"} myGroups={sameplechats} chatId={chatId} />
            </Drawer>
        </Grid >
    )
}

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
    return (
        <Stack width={w}
            sx={{
                height: "100vh",
                overflow: "auto"
            }}
        >
            {
                myGroups.length > 0 ?
                    myGroups.map((group) => (
                        <GroupListItem chatId={chatId} group={group} key={group._id} />))
                    : <Typography
                        p={"1rem"}
                        textAlign={"center"}
                    >
                        No groups
                    </Typography>
            }
        </Stack>
    )
}

const GroupListItem = memo(({ group, chatId }) => {

    const { avatar, name, _id } = group;

    return (
        <Link to={`?chatId=${_id}`} onClick={e => { if (chatId === _id) e.preventDefault() }} >
            <Stack p={"1rem"} direction={"row"} spacing={"1rem"} alignItems={"center"}>
                <AvatarCard avatar={avatar} max={2} />
                <Typography>{name}</Typography>
            </Stack>
        </Link>
    )
})

export default Groups