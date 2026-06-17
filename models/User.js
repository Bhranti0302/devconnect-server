const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [20, "Name cannot exceed 20 characters"],
    },

    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        lowercase: true, 
        trim: true,
        index: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },

    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
        match: [
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/,
            "Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters",
        ],
    },
    
    phone: {
        type: String,
        trim: true,
        default: null,
        unique: true,
        sparse: true,
        match: [
            /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
            "Please add a valid phone number",
        ],
    },
    
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline",
    },

    lastSeen: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
     
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
}

module.exports = mongoose.model("User", userSchema);