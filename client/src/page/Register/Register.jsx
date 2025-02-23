import React, { useState } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { Button, TextField, Card, CardContent, CardHeader, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"
import toast, { Toaster } from "react-hot-toast"
import { Info } from "@mui/icons-material"

const theme = createTheme()

export default function Register() {
    let navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        referralCode: "",
    })
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        referralCode: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [showInfo, setShowInfo] = useState(true)

    const validateName = (name) => {
        if (name.trim().length === 0) return "Name is required"
        if (name.trim().length < 2) return "Name must be at least 2 characters long"
        return ""
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (email.trim().length === 0) return "Email is required"
        if (!emailRegex.test(email)) return "Invalid email format"
        return ""
    }

    const validatePassword = (password) => {
        if (password.length === 0) return "Password is required"
        if (password.length < 8) return "Password must be at least 8 characters long"
        return ""
    }

    const validateReferralCode = (referralCode) => {
        if (referralCode.trim().length === 0) return "Referral code is required"
        if (referralCode.length < 36) return "Referral code must be at least 36 characters long"
        return ""
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })

        let errorMessage = ""
        switch (name) {
            case "name":
                errorMessage = validateName(value)
                break
            case "email":
                errorMessage = validateEmail(value)
                break
            case "password":
                errorMessage = validatePassword(value)
                break
            case "referralCode":
                errorMessage = validateReferralCode(value)
                break
            default:
                break
        }
        setErrors({ ...errors, [name]: errorMessage })
    }

    const handleGenerateReferral = () => {
        setFormData({ ...formData, referralCode: uuidv4() })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const nameError = validateName(formData.name)
        const emailError = validateEmail(formData.email)
        const passwordError = validatePassword(formData.password)

        if (nameError || emailError || passwordError) {
            setErrors({ name: nameError, email: emailError, password: passwordError })
            return
        }

        setIsLoading(true)
        try {
            const response = await axios.post("https://ngo-assesment-1.onrender.com/register", formData, { withCredentials: true })
            if (response.data) {
                toast.success("Account created successfully")
                navigate("/login")
            }
        } catch (error) {
            if (error?.response?.data?.message === "Email already registered. Login") {
                toast.error("Email already registered. Login")
            } else {
                console.error(error)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const isFormValid = () => {
        return (
            formData.name.trim() !== "" &&
            formData.email.trim() !== "" &&
            formData.password !== "" &&
            formData.referralCode !== "" &&
            Object.values(errors).every((error) => error === "")
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    bgcolor: "background.default",
                    position: "relative"
                }}
            >
                {showInfo && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            maxWidth: 300,
                            bgcolor: "white",
                            p: 2,
                            borderRadius: 2,
                            boxShadow: 3,
                            borderLeft: "4px solid blue",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Info sx={{ color: "blue" }} />
                        <Box sx={{ ml: 2, flex: 1 }}>
                            <h3 style={{ margin: 0 }}>Please Note</h3>
                            <p style={{ margin: 0, fontSize: "0.875rem", color: "gray" }}>
                                Initial loading may take a moment as this application is hosted on a free tier server.
                            </p>
                        </Box>
                        <button
                            onClick={() => setShowInfo(false)}
                            style={{
                                marginLeft: 8,
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                color: "gray",
                                fontSize: "1.5rem",
                            }}
                        >
                            ×
                        </button>
                    </Box>
                )}

                <Card sx={{ maxWidth: 400, width: "100%", m: 2 }}>
                    <CardHeader title="Register" subheader="Create a new account to get started." />
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Name"
                                name="name"
                                variant="outlined"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                required
                            />
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
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Referral"
                                name="referralCode"
                                variant="outlined"
                                value={formData.referralCode}
                                onChange={handleChange}
                                error={!!errors.referralCode}
                                helperText={errors.referralCode}
                            />
                            <Button
                                fullWidth
                                variant="outlined"
                                color="secondary"
                                sx={{ mt: 1, mb: 2 }}
                                onClick={handleGenerateReferral}
                            >
                                Generate Referral Code
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isLoading || !isFormValid()}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {isLoading ? "Registering..." : "Register"}
                            </Button>
                        </form>
                        <p>
                            Already have an account?{" "}
                            <a href="/login" style={{ color: "blue" }}>Login</a>
                        </p>
                    </CardContent>
                </Card>
                <Toaster position="top-right" reverseOrder={false} />
            </Box>
        </ThemeProvider>
    )
}
