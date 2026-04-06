/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ResponseErrorType<T = any> extends Error {
    response: T;
    statusCode: number;
    api: string;
}

class ResponseError<T = any> extends Error implements ResponseErrorType<T> {
    response: T;
    statusCode: number;
    api: string;

    constructor(message: string, res: T, statusCode: number, api: string) {
        super(message);
        this.response = res;
        this.statusCode = statusCode;
        this.api = api;
        Object.setPrototypeOf(this, ResponseError.prototype);
    }
}

interface NextFetchRequestConfig {
    next?:
    | {
        revalidate?: number | false;
        tags?: string[];
    }
    | undefined;
}

export type RequestOptions = Omit<RequestInit, "body"> &
    NextFetchRequestConfig & {
        baseURL?: string;
    };

export type RequestOptionsWithUrl = RequestInit & {
    url?: string;
} & NextFetchRequestConfig & { baseURL?: string };

type NextHeadersInit = HeadersInit | undefined;

export function isResponseError<T>(
    error: unknown,
): error is ResponseErrorType<T> {
    return error instanceof ResponseError;
}

export function setCookie({ name, value }: { name: string; value: string }) {
    document.cookie = `${name}=${value}; path=/;`;
}

export function clearCookie(name = "token") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function getCookie(name = "token") {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
}

export type RequestInterceptor = (
    options: RequestOptionsWithUrl,
) => Promise<void>;
export type ResponseInterceptor = (data: any) => Promise<any>;

export type DefaultAPIConfig = {
    baseURL: string;
    headers?: HeadersInit;
};

export default class FetchApi {
    private static instance: FetchApi;
    protected baseURL: string;
    private headers: HeadersInit;
    private requestInterceptors: RequestInterceptor[];
    private responseInterceptors: ResponseInterceptor[];

    constructor(config: DefaultAPIConfig, initialToken?: string) {
        this.baseURL = config.baseURL;
        this.headers = config.headers || {};
        this.requestInterceptors = [];
        this.responseInterceptors = [];

        this.setAuthorizationToken(initialToken || this.getCookieToken);
    }

    static getInstance(
        defaultConfig?: DefaultAPIConfig,
        initialToken?: string,
    ): FetchApi {
        if (!FetchApi.instance) {
            if (!defaultConfig) {
                throw new Error(
                    "Default API config is required when creating an instance",
                );
            }
            FetchApi.instance = new FetchApi(defaultConfig, initialToken);
        }
        return FetchApi.instance;
    }

    protected get isClient(): boolean {
        return typeof window !== "undefined";
    }

    private normalizeBearerToken(token?: string | null): string {
        if (!token) return "";
        return `Bearer ${token.replace(/[Bb]earer\s+/, "").trim()}`;
    }

    private headersToObject(headers: NextHeadersInit): Record<string, string> {
        const result: Record<string, string> = {};
        if (!headers) return result;

        if (headers instanceof Headers) {
            headers.forEach((value, key) => {
                result[key] = value;
            });
            return result;
        }

        if (Array.isArray(headers)) {
            for (const [key, value] of headers) {
                result[key] = value;
            }
            return result;
        }

        return { ...(headers as Record<string, string>) };
    }

    private mergeHeaders(...headerSets: NextHeadersInit[]): Headers {
        const merged = new Headers();
        for (const headerSet of headerSets) {
            if (!headerSet) continue;

            if (headerSet instanceof Headers) {
                headerSet.forEach((value, key) => merged.set(key, value));
                continue;
            }

            if (Array.isArray(headerSet)) {
                for (const [key, value] of headerSet) {
                    merged.set(key, value);
                }
                continue;
            }

            for (const [key, value] of Object.entries(headerSet)) {
                if (value !== undefined) merged.set(key, String(value));
            }
        }
        return merged;
    }

    private async getAuthorizationToken(): Promise<string> {
        const currentHeaders = this.headersToObject(this.headers);
        const headerToken = currentHeaders.Authorization || currentHeaders.authorization;
        if (headerToken) {
            return this.normalizeBearerToken(headerToken);
        }

        if (this.isClient) {
            return this.normalizeBearerToken(getCookie("token"));
        }

        // Do not read next/headers cookies here because this method can be called
        // inside "use cache" scopes, where dynamic sources are forbidden.
        return "";
    }

    private get getCookieToken(): string {
        if (this.isClient) {
            const token = getCookie("token");
            if (token) return token;
        }
        return "";
    }

    setAuthorizationToken(token: string): void {
        token = this.normalizeBearerToken(token);
        if (!token) return;

        // Update headers with the token
        this.headers = {
            ...this.headers,
            Authorization: token,
        };

        if (this.isClient) setCookie({ name: "token", value: token });
    }

    async delAuthorizationToken(): Promise<void> {
        // Remove from headers - only if headers is an object
        if (typeof this.headers === 'object' && !Array.isArray(this.headers)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { Authorization, ...restHeaders } = this.headers as Record<string, any>;
            this.headers = restHeaders;
        }

        if (this.isClient) clearCookie("token");
    }

    addRequestInterceptor(interceptor: RequestInterceptor): void {
        this.requestInterceptors.push(interceptor);
    }

    addResponseInterceptor(interceptor: ResponseInterceptor): void {
        this.responseInterceptors.push(interceptor);
    }

