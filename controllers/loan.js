const Loan = require("../models/loan")
const { validationResult } = require("express-validator")
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('express-jwt');

const create = (req, res) => {
    const { id , borrowerEmail } = req.body

    Loan.findOne({ id }, (err, loan) => {
        if (loan) {
            res.status(400).json({
                message: "Loan Already Exists"
            })
        }

        if (err || !loan) {

            const loan = new Loan(req.body)

            loan.save((e, loan) => {
                if (e) {
                    return res.status(400).json({
                        error: "Loan Already exits",
                    })
                }

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'a.antsapps@gmail.com',
                        pass: 'qybdrvmddxnivpqu'
                    }
                });
                const mailOptions = {
                    from: 'a.antsapps@gmail.com',
                    to: borrowerEmail,
                    subject: 'Successsfully Applied for loan',
                    text: `You have sucessfully applied for loan . Your loan id is ${id} . 
                    Use this id to track status of loan .`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        res.json({
                            error: error
                        })
                    }
                })

                return res.status(200).json({
                    message: "Successfully Applied for Loan",
                    loan
                })
            })
        }
    })

}


const modify = (req, res) => {

    const { id, loanTenure, interestRate , borrowerEmail } = req.body

    Profile.updateOne({ userName }, {
        $set: {
            "id": id,
            "loanTenure": loanTenure,
            "interestRate": interestRate
        }
    }, (err, response) => {
        if (response) {

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'a.antsapps@gmail.com',
                    pass: 'qybdrvmddxnivpqu'
                }
            });
            const mailOptions = {
                from: 'a.antsapps@gmail.com',
                to: borrowerEmail,
                subject: 'Successsfully Updated Loan Details',
                text: `You have sucessfully updated your loan details having id ${id} . 
                Use this id to track status of loan .`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.json({
                        error: error
                    })
                }
            })

            return res.status(200).json({
                message: "Loan Details Updated Successfully",
                response
            })
        }

        if (err || !response) {
            res.status(400).json({
                message: "Such Loan Does Not Exists"
            })
        }
    })
}

const accept = (req, res) => {

    const { id, lenderUserName, lenderEmail, status , borrowerEmail , borrowerUserName } = req.body

    Profile.updateOne({ userName }, {
        $set: {
            "id": id,
            "lenderUserName": lenderUserName,
            "lenderEmail": lenderEmail,
            "status": status
        }
    }, (err, response) => {
        if (response) {

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'a.antsapps@gmail.com',
                    pass: 'qybdrvmddxnivpqu'
                }
            });
            const mailOptions = {
                from: 'a.antsapps@gmail.com',
                to: borrowerEmail,
                subject: 'Your loan got accepted',
                text: `Your loan with id ${id} got accepted by ${lenderUserName}. You can view further details on the app .`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.json({
                        error: error
                    })
                }
            })

            const mailOptions2 = {
                from: 'a.antsapps@gmail.com',
                to: lenderEmail,
                subject: 'Your accepted the loan',
                text: `You accepted the loan with id ${id} posted by ${borrowerUserName}. You can view further details on the app .`
            };

            transporter.sendMail(mailOptions2, (error, info) => {
                if (error) {
                    res.json({
                        error: error
                    })
                }
            })

            return res.status(200).json({
                message: "Loan Accepted Successfully",
                response
            })
        }

        if (err || !response) {
            res.status(400).json({
                message: "Such Loan Does Not Exists"
            })
        }
    })
}

const get = (req, res) => {
    const { id } = req.body

    Loan.findOne({ id }, (err, Loan) => {
        if (loan) {
            res.status(200).json({
                message: "Loan Details",
                loan
            })
        }
        else {
            res.status(400).json({
                message: "Profile Does Not Exists"
            })
        }
    })
}

const all_loans = (req, res) => {

    Loan.find({}, (err, response) => {
        if (response[0]) {
            return res.status(200).json({
                message: "All Loans",
                response
            })
        }

        if (err || !response[0]) {
            res.status(400).json({
                message: "No Loan Exists"
            })
        }
    })
}

module.exports = {
    "create": create,
    "modify": modify,
    "get": get,
    "accept": accept,
    "all_loans": all_loans
}