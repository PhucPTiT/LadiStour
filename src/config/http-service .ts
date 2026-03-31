import FetchApi, { DefaultAPIConfig } from "./base-service";

export default class HttpService extends FetchApi {
    private constructor(config: DefaultAPIConfig, initialToken?: string) {
        super(
            {
                ...config,
                headers: {
                    ...config.headers,
                },
            },
            initialToken,
        );

        this.baseURL = process.env.NEXT_PUBLIC_BASE_URL_ENDPOINT ?? "";
    }

    static getInstance(
        config?: DefaultAPIConfig,
        initialToken?: string,
    ): HttpService {
        const defaultBaseURL = process.env.NEXT_PUBLIC_BASE_URL_ENDPOINT ?? "";
        config = config ?? {
            baseURL: defaultBaseURL,
        };

        return new HttpService(config, initialToken);
    }

    async setBaseURL(newBaseURL: string, _endpoint?: string): Promise<void> {
        this.baseURL = newBaseURL;
    }
}