import React, { useState } from "react";
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Modal,
    Box,
    TextField,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const donationCauses = [
    {
        id: 1,
        title: "Help Children in Need",
        description: "Provide food, education, and shelter for underprivileged children.",
        image: "https://plus.unsplash.com/premium_photo-1682092585257-58d1c813d9b4?w=500&auto=format&fit=crop&q=60",
        amount: 50,
    },
    {
        id: 2,
        title: "Support Disaster Relief",
        description: "Aid families affected by natural disasters with essential supplies.",
        image: "https://media.istockphoto.com/id/524903696/photo/poor-indian-children-asking-for-food-india.webp?a=1&b=1&s=612x612&w=0&k=20&c=DqMSvVaXQxISjdvfNizw6F9ZkaCBMy42Yk6agRcJUE8=",
        amount: 100,
    },
    {
        id: 3,
        title: "Empower Women",
        description: "Support education and skill development programs for women.",
        image: "https://media.istockphoto.com/id/1318617341/photo/low-angle-view-group-of-volunteers-busy-working-by-arranging-vegetables-and-clothes-on.webp?a=1&b=1&s=612x612&w=0&k=20&c=BpJcZ42YnsP6KZmsdmEsArWBECDspsljlPfINuZ0l_U=",
        amount: 75,
    },
];

const Subdomain = () => {
    const [open, setOpen] = useState(false);
    const [selectedCause, setSelectedCause] = useState(null);
    const [donationAmount, setDonationAmount] = useState("");
    const [taxExemption, setTaxExemption] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        referralCode: "",
    });
    const [errors, setErrors] = useState({});
    const params = useParams();

    const handleOpen = (cause) => {
        setSelectedCause(cause);
        setDonationAmount(cause.amount);
        setFormData({
            fullName: "",
            email: "",
            phone: "",
            referralCode: params.referalid || "",
        })
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({
            fullName: "",
            email: "",
            phone: "",
            referralCode: params.referalid || "",
        });
        setErrors({});
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
        if (!formData.email.trim()) newErrors.email = "Email Address is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
        if (!formData.referralCode.trim()) newErrors.referralCode = "Referral Code is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (donationAmount) => {
        if (validateForm()) {
            let data = {
                amount: donationAmount
            }
            try {
                const { data: { key } } = await axios.get('http://localhost:8080/api/getKey')
                console.log(key)
                const res = await axios.post(`http://localhost:8080/checkout`, data);
                console.log(res.data.data.id)
                if (res.data) {
                    var options = {
                        key,
                        amount: res.data.data.amount,
                        currency: "INR",
                        name: "Ngo",
                        description: "Test Transaction",
                        image: "https://media.istockphoto.com/id/1207168332/photo/adult-and-children-hands-holding-paper-family-cutout-family-home-foster-care-homeless-charity.webp?a=1&b=1&s=612x612&w=0&k=20&c=naLilpoWBWb-X5mC2Mi36NAZtAs9fN1ib64Xp52hHGY=",
                        order_id: res.data.data.id,
                        handler: async (response) => {
                            const verificationData = {
                                ...response,
                                amount: donationAmount,
                                name: formData.fullName,
                                email: formData.email,
                                referralCode: formData.referralCode,
                            }
                            try {
                                const verificationRes = await axios.post(
                                    `http://localhost:8080/verify`,
                                    verificationData,
                                )
                                if (verificationRes.data.success) {
                                    console.log("Payment verified and stored successfully")


                                    window.location.href = `/paymentsuccess?reference=${verificationRes.data.paymentId}`
                                } else {
                                    console.error("Payment verification failed")

                                }
                            } catch (error) {
                                console.error("Verification error:", error)

                            }
                        },
                        prefill: {
                            name: formData.fullName,
                            email: formData.email,
                            contact: formData.phone
                        },
                        notes: {
                            address: "Razorpay Corporate Office"
                        },
                        theme: {
                            "color": "#3399cc"
                        }
                    };
                    const rzp1 = new window.Razorpay(options);
                    rzp1.open();
                    console.log("Form submitted:", formData);

                    handleClose();
                }

            }
            catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <Container maxWidth="md" style={{ textAlign: "center", marginTop: "30px" }}>
            <Typography variant="h4" gutterBottom>
                Support a Cause
            </Typography>

            <Grid container spacing={3}>
                {donationCauses.map((cause) => (
                    <Grid item xs={12} sm={6} md={4} key={cause.id}>
                        <Card>
                            <CardMedia component="img" height="200" image={cause.image} alt={cause.title} />
                            <CardContent>
                                <Typography variant="h6">{cause.title}</Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    {cause.description}
                                </Typography>
                                <Button variant="contained" color="primary" onClick={() => handleOpen(cause)} sx={{ mt: 1 }}>
                                    Donate ₹{cause.amount}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Donate to {selectedCause?.title}
                    </Typography>

                    <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Reference Code"
                        name="referralCode"
                        value={formData.referralCode}
                        onChange={handleChange}
                        error={!!errors.referralCode}
                        helperText={errors.referralCode}
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />

                    <TextField
                        fullWidth
                        label="Donation Amount (₹)"
                        type="number"
                        margin="normal"
                        value={donationAmount}
                        InputProps={{ readOnly: true }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={taxExemption}
                                onChange={(e) => setTaxExemption(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Do you wish to receive tax exemption?"
                    />

                    <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} onClick={() => handleSubmit(donationAmount)}>
                        Donate
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
};

export default Subdomain;
