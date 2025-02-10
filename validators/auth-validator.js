const { z } = require("zod");

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be  more than 3 characters." })
    .max(255, { message: "Name must be not more than 255 characters." }),

  password: z
    .string({ required_error: "password is required" })

    .min(7, { message: "password must be at least of 7 characters." })
    .max(255, { message: "password must be not more than 255 characters." }),
});

//creating an object schema
const signupSchema = loginSchema.extend({
  username: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at least of 3 characters." })
    .max(255, { message: "Name must be not more than 255 characters." }),

  phone: z
    .string({ required_error: "Phone  is required" })
    .trim()
    .min(10, { message: "phone must be at least of 10 characters." })
    .max(20, { message: "phone must be not more than 255 characters." }),
});
module.exports = { signupSchema, loginSchema };
