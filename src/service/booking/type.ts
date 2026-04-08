import { z } from "zod";

export const BookingRequestSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    message: z.string(),
    nameTour: z.string().nullable(),

    status: z.enum(["PENDING", "RECEIVED"]),

    notificationSent: z.boolean(),
    notificationError: z.string().nullable(),

    notificationSentAt: z.string().datetime().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const BookingRequestResponseSchema = z.array(BookingRequestSchema);

export type BookingRequest = z.infer<typeof BookingRequestSchema>;
export type BookingRequestResponse = z.infer<typeof BookingRequestResponseSchema>;


export const BookingPayLoadRequest = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    message: z.string().min(1, "Message is required"),
    nameTour: z.string().optional(),
    numberOfGuests: z.number().optional(),
});

export type BookingPayLoadRequestType = z.infer<typeof BookingPayLoadRequest>;