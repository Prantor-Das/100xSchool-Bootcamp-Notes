import mongoose from "mongoose"
import config from "./config.js"
async function connectToDB() {
    await mongoose.connect(config.MONGO_URI)
        .then(() => {
            console.log("Server is connected to DB")
        })
        .catch(err => {
            console.log("Error connecting to DB", err)
            process.exit(1)
        })

}

export default connectToDB