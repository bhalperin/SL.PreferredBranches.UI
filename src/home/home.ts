import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-fetch-client";
import { inject } from "aurelia-framework";
import { Rest } from "../util/rest";

@inject(EventAggregator, HttpClient)
export class Home {
	public rest: Rest;
	public customers;
	private ea: EventAggregator;

	constructor(private eventAggragator: EventAggregator, public http: HttpClient) {
		this.ea = eventAggragator;
		this.rest = new Rest(http);
	}

	public attached(): void {
		this.getCustomers();
	}

	public async getCustomers() {
		const response = await this.rest.getCustomers();

		this.customers = response;
	}
}
