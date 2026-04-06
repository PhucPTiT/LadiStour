import HttpService from "@/config/http-service ";
import { validateSchema } from "../Service";
import { LoginResponse, LoginResponseSchema } from "./type";
import { AUTH } from "@/const/endpoint";
import { setCookie } from "@/config/base-service";

const API = HttpService.getInstance();

export async function login(
    username: string,
    password: string
): Promise<LoginResponse> {
    try {
        const response = await API.post<LoginResponse>(AUTH.LOGIN, {
            username,
            password,
        });


        const validatedData = validateSchema(
            response,
            LoginResponseSchema,
            "AuthService.Login"
        );

        // Set the token in cookies after successful login
        if (validatedData.token) {
            setCookie({ name: "token", value: validatedData.token });
        }

        return validatedData;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}
