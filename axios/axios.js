const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();


const axiosInstance = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

module.exports = axiosInstance;