import auth from "../api/auth";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { CircleLoader } from "../components/Loaders";
import { setUser } from "../store/authSlice";
import LoginIcon from '@mui/icons-material/Login';
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { backgroudGradiant } from "../components/constants/color";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { email: "", password: "" } });

    const handleLogin = async (data) => {
        setIsLoading(true)
        const session = await auth.login(data)
        if (!session) {
            toast.error("Invalid Credentials");
            reset()
            setIsLoading(false)
        } else {
            dispatch(setUser(session))
            toast.success("Logged In");
            setIsLoading(false)
            navigate("/");
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
                        {/* EMAIL */}
                        <TextField
                            label="Email address"
                            placeholder="Enter your email"
                            type="email"
                            variant="standard"
                            focused
                            fullWidth
                            helperText={errors?.email?.message}
                            inputProps={{
                                ...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                        message: "Email address must be a valid address"
                                    }
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
