const sgEmail = require('@sendgrid/mail')
sgEmail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeEmail = (email, name) => {
    sgEmail.send({
        to: email,
        from: 'alihashem431@gmail.com',
        subject: 'Thank you for joining',
        text: `Hello ,${name} nice to join us`,
    })
}
const sendCancelationEmail = (email, name) => {
    sgEmail.send({
        to: email,
        from: 'alihashem431@gmail.com',
        subject: 'Let us know your feed back',
        text: `thank you ,${name} at all`,
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}