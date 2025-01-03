import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Done as DoneIcon,
    Edit as EditIcon,
    KeyboardBackspace as KeyboardBackspaceIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import { Backdrop, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import React, { lazy, memo, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mateBlack, orange } from '../components/constants/color';
import AddMembers from '../components/dialogs/AddMembers';
import AvatarCard from '../components/shared/AvatarCard';
import UserItem from '../components/shared/UserItem';
import { Link } from '../components/styles/StyledComponents';
import { useAsyncMutation, useError } from '../hooks/hook';
import { useChatDetailsQuery, useLeaveGroupMutation, useMyGroupsQuery, useRemoveMemberMutation, useRenameGroupMutation } from '../store/api/apiSlice';
import { setAddMembers, setDeleteChat } from '../store/reducers/miscSlice';

const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDelete'))

const Groups = () => {

    const navigate = useNavigate()
    const dipatch = useDispatch()
    const { isAddMembers, isDeleteChat } = useSelector(state => state.misc)

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [groupAdmin, setGroupAdmin] = useState("")
    const [groupName, setGroupName] = useState("")
    const [groupNameUpdateValue, setGroupNameUpdateValue] = useState("")
    const [members, setMembers] = useState([])

    const chatId = useSearchParams()[0].get("chatId")

    const myGroups = useMyGroupsQuery("")
    const chatDetails = useChatDetailsQuery({ chatId, populate: true }, { skip: !chatId });
    const [updateGroup, isUpdateGroupLoading] = useAsyncMutation(useRenameGroupMutation)

    const [removeMember, isRemoveMemberLoading] = useAsyncMutation(useRemoveMemberMutation)
    const [leaveGroup, isLeaveGroupLoading] = useAsyncMutation(useLeaveGroupMutation)


    const removeMemberHandler = (id) => {
        removeMember("Removing Member...", { chatId, userId: id })
    }

    const navigateBack = () => {
        navigate("/")
    }

    const openMenu = () => {
        setIsMobileMenuOpen((prev) => !prev)
    }

    const handleMobileClose = () => setIsMobileMenuOpen(false)

    const updateGroupName = () => {
        setIsEdit(false)
        updateGroup("Updating Group Name...", { chatId, name: groupNameUpdateValue })
    }

    const openAddFrindHandler = () => {
        dipatch(setAddMembers(true))
    }
    const closeAddFrindHandler = () => {
        dipatch(setAddMembers(false))
    }

    const openConfirmDeleteHandler = () => {
        dipatch(setDeleteChat(true))
    }

    const closeConfirmDeleteHandler = () => {
        dipatch(setDeleteChat(false))
    }

    const confirmDelete = () => {
        leaveGroup("Leaving Group...", chatId)
        navigate("/groups")
        closeConfirmDeleteHandler()
    }

    useEffect(() => {
        if (chatId) {
            const group = chatDetails?.data?.chat

            setGroupName(`${group?.name}`)
            setGroupNameUpdateValue(`${group?.name}`)
            setGroupAdmin(group?.creator?.name)
            setMembers(group?.members)
        }

        return () => {
            setGroupName("")
            setGroupNameUpdateValue("")
            setGroupAdmin("")
            setMembers([])
        }
    }, [chatDetails?.data])


    const errors = [{
        isError: myGroups.isError,
        error: myGroups.error,
    }, {
        isError: chatDetails.isError,
        error: chatDetails.error
    },
    {
        isError: updateGroup.isError,
        error: updateGroup.error
    },
    {
        isError: removeMember.isError,
        error: removeMember.error
    }]

    useError(errors)

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
                    <IconButton onClick={updateGroupName} disabled={isUpdateGroupLoading} >
                        <DoneIcon />
                    </IconButton>
                </> :
                <>
                    <Typography variant='h4'>{groupName}</Typography>
                    <IconButton onClick={() => setIsEdit(true)} disabled={isUpdateGroupLoading} >
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
            p={"2rem"}
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
                <GroupsList myGroups={myGroups?.data?.chats} chatId={chatId} />
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
                {chatDetails.isSuccess && (
                    <>
                        {GroupName}

                        <Typography margin={"1rem"} alignSelf={"flex-center"} variant='h5'>Members</Typography>
                        <Typography margin={"1rem"} alignSelf={"flex-center"} variant='body1'>Admin: {groupAdmin}</Typography>
                        <Stack
                            maxWidth={"45rem"}
                            width={"100%"}
                            boxSizing={"border-box"}
                            padding={{
                                xs: "0",
                                sm: "1rem",
                                md: "1rem 4rem"
                            }}
                            spacing={"1rem"}
                            height={"50vh"}
                            overflow={"auto"}
                        >
                            {isRemoveMemberLoading ? <CircularProgress /> :
                                members?.map((i) => (
                                    <UserItem
                                        key={i._id}
                                        user={i}
                                        styling={{
                                            boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                                            padding: "1rem 2rem",
                                            borderRadius: "1rem"
                                        }}
                                        handlerAddFriend={removeMemberHandler}
                                        handlerIsLoading={isRemoveMemberLoading}
                                        isAdded
                                    />
                                ))}

                        </Stack>

                        {ButtonGroup}
                    </>)}

                {isAddMembers && <Suspense fallback={<Backdrop />}>
                    <AddMembers chatId={chatId} handleClose={closeAddFrindHandler} />
                </Suspense>}

                {isDeleteChat && <Suspense fallback={<Backdrop />}>
                    <ConfirmDeleteDialog confirmDelete={confirmDelete} handleClose={closeConfirmDeleteHandler} disabled={isLeaveGroupLoading} />
                </Suspense>}

            </Grid>

            <Drawer sx={{
                display: { xs: "block", sm: "none" },
            }} open={isMobileMenuOpen} onClose={handleMobileClose}>
                <GroupsList w={"50vw"} myGroups={myGroups?.data?.chats} chatId={chatId} />
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
        <Link to={`?chatId=${_id}`} sx={{ backgroundColor: `${chatId === _id ? "rgba(0, 0, 0, 0.4)" : "transparant"}` }} onClick={e => { if (chatId === _id) e.preventDefault() }} >
            <Stack p={"1rem"} direction={"row"} spacing={"1rem"} alignItems={"center"}>
                <AvatarCard avatar={avatar} max={2} />
                <Typography>{name}</Typography>
            </Stack>
        </Link >
    )
})

export default Groups