    async setBaseURL(newBaseURL: string): Promise<void> {
        this.baseURL = newBaseURL;
    }

    private async handleErrors(
        response: Response,
    ): Promise<void> {
        if (!response.ok) {
            if (response.status === 401) {
                await this.delAuthorizationToken();
                if (this.isClient && window.location.pathname !== "/admin/login") {
                    window.location.replace("/admin/login");
                }
            }

            const contentType = response.headers.get("Content-Type");

            // If not JSON response, throw error server error
            if (!contentType || !contentType.includes("application/json")) {
                throw new ResponseError(
                    `Invalid response format: Expected JSON but received ${contentType || "unknown format"
                    }`,
                    null,
                    response.status,
                    response.url,
                );
            }

            // If JSON response, parse and throw error
            const errorData = await response.json();
            const api = response.url;
            const status =
                errorData.status || errorData.statusCode || response.status;
            const errorCode =
                errorData?.error?.code || errorData?.errorCode || "Response Error";
            const errorMessage =
                errorData?.error?.message ||
                errorData?.message ||
                response?.statusText ||
                "Unknown error";

            const message = `Status: ${status}\nCode: ${errorCode}\nMessage: ${errorMessage}\nAPI: ${api}`;

            throw new ResponseError(message, errorData, status, api);
        }
    }

    async get<T>(
        endpoint: string,
        params:
            | { [key: string]: string | string[] | number | undefined }
            | string
            | null = null,
        options: RequestOptions = {},
    ): Promise<T> {
        if (params) {
            endpoint +=
                typeof params === "string"
                    ? `?${params}`
                    : `?${encodeQueryUrl(params)}`;
        }
        return this.fetchData<T>(endpoint, { ...options, method: "GET" });
    }

    async post<T>(
        endpoint: string,
        data: any = {},
        options: RequestOptions = {},
    ): Promise<T> {
        return this.fetchData(endpoint, {
            ...options,
            method: "POST",
            body: data,
        });
    }

    async patch<T>(
        endpoint: string,
        data: any = {},
        options: RequestOptions = {},
    ): Promise<T> {
        return this.fetchData(endpoint, {
            ...options,
            method: "PATCH",
            body: data,
        });
    }

    async put<T>(
        endpoint: string,
        data: any = {},
        options: RequestOptions = {},
    ): Promise<T> {
        return this.fetchData(endpoint, {
            ...options,
            method: "PUT",
            body: data,
        });
    }

    async delete<T>(
        endpoint: string,
        data: any = {},
        options: RequestOptions = {},
    ): Promise<T> {
        return this.fetchData(endpoint, {
            ...options,
            method: "DELETE",
            body: data,
        });
    }

    async fetchData<T>(
        endpoint: string,
        options: RequestOptionsWithUrl = {},
    ): Promise<T> {
        try {
            const isFormData = options.body instanceof FormData;
            const method = (options.method || "GET").toUpperCase();
            const isGetRequest = method === "GET";

            const authorizationToken = await this.getAuthorizationToken();

            const mergedHeaders = this.mergeHeaders(this.headers, options?.headers);
            if (authorizationToken && !mergedHeaders.has("Authorization")) {
                mergedHeaders.set("Authorization", authorizationToken);
            }
            if (!isFormData && options.body !== undefined) {
                mergedHeaders.set("Content-Type", "application/json");
            }
            if (!mergedHeaders.has("Accept")) {
                mergedHeaders.set("Accept", "application/json");
            }

            const shouldApplyDefaultRevalidate =
                isGetRequest &&
                options.cache !== "no-store" &&
                options.next?.revalidate === undefined;

            const nextOptions = {
                ...options?.next,
                ...(shouldApplyDefaultRevalidate ? { revalidate: 60 } : {}),
            };

            const requestOptions: RequestOptionsWithUrl = {
                ...options,
                method,
                headers: mergedHeaders,
                body: isFormData
                    ? options.body
                    : options?.body
                        ? JSON.stringify(options.body)
                        : undefined,
                next: nextOptions,
                credentials: "include",
                cache: options.cache ?? "no-store",
            };

            if (options.baseURL) await this.setBaseURL(options.baseURL);

            const api = isUrl(endpoint)
                ? `${endpoint}`
                : `${`${this.baseURL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`}`;

            requestOptions.url = api;

            for (const interceptor of this.requestInterceptors) {
                await interceptor(requestOptions);
            }
            const response = await fetch(requestOptions.url, requestOptions);

            await this.handleErrors(response);

            if (response.status === 204) {
                return null as T;
            }

            const contentType = response.headers.get("Content-Type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new ResponseError(
                    `Invalid response format: Expected JSON but received ${contentType || "unknown format"
                    }`,
                    null,
                    response.status,
                    requestOptions.url,
                );
            }

            let responseData = await response.json();

            for (const interceptor of this.responseInterceptors) {
                responseData = await interceptor(responseData);
            }

            return responseData;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export function isUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return false;
    }
}

function encodeQueryUrl(params: {
    [key: string]: string | number | string[] | undefined;
}): string {
    const queryString = Object.keys(params)
        .map((key) => {
            const value = params[key];
            if (value === undefined) return "";
            if (Array.isArray(value)) {
                return value
                    .map((val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
                    .join("&");
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .filter((param) => param.length > 0)
        .join("&");
    return queryString;
}