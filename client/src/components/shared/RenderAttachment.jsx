import React from 'react'
import { FileOpen as FileOpenIcon } from '@mui/icons-material';

const RenderAttachment = (file, url) => {
    switch (file) {
        case "video":

            return <video src={url} preload='none' width={"200px"} controls />;

        case "audio":
            return <audio src={url} preload='none' width={"200px"} controls />;

        case "image":
            return <img src={url} width={"200px"} alt="attachment" />;

        default:
            return <FileOpenIcon />
    }
}

export default RenderAttachment