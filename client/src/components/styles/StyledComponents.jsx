import { styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { mateBlack } from "../constants/color";

export const VisuallyHiddenInput = styled('input')({
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
});

export const Link = styled(LinkComponent)`
    text-decoration: none;
    color: black;
    border-bottom: 2px solid black;
    border-radius: 8px;
    transition: all 0.1s ease-in-out;
    &:hover {
     background-color: rgba(0, 0, 0, 0.4);
    }
`

export const InputBox = styled("input")`
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 3rem ;
    border-radius: 1.5rem;
    background: gray;
`

export const AdminSearchBar = styled("input")`
padding: 1rem 2rem;
width: 20vmax;
border: none;
outline: none;
border-radius: 1.5rem;
background-color: #f1f1f1;
font-size: 1.1rem;
`

export const AdminSearchBtn = styled("button")`
    padding: 1rem;
    border: none;
    outline: none;
    border-radius: 50%;
    color: white;
    background-color: ${mateBlack};
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
    color: white;
    background-color: #3d3d3d;
    }
`