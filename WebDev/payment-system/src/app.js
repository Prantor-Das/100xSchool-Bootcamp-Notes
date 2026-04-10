import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

import authRouter from "./routes/auth.routes.js"

app.use("/api/auth", authRouter)


app.get("/", (req, res) => {
    res.send("Ledger Service is up and running")
})

export default app