import * as Minio from 'minio';

export const minioClient = new Minio.Client({
    endPoint: '103.89.94.201',
    port: 9000,
    useSSL: false,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
});