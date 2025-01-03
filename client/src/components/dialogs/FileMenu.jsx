import { useRef } from 'react'
import { Image as ImageIcon, VideoFile as VideoFileIcon, AudioFile as AudioFileIcon, FileUpload as FileUploadIcon } from '@mui/icons-material'
import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setFileMenu, setUploadingLoader } from '../../store/reducers/miscSlice'
import { toast } from 'react-toastify'
import { useSendAttachmentsMutation } from '../../store/api/apiSlice'

const FileMenu = ({ anchorE1, chatId }) => {
    const { isFileMenu } = useSelector(state => state.misc)
    const dispatch = useDispatch()

    const imageRef = useRef(null)
    const audioRef = useRef(null)
    const videoRef = useRef(null)
    const fileRef = useRef(null)

    const [sendAttachments] = useSendAttachmentsMutation()

    const selectImage = () => imageRef.current?.click()
    const selectAudio = () => audioRef.current?.click()
    const selectVideo = () => videoRef.current?.click()
    const selectFile = () => fileRef.current?.click()

    const handleClose = () => {
        dispatch(setFileMenu(false))
    }

    const fileChangeHandler = async (e, key) => {
        const files = Array.from(e.target.files);

        if (files.length <= 0) return;

        if (files.length > 5) return toast.error(`You can only send 5 ${key} at a time`);

        dispatch(setUploadingLoader(true));
        const toastId = toast.loading(`Sending ${key}...`);

        try {
            const myForm = new FormData();
            myForm.append("chatId", chatId);
            files.forEach((file) => myForm.append("files", file));

            dispatch(setFileMenu(false));

            const res = await sendAttachments(myForm);

            if (res.data) toast.update(toastId, {
                render: `${key} sent successfully`,
                type: "success",
                isLoading: false,
                autoClose: 2000
            });
            else toast.update(toastId, {
                render: `Error sending ${key}`,
                type: "error",
                isLoading: false,
                autoClose: 2000
            });

        } catch (error) {
            toast.update(toastId, {
                render: error.response?.data?.message || error.message,
                type: "error",
                isLoading: false,
                autoClose: 2000
            });
        } finally {
            dispatch(setUploadingLoader(false));
        }
    }

    return (
        <Menu anchorEl={anchorE1} open={isFileMenu} onClose={handleClose}>
            <div
                style={{
                    width: "10rem"
                }}
            >
                <MenuList>
                    <MenuItem onClick={selectImage}>
                        <Tooltip title="Image">
                            <ImageIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/gif"
                            multiple
                            style={{ display: "none" }}
                            ref={imageRef}
                            onChange={(e) => fileChangeHandler(e, "Images")}
                        />
                    </MenuItem>


                    <MenuItem onClick={selectAudio}>
                        <Tooltip title="Audio">
                            <AudioFileIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
                        <input
                            type="file"
                            accept="audio/mpeg, audio/wav"
                            multiple
                            style={{ display: "none" }}
                            ref={audioRef}
                            onChange={(e) => fileChangeHandler(e, "Audios")}
                        />
                    </MenuItem>


                    <MenuItem onClick={selectVideo}>
                        <Tooltip title="Video">
                            <VideoFileIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
                        <input
                            type="file"
                            accept="video/mp4, video/webm, video/ogg"
                            multiple
                            style={{ display: "none" }}
                            ref={videoRef}
                            onChange={(e) => fileChangeHandler(e, "Videos")}
                        />
                    </MenuItem>


                    <MenuItem onClick={selectFile}>
                        <Tooltip title="File">
                            <FileUploadIcon />
                        </Tooltip>
                        <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
                        <input
                            type="file"
                            accept="*"
                            multiple
                            style={{ display: "none" }}
                            ref={fileRef}
                            onChange={(e) => fileChangeHandler(e, "Files")}
                        />
                    </MenuItem>
                </MenuList>
            </div>
        </Menu>
    )
}

export default FileMenu