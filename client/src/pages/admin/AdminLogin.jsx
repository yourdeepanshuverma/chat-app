import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from "react-router-dom";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { CircleLoader } from "../../components/Loaders"
import { backgroudGradiant } from '../../components/constants/color';

const AdminLogin = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { secretkey: "" } });

    const handleLogin = async (data) => {
        setIsLoading(true)
        const session = "await auth.login(data)"
        if (!session) {
            toast.error("Invalid Credentials");
            reset()
            setIsLoading(false)
            return;
        }

        dispatch(setUser(session))
        toast.success("Logged In");
        setIsLoading(false)
        navigate("/admin/dashboard");

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
                    <Typography>
                        Admin Login
                    </Typography>
                </Stack>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit(handleLogin)}
                >
                    <Stack spacing={2}>
                        {/* Secretkey */}
                        <TextField
                            label="secretkey"
                            type="password"
                            placeholder="Secret Key"
                            variant="standard"
                            focused
                            fullWidth
                            helperText={errors?.secretkey?.message}
                            inputProps={{
                                ...register("secretkey")
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

export default AdminLogin