const authController=
require("../controllers/authController");

const authService=
require("../services/authService");

jest.mock("../services/authService");

describe("Auth Controller",()=>{

    test("register should return 201",async()=>{

        authService.registerUser
        .mockResolvedValue({

            user:{
                _id:"123",
                username:"shivam",
                email:"shivam@test.com"
            },

            token:"abc123"
        });

        const req={

            body:{
                username:"shivam",
                email:"shivam@test.com",
                password:"123456"
            }

        };

        const res={

            status:jest.fn()
            .mockReturnThis(),

            json:jest.fn()

        };

        await authController.register(
            req,
            res
        );

        expect(res.status)
        .toHaveBeenCalledWith(
            201
        );

        expect(res.json)
        .toHaveBeenCalled();

    });

});