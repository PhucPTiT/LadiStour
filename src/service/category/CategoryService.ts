import HttpService from "@/config/http-service ";
import { Category, CategoryList, CategoryListSchema, CategorySchema } from "./type";
import { CATEGORIES } from "@/const/endpoint";
import { validateSchema } from "../Service";

const API = HttpService.getInstance();

export async function getAllCategories(): Promise<CategoryList> {
    try {
        const response = await API.get<CategoryList>(CATEGORIES.GET_ALL);

        const validatedData = validateSchema(
            response,
            CategoryListSchema,
            "CategoryService.GetAll"
        );

        return validatedData;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        throw error;
    }
}

export async function deleteCategory(id: string): Promise<void> {
    try {
        await API.delete(`${CATEGORIES.DELETE}/${id}`);
    } catch (error) {
        console.error(`Failed to delete category with id ${id}:`, error);
        throw error;
    }
}

export async function createCategory(data: unknown): Promise<void> {
    try {
        await API.post(CATEGORIES.CREATE, data);
    } catch (error) {
        console.error("Failed to create category:", error);
        throw error;
    }
}

export async function updateCategory(id: string, data: unknown): Promise<void> {
    try {
        await API.put(`${CATEGORIES.UPDATE}/${id}`, data);
    } catch (error) {
        console.error(`Failed to update category with id ${id}:`, error);
        throw error;
    }
}

export async function createTranslationCategory(data: unknown, id: string): Promise<void> {
    try {
        await API.post(`${CATEGORIES.CREATE_TRANSLATION.replace(":id", id)}`, data);
    } catch (error) {
        console.error("Failed to create category translation:", error);
        throw error;
    }
}

export async function getCategoryById(id: string): Promise<Category> {
    try {
        const response = await API.get<Category>(`${CATEGORIES.GET_BY_ID}/${id}`);
        const validatedData = validateSchema(
            response,
            CategorySchema,
            "CategoryService.GetById"
        );
        return validatedData;
    } catch (error) {
        console.error(`Failed to fetch category with id ${id}:`, error);
        throw error;
    }
}