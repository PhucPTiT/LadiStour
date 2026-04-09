import * as Minio from 'minio';

export const minioClient = new Minio.Client({
    endPoint: 'minio.stour.com.vn',
    useSSL: true,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
});