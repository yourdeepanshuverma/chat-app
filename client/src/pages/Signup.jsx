import axios from "axios";
import { toast } from "react-toastify"
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CircleLoader } from "../components/Loaders.jsx";
import LoginIcon from '@mui/icons-material/Login';
import { Link, useNavigate } from "react-router-dom";
import { CameraAlt as CameraAltIcon, Image } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents.jsx";
import { Avatar, Box, Button, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { backgroudGradiant } from "../components/constants/color.js";
import { server } from "../components/constants/config.js";
import { userExists } from '../store/reducers/authSlice.js'

export default function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading } = useSelector(({ auth }) => auth.isLoading)
    const [preview, setPreview] = useState("")

    const { register, handleSubmit, watch, reset, formState: { errors }, } = useForm();

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "pic") {
                setPreview(URL.createObjectURL(value?.pic[0]))
            }
            return () => subscription.unsubscribe();
        });
    }, [watch])

    const handleSignup = async (data) => {
        const form = new FormData();
        form.append("name", data.name);
        form.append("username", data.username);
        form.append("password", data.password);
        form.append("avatar", data.avatar[0]);
        form.append("bio", data.bio);


        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        };

        try {
            const { data } = await axios.post(`${server}/users/register`, form, config)
            toast.success("User registered successfully")
            dispatch(userExists())
            navigate("/")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                px: {
                    xs: 4,
                    sm: 6,
                    lg: 8,
                },
                py: {
                    xs: 10,
                    sm: 16,
                    lg: 24,
                },
                backgroundImage: backgroudGradiant
            }}>
            <Paper
                elevation={8}
                sx={{
                    mx: "auto",
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 1,
                    width: "100%",
                    maxWidth: {
                        lg: 300,
                        xl: 600,
                    },

                }}>
                <Stack>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: 24,
                            fontWeight: "bold",
                            textAlign: "center",
                            lineHeight: 1.25,
                        }}>
                        Signup to your account
                    </Typography>
                    <Typography
                        variant="p"
                        sx={{
                            mt: 2,
                            textAlign: "center",
                            fontSize: 14,
                            lineHeight: 1.25
                        }}>
                        Already have an account?{" "}
                        <Link
                            to="/Login"
                            className="font-semibold transition-all duration-200 hover:underline"
                        >
                            Login
                        </Link>
                    </Typography>
                </Stack>
                <Box
                    width={"100%"}
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(handleSignup)}
                >
                    <Stack gap={2}>

                        {/* AVATAR */}
                        <Stack sx={{
                            position: "relative",
                            m: "auto",
                            width: "10rem",
                        }}>
                            <Avatar
                                sx={{
                                    width: "10rem",
                                    height: "10rem",
                                    objectFit: "contain",
                                }}
                                src={preview}
                            />
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    bottom: "0",
                                    right: "0",
                                    color: "white",
                                    bgcolor: "rgba(0,0,0,0.5)",
                                    ":hover": {
                                        bgcolor: "rgba(0,0,0,0.7)",
                                    },
                                }}
                                component="label">
                                < CameraAltIcon />
                                <VisuallyHiddenInput accept={"image/png, image/jpg, image/jpeg,"} multiple={false} type="file" {...register("avatar")} />

                            </IconButton>
                        </Stack>

                        {/* NAME */}
                        <TextField
                            label="Name"
                            placeholder="Enter your full name"
                            helperText={errors?.name?.message}
                            variant="standard"
                            focused
                            fullWidth
                            inputProps={{
                                ...register("name", {
                                    required: "Name is required",
                                })
                            }}
                        />

                        {/* EMAIL */}
                        <TextField
                            label="Username"
                            placeholder="Enter your username"
                            type="text"
                            variant="standard"
                            focused
                            fullWidth
                            helperText={errors?.username?.message}
                            inputProps={{
                                ...register("username", {
                                    required: "Username is required",
                                })
                            }}
                        />

                        {/* BIO */}
                        <TextField
                            label="Bio"
                            placeholder="Enter your bio"
                            type="text"
                            variant="standard"
                            focused
                            fullWidth
                            helperText={errors?.bio?.message}
                            inputProps={{
                                ...register("bio", {
                                    required: "Bio is required",
                                })
                            }}
                        />

                        {/* PASSWORD */}
                        <TextField
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            variant="standard"
                            focused
                            fullWidth
                            helperText={errors?.password?.message}
                            inputProps={{
                                ...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters long"
                                    }
                                })
                            }}
                        />

                        {/* SUBMIT */}
                        <Button
                            type="submit"
                            startIcon={<LoginIcon />}
                            disabled={isLoading}
                        >
                            Join us
                        </Button>
                    </Stack>
                </Box>
            </Paper>
            {isLoading && <CircleLoader />}
        </Box >
    )

}
