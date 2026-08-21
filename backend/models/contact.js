import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'passengers' }, 
        name: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        status: { type: String, enum: ['Unread', 'Read', 'Replied'], default: 'Unread' } // Admin track the status of the contact message
    },
    { timestamps: true }
);

const Contact = mongoose.model("contacts", contactSchema);

export default Contact;