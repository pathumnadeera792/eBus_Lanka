import Operator from "../models/Operator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create Operator (Registration)
export function createOperator(req, res) {
    const passwordHash = bcrypt.hashSync(req.body.password, 10);

    const operatorData = {
        fullName: req.body.fullName,
        companyName: req.body.companyName,
        email: req.body.email,
        brNumber: req.body.brNumber,
        dob: req.body.dob,
        userName: req.body.userName,
        address: req.body.address,
        phone: req.body.phone,
        gender: req.body.gender,
        bankAccount: req.body.bankAccount,
        password: passwordHash,
        // isApproved admin approval
        isApproved: false 
    };

    const operator = new Operator(operatorData);
    
    operator.save().then(
        () => {
            res.status(201).json({
                message: "Operator registered successfully. Please wait for Super Admin approval."
            })
        }
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error registering operator",
                error: err.message
            })
        }
    )
}


// Login Operator
export function loginOperator(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    Operator.findOne({ email: email }).then(
        (operator) => {
            if (operator == null) {
                res.status(404).json({
                    message: "Operator not found"
                })
            } else {
                // Super Admin approve check
                if (!operator.isApproved) {
                    return res.status(403).json({
                        message: "Your account is not approved yet. Please contact Super Admin."
                    });
                }

                const isPasswordCorrect = bcrypt.compareSync(password, operator.password)
                
                if (isPasswordCorrect) {
                    const token = jwt.sign( {
                            id: operator._id,
                            fullName: operator.fullName,
                            userName: operator.userName,
                            email: operator.email,
                            role: operator.role
                        }, process.env.JWT_SECRET, { expiresIn: "1d" });

                    res.json({
                        message: "Login successful",
                        token: token,
                        user: {
                            fullName: operator.fullName,
                            companyName: operator.companyName,
                            role: operator.role
                        }
                    })
                } else {
                    res.status(403).json({
                        message: "Invalid password"
                    })
                }
            }
        }   
    ).catch(
        (err) => {
            res.status(500).json({
                message: "Error logging in",
                error: err.message
            })
        }
    )
}