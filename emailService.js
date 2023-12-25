const sendVerificationCode = async (email) => {
  // code for sending verification code to email
  // will return the same verification code, so that it can be updated in the user db
};

const sendForgotPasswordEmail = async (user) => {
  // code for sending a forgot password Email
  // this code will create a verification code that will be set for the user in the db
  // it will also contain a link to the forgot password page for the specific user
};

const resendVerificationCode = async (user) => {
  // will simply resend a verification code email, and will return it in the function
};
