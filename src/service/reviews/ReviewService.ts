import HttpService from "@/config/http-service ";
import { REVIEWS } from "@/const/endpoint";
import { Review, ReviewList, ReviewListSchema, ReviewSchema } from "./type";
import { validateSchema } from "../Service";

const API = HttpService.getInstance();

export async function createReview(data: unknown): Promise<void> {
    try {
        await API.post(REVIEWS.CREATE, data);
    } catch (error) {
        console.error("Failed to create review:", error);
        throw error;
    }
}

export async function updateReview(id: string, data: unknown): Promise<void> {
    try {
        await API.put(REVIEWS.UPDATE.replace(":id", id), data);
    } catch (error) {
        console.error(`Failed to update review with id ${id}:`, error);
        throw error;
    }
}

export async function deleteReview(id: string): Promise<void> {
    try {
        await API.delete(REVIEWS.DELETE.replace(":id", id));
    } catch (error) {
        console.error(`Failed to delete review with id ${id}:`, error);
        throw error;
    }
}

export async function getReviewById(id: string): Promise<Review> {
    try {
        const response = await API.get<Review>(REVIEWS.GET_BY_ID.replace(":id", id));
        const validatedData = validateSchema(
            response,
            ReviewSchema,
            "ReviewService.GetReviewById"
        );

        return validatedData;
    } catch (error) {
        console.error(`Failed to fetch review with id ${id}:`, error);
        throw error;
    }
}

export async function getAllReviews(): Promise<ReviewList> {
    try {
        const response = await API.get<ReviewList>(REVIEWS.GET_ALL);
        const validatedData = validateSchema(
            response,
            ReviewListSchema,
            "ReviewService.GetAllReviews"
        );
        return validatedData;
    } catch (error) {
        console.error("Failed to fetch all reviews:", error);
        throw error;
    }
}