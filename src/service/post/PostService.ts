import HttpService from "@/config/http-service ";
import { Post, postSchema, PostsResponse, postsResponseSchema } from "./type";
import { POSTS } from "@/const/endpoint";
import { validateSchema } from "../Service";

const API = HttpService.getInstance();

export async function createPost(data: unknown): Promise<void> {
    try {
        await API.post(POSTS.CREATE, data);
    } catch (error) {
        console.error("Failed to create post:", error);
        throw error;
    }
}

export async function getAllPost(): Promise<PostsResponse> {
    try {
        const response = await API.get<PostsResponse>(POSTS.GET_ALL);

        const validatedData = validateSchema(
            response,
            postsResponseSchema,
            "PostService.GetAll"
        );

        return validatedData;
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        throw error;
    }
}

export async function deletePost(id: string): Promise<void> {
    try {
        await API.delete(`${POSTS.DELETE}/${id}`);
    } catch (error) {
        console.error(`Failed to delete post with id ${id}:`, error);
        throw error;
    }
}


export async function updatePost(id: string, data: unknown): Promise<void> {
    try {
        await API.put(`${POSTS.UPDATE}/${id}`, data);
    } catch (error) {
        console.error(`Failed to update post with id ${id}:`, error);
        throw error;
    }
}

export async function getDetailPost(id: string): Promise<Post> {
    try {
        const response = await API.post<Post>(
            POSTS.GET_DETAIL, { id }
        );
        const validatedData = validateSchema(
            response,
            postSchema,
            "PostService.GetDetail"
        );
        return validatedData;
    } catch (error) {
        console.error(`Failed to fetch post with id ${id}:`, error);
        throw error;
    }
}

export async function publishPost(id: string): Promise<void> {
    try {
        await API.patch(`${POSTS.PUBLISH.replace(":id", id)}`);
    } catch (error) {
        console.error(`Failed to publish post with id ${id}:`, error);
        throw error;
    }
}