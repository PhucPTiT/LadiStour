'use server';

import { minioClient } from "@/lib/minio/minio";


export async function uploadFileAction(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) throw new Error("Không có file");

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    try {
        console.log(minioClient, "file.size");
        const res = await minioClient.putObject(
            'stour',
            fileName,
            buffer,
            file.size,
            { 'Content-Type': file.type }
        );

        console.log(res, "res");

        return { success: true, fileName };
    } catch (error) {
        console.error("MinIO Error:", error);

        return { success: false };
    }
}