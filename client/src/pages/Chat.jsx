import { IconButton, Stack, } from "@mui/material";
import AppLayout from "../components/layout/AppLayout";
import { useRef } from "react";
import MessageComponent from "../components/specific/MessageComponent";
import { sampleMessages } from "../components/constants/sampleData";
import { grey } from "../components/constants/color";
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import { InputIcon } from "../components/styles/StyledComponents";

const Chat = () => {
    const containerRef = useRef(null);

    const user = {
        name: "John Doe",
        _id: "2",
        avatar: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    }

    return (
        <>
            <Stack
                ref={containerRef}
                boxSizing={"border-box"}
                padding={"1rem"}
                spacing={"1rem"}
                bgcolor={grey}
                height={"90%"}
                sx={{
                    borderRadius: "1rem",
                    overflowX: "hidden",
                    overflowY: "auto",
                    flexDirection: "column-reverse"
                }}
            >
                {sampleMessages.map((i) => (
                    <MessageComponent key={i._id} user={user} message={i} />
                ))
                }
            </Stack>
            <form
                style={{
                    height: '10%'
                }}
            >
                <Stack
                    height={'100%'}
                    direction={"row"}
                    sx={{
                        position: "relative",
                        padding: "0.5rem",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <IconButton sx={{
                        position: 'absolute',
                        left: "1rem",
                    }}>
                        <AttachFileIcon />
                    </IconButton>
                    <InputIcon />
                    <IconButton>
                        <SendIcon />
                    </IconButton>
                </Stack>
            </form >
        </ >
    );
};

export default AppLayout()(Chat);