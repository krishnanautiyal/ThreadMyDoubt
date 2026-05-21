process.env.JWT_SECRET = "testsecret";

const authService = require("../services/authService");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

jest.mock("../models/User");
jest.mock("bcryptjs");

describe("Auth Service Tests",()=>{

    afterEach(()=>{
        jest.clearAllMocks();
    });

    test("should register new user", async()=>{

        User.findOne.mockResolvedValue(null);

        User.create.mockResolvedValue({
            _id:"123",
            username:"shivam",
            email:"shivam@test.com",
            password:"hashed"
        });

        const result = await authService.registerUser({
            username:"shivam",
            email:"shivam@test.com",
            password:"123456"
        });

        expect(User.findOne)
        .toHaveBeenCalled();

        expect(User.create)
        .toHaveBeenCalled();

        expect(result.user.username)
        .toBe("shivam");

        expect(result.token)
        .toBeDefined();

    });


    test("should login user", async()=>{

        User.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id:"123",
                email:"shivam@test.com",
                password:"hashed"
            })
        });

        bcrypt.compare
        .mockResolvedValue(true);

        const result = await authService.loginUser({
            email:"shivam@test.com",
            password:"123456"
        });

        expect(result.token)
        .toBeDefined();

    });

});