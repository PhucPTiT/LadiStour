import HttpService from "@/config/http-service ";
import {
    BookingPayLoadRequestType,
    BookingRequest,
    BookingRequestResponse,
    BookingRequestResponseSchema,
    BookingRequestSchema,
} from "./type";
import { BOOKING } from "@/const/endpoint";
import { validateSchema } from "../Service";

const API = HttpService.getInstance();

export async function getAllBookings(
    status?: string,
): Promise<BookingRequestResponse> {
    try {
        const response = await API.get<BookingRequestResponse>(
            BOOKING.GET_ALL,
            { status },
        );

        const validatedData = validateSchema(
            response,
            BookingRequestResponseSchema,
            "BookingService.GetAll"
        );

        return validatedData;
    } catch (error) {
        console.error("Failed to fetch bookings:", error);
        throw error;
    }
}


export async function getBookingById(id: string): Promise<BookingRequest> {
    try {
        const response = await API.get<BookingRequest>(
            `${BOOKING.GET_BY_ID}/${id}`,
        );

        const validatedData = validateSchema(
            response,
            BookingRequestSchema,
            "BookingService.GetById"
        );
        return validatedData;
    } catch (error) {
        console.error(`Failed to fetch booking with id ${id}:`, error);
        throw error;
    }
}

export async function updateBookingStatus(id: string, status: "PENDING" | "RECEIVED"): Promise<void> {
    try {
        await API.patch(BOOKING.UPDATE_STATUS.replace(":id", id), { status });
    } catch (error) {
        console.error(`Failed to update booking status for id ${id}:`, error);
        throw error;
    }
}

export async function createBooking(data: BookingPayLoadRequestType): Promise<void> {
    try {
        await API.post(BOOKING.CREATE, data);
    } catch (error) {
        console.error("Failed to create booking:", error);
        throw error;
    }
}

