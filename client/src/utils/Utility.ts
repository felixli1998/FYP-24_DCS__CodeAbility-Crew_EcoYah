import axios, { AxiosRequestConfig, AxiosResponse } from "axios";


export async function makeHttpRequest<T>(
    url: string,
    params: Record<string, any> = {},
    method: string = 'GET',
): Promise<T> {
    try {
        // Configure axios
        const config: AxiosRequestConfig = {
            method: method.toUpperCase(),
            url: url,
        }
        if (method.toUpperCase() === 'GET') {
            config.params = params;
        } else {
            config.data = params;
        }

        // Make request
        const response: AxiosResponse<T> = await axios(config);
        return response.data;
    } catch (error) {
        console.error("Error making request: ", error)
        throw error;
    }
}
