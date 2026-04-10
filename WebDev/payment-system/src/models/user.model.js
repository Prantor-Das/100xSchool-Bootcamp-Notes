import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, "Name is required for creating an account" ],
        trim: true,
        unique: [ true, "Name already exists" ]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        trim: true,
        lowercase: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
    },
    password: {
        type: String,
        required: [ true, "Password is required for creating an account" ],
        minlength: [ 6, "password should contain more than 6 character" ],
        select: false, 
    },
    verified : {
        type : Boolean,
        default : false
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
}, {
    timestamps: true,
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return
    }
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    return

})

userSchema.methods.comparePassword = async function (password) {
    // console.log(password, this.password)
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema);
export default User;