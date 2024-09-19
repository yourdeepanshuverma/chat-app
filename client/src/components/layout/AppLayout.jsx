import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Grid, Paper } from '@mui/material'
import Title from '../shared/Title.jsx'
import ChatList from '../specific/ChatList.jsx'
import Profile from '../specific/Profile.jsx'
import { sameplechats } from '../constants/sampleData.js'
import { useParams } from 'react-router-dom'

const AppLayout = () => (WrappedComponent) => {
    return (props) => {

        const { chatId } = useParams()

        const handleChatDelete = (e, _id,) => { }

        return (
            <>
                <Title />
                <Header />
                <Grid container height={"calc(100vh - 4rem)"}>
                    <Grid
                        item
                        sm={4}
                        md={3}
                        sx={{
                            display: { xs: "none", sm: "block" },
                            overflowY: 'scroll',
                            '&::-webkit-scrollbar': {
                                display: 'none'
                            }
                        }}
                        height={"100%"}
                    >
                        <ChatList chats={sameplechats} chatId={chatId} handleChatDelete={handleChatDelete} />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={8}
                        md={5}
                        lg={6}
                        height={"100%"}
                        padding={"1rem"}
                        >
                        <WrappedComponent {...props} />
                    </Grid>
                    <Grid
                        item
                        md={4}
                        lg={3}
                        sx={{
                            display: { xs: "none", md: "block" },
                            p: 2,
                            bgcolor: "rgba(0,0,0,0.85)"
                        }}
                        height={"100%"}>
                        <Profile />
                    </Grid>
                </Grid>
                {/* <Footer /> */}
            </>
        )
    }
}

export default AppLayout