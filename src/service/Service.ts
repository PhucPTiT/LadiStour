import { z } from "zod";

/**
 * Validate any unknown response using the provided Zod schema.
 *
 * @param response The response object to validate
 * @param schema Zod schema to validate against
 * @param name Optional name for better error messages
 * @returns Validated response with correct typing
 */
export function validateSchema<T>(
    response: unknown,
    schema: z.ZodType<T>,
    name: string = "response"
): T {
    const result = schema.safeParse(response);

    if (!result.success) {
        console.error(`Invalid ${name} structure:`, result.error);

        // Tạo error message chi tiết từ validation errors
        const details = result.error.issues
            .map((err) => {
                const path = err.path.join(".");
                return `${path || "root"}: ${err.message}`;
            })
            .join("; ");

        const errorMessage = `Invalid ${name} structure: ${details}`;
        throw new Error(errorMessage);
    }

    return result.data;
}
