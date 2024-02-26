import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export async function makeHttpRequest<T>(
  method: string = "GET",
  url: string,
  params: Record<string, any> = {},
): Promise<T> {
  try {
    // Configure axios
    const config: AxiosRequestConfig = {
      method: method.toUpperCase(),
      url: url,
    };

    // If it's a GET request, pass parameters as query parameters
    // If it's a non-GET request, add payload as query parameters
    if (method.toUpperCase() === "GET") {
      config.params = params;
    } else {
      config.data = params;
    }

    // Make request
    const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error making request: ", error);
    throw error;
  }
}
