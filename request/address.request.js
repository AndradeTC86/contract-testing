import 'dotenv/config'
import axios from 'axios'
import data from '../data/address.payload.json'

const baseUrl = `http://localhost:${process.env.MOCK_PORT}`

export const addressList = async () => {
    return await axios.post(`${baseUrl}/graphql`, data, {
        headers:{
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjUwMzE5ODE4LCJleHAiOjE2NTA0OTI2MTh9.rzhvcqRBk3c0C09f3A08I9RRRseV_GGEpT2HRcU76C0',
           "Content-Type": 'application/json'
        }
    })
}

