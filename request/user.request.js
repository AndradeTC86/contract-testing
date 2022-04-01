import 'dotenv/config'
import axios from 'axios'
import data from '../data/payload.json'

const baseUrl = `http://localhost:${process.env.MOCK_PORT}`

export const userList = async () => {
    return await axios.post(`${baseUrl}/graphql`, data, {
        headers:{
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjQ4NzI1MjA0LCJleHAiOjE2NDg4OTgwMDR9.5zrmoHZonaqfU801rouO0cFA2kYnfSKsJnAaq190Q6o',
           "Content-Type": 'application/json'
        }
    })
}

