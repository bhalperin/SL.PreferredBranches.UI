import { HttpClient } from "aurelia-fetch-client";
import { inject } from "aurelia-framework";
import { noView } from "aurelia-templating";

@inject(HttpClient)
@noView()
export class Rest {
	constructor(public http: HttpClient) {
		http.configure(config => {
			config
				.useStandardConfiguration();
		});
	}

	public async getCustomers(): Promise<string[]> {
		this.http.baseUrl = "/";

		return this.http.fetch("data/customers.json").then(response => response.json());
	}

	public async getUsers(url: string): Promise<any[]> {
		this.http.baseUrl = "https://api.github.com/users";

		return this.http.fetch(url).then(response => response.json());
	}

	public async getUser(user: string): Promise<any> {
		this.http.baseUrl = "https://api.github.com/users/";

		return this.http.fetch(user).then(response => response.json());
	}

	public getWeatherCurrentGeosearch(key: string, params: string): Promise<Response> {
		const url = `?key=${key}&city=${params}`;
		this.http.baseUrl = "http://api.weatherbit.io/v1.0/current/geosearch";

		return this.http.fetch(url)
			.then(response => {
				if (response.status === 200) {
					return response.json();
				}
				throw new Error("Invalid city");
			})
			.catch(error => {
				console.error(error);
				return {
					error
				};
			});
	}

	public getWeatherIconUrl(key: string, icon: string): string {
		const url = `https://www.weatherbit.io/static/img/icons/${icon}.png?key=${key}`;

		return url;
	}
}
