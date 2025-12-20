import axios, { AxiosInstance } from "axios";

export abstract class ProviderAbstract {
  protected transporter: AxiosInstance;

  protected constructor(baseUrl: string) {
    this.transporter = axios.create({
      baseURL: baseUrl,
      headers: {
        "x-api-key": process.env.API_KEY,
      },
    });
  }
}
