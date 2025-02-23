import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Button, TextField, Card, CardContent, CardHeader, Alert, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
const theme = createTheme();

export default function Login() {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.trim().length === 0) return "Email is required";
        if (!emailRegex.test(email)) return "Invalid email format";
        return "";
    };

    const validatePassword = (password) => {
        if (password.length === 0) return "Password is required";
        if (password.length < 8) return "Password must be at least 8 characters long";
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        let errorMessage = "";
        if (name === "email") errorMessage = validateEmail(value);
        if (name === "password") errorMessage = validatePassword(value);
        setErrors({ ...errors, [name]: errorMessage });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("https://ngo-assesment-1.onrender.com/login", formData, { withCredentials: true });
            if (response.data) {
                toast.success('Login successfully')
                navigate("/dashboard");
            }
        } catch (error) {
            if(error?.response?.data?.message === "No such client found"){
                toast.error('No such Client is found')
            }
           else{
            toast.error('Invalid credentials')
           }
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    bgcolor: "background.default",
                }}
            >
                <Card sx={{ maxWidth: 400, width: "100%", m: 2 }}>
                    <CardHeader title="Login" subheader="Enter your credentials to access your account." />
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                name="email"
                                type="email"
                                variant="outlined"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                required
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Password"
                                name="password"
                                type="password"
                                variant="outlined"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                required
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isLoading || errors.email || errors.password}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>

                        </form>
                        <p>Create a account?  <a href="/" style={{ color: "blue" }}>signup</a></p>
                    </CardContent>
                </Card>
              
            </Box>
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </ThemeProvider>
    );
}
