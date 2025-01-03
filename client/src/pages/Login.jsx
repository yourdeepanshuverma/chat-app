import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backgroudGradiant } from "../components/constants/color";
import { CircleLoader } from "../components/Loaders";
import { userExists } from '../store/reducers/authSlice';
import { server } from '../components/constants/config';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoading = useSelector(({ auth }) => auth.isLoading);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { username: "", password: "" } });

    const handleLogin = async (data) => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        }
        try {
            const { data: userData } = await axios.post(`${server}/users/login`, data, config)
            dispatch(userExists(userData));
            toast.success(`Welcome back, ${userData.name}`);
            navigate("/");
        } catch (error) {
            reset();
            toast.error(error?.response?.data?.message);
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
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 1,
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
                        Login to your account
                    </Typography>
                    <Typography
                        variant="p"
                        sx={{
                            mt: 2,
                            textAlign: "center",
                            fontSize: 14,
                            lineHeight: 1.25
                        }}>
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-semibold transition-all duration-200 hover:underline"
                        >
                            Create a free account
                        </Link>
                    </Typography>
                </Stack>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(handleLogin)}
                >
                    <Stack spacing={2}>
                        {/* USERNAME */}
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
                            Welcome
                        </Button>
                    </Stack>
                </Box>
            </Paper>
            {isLoading && <CircleLoader />}
        </Box >
    )
}
