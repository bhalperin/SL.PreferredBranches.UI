import { HttpClient, json } from "aurelia-fetch-client";
import { inject } from "aurelia-framework";
import { noView } from "aurelia-templating";
import { IAppListItem } from "../shared/data/data-models";

@inject(HttpClient)
@noView()
export class Rest {
	public customerApiBaseUrl: string;
	public sharedApiBaseUrl: string = "https://dev-dwh3-gw.dev.sealights.co/api/";
	public customerToken: string;
	public sharedToken: string;

	constructor(public http: HttpClient) {
		http.configure(config => {
			config.useStandardConfiguration();
		});
	}

	public async loginToCustomer(user: string, password: string): Promise<any> {
		return this.http.fetch(`${this.customerApiBaseUrl}v2/auth/token`, {
			body: json({
				email: user,
				password
			}),
			method: "POST"
		}).then(response => response.json());
	}

	public async loginToShared(user: string, password: string): Promise<any> {
		return this.http.fetch(`${this.sharedApiBaseUrl}v2/auth/token`, {
			body: json({
				email: user,
				password
			}),
			method: "POST"
		}).then(response => response.json());
	}

	public async getCustomers(): Promise<any[]> {
		this.http.baseUrl = "/";

		return this.http.fetch("data/customers.json").then(response => response.json());
	}

	public async getPreferredBranches(customer: string): Promise<any> {
		const headers = {
			Authorization: `Bearer ${this.customerToken}`
		};

		return this.http.fetch(`${this.customerApiBaseUrl}v3/report/preferredBranch/${customer}`, {
			headers
		}).then(response => response.json());
	}

	public async updatePreferredBranch(customer: string, app: IAppListItem): Promise<any> {
		const brancName: string = app.isPrefix ? app.branchNamePrefix : app.preferredBranchName;
		const body = {
			isPrefix: app.isPrefix
		};
		const headers = {
			Authorization: `Bearer ${this.customerToken}`
		};

		return this.http.fetch(`${this.customerApiBaseUrl}v3/report/preferredBranch/${customer}/${app.appName}/${brancName}`, {
			body: json(body),
			headers,
			method: "POST"
		}).then(response => response.json());
	}

	public async deletePreferredBranch(customer: string, app: IAppListItem): Promise<any> {
		const headers = {
			Authorization: `Bearer ${this.customerToken}`
		};

		return this.http.fetch(`${this.customerApiBaseUrl}v3/report/preferredBranch/${customer}/${app.appName}`, {
			headers,
			method: "DELETE"
		}).then(response => response.json()).catch(error => error);
	}

	public async getApps(): Promise<any> {
		const headers = {
			Authorization: `Bearer ${this.customerToken}`
		};

		return this.http.fetch(`${this.customerApiBaseUrl}v3/apps`, {
			headers
		}).then(response => response.json());
	}

	public async getBranches(app: string): Promise<any> {
		const headers = {
			Authorization: `Bearer ${this.customerToken}`
		};

		return this.http.fetch(`${this.customerApiBaseUrl}v3/branches?appName=${app}`, {
			headers
		}).then(response => response.json());
	}

	public async getUsers(url: string): Promise<any[]> {
		this.http.baseUrl = "https://api.github.com/users";

		return this.http.fetch(url).then(response => response.json());
	}

	public async getUser(user: string): Promise<any> {
		this.http.baseUrl = "https://api.github.com/users/";

		return this.http.fetch(user).then(response => response.json());
	}
}
