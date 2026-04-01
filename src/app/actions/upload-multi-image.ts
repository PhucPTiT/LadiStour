"use server";

import { minioClient } from "@/lib/minio/minio";

export async function uploadMultipleFilesAction(formData: FormData) {
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
        throw new Error("Không có file");
    }

    try {
        const results = await Promise.all(
            files.map(async (file) => {
                const buffer = Buffer.from(await file.arrayBuffer());
                const fileName = `${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2)}-${file.name}`;

                await minioClient.putObject(
                    "stour",
                    fileName,
                    buffer,
                    file.size,
                    { "Content-Type": file.type }
                );

                return {
                    success: true,
                    fileName,
                    originalName: file.name,
                    size: file.size,
                    type: file.type,
                };
            })
        );

        return {
            success: true,
            files: results,
        };
    } catch (error) {
        console.error("MinIO Error:", error);
        return {
            success: false,
            files: [],
        };
    }
}
