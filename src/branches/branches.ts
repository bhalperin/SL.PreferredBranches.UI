import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-fetch-client";
import { inject } from "aurelia-framework";
import { IAppListItem } from "../shared/data/data-models";
import { Rest } from "../util/rest";

@inject(EventAggregator, HttpClient, Rest)
export class Branches {
	public rest: Rest;
	private customers: any[] = [];
	private customerNameElements = {};
	private selectedCustomer: string;
	private allApps: any[] = [];
	private apps: any[] = [];
	private appList: IAppListItem[] = [];
	private appBranches = {};
	private showIncludedComponentsOnly: boolean = false;
	private isLoaded: boolean = false;
	private ea: EventAggregator;

	constructor(private eventAggragator: EventAggregator, public http: HttpClient, private r: Rest) {
		this.ea = eventAggragator;
		this.rest = r;
	}

	public attached() {
		this.getCustomers();
	}

	public async getCustomers() {
		const response = await this.rest.getCustomers();

		this.customers = response.sort((c1, c2) => this.sortByStringProperty(c1, c2, "name"));
		await this.loginToShared();
	}

	private async loginToShared() {
		const auth = await this.rest.loginToShared("admin@sealights.io", "sealights2016");

		this.rest.sharedToken = auth.token;
	}

	private async onSelectCustomer(customerName: string) {
		this.allApps = [];
		this.apps = [];
		this.appList = [];

		this.isLoaded = false;

		if (this.selectedCustomer) {
			(this.customerNameElements[this.selectedCustomer] as HTMLElement).classList.remove("selected");
		}
		(this.customerNameElements[customerName] as HTMLElement).classList.add("selected");
		this.selectedCustomer = customerName;

		const customer = this.customers.find(c => {
			return c.name === customerName;
		});
		this.rest.customerApiBaseUrl = customer.baseUrl;

		const auth = await this.rest.loginToCustomer(customer.user, customer.password);

		this.rest.customerToken = auth.token;

		const appsResponse = await this.rest.getApps();

		this.allApps = appsResponse.data;
		this.allApps.sort();
		this.apps = await this.rest.getPreferredBranches(customerName);
		this.appList = this.apps.map(app => {
			return {
				appName: app.appName,
				branchNamePrefix: app.isPrefix ? app.branchName : "",
				isPreferredBranch: true,
				isPrefix: app.isPrefix,
				preferredBranchName: app.branchName,
				selectedBranchName: app.isPrefix ? "" : app.branchName
			} as IAppListItem;
		});
		this.allApps.forEach(appName => {
			const i = this.appList.findIndex(app => app.appName === appName);

			if (i === -1) {
				this.appList.push({
					appName,
					branchNamePrefix: "",
					isPreferredBranch: false,
					isPrefix: false,
					preferredBranchName: "",
					selectedBranchName: ""
				} as IAppListItem);
			}
		});
		this.appList.sort((app1: IAppListItem, app2: IAppListItem) => this.sortByStringProperty(app1, app2, "appName"));

		this.isLoaded = true;
	}

	private getBranches(appName: string): string[] {
		return this.appBranches[appName];
	}

	private onClickIsPrefix(app): boolean {
		app.isPrefix = !app.isPrefix;

		return true;
	}

	private async onIncludeApp(app: IAppListItem) {
		alert(`Included ${app.appName}`);
	}

	private async onSaveBranch(app: IAppListItem) {
		const response = await this.rest.updatePreferredBranch(this.selectedCustomer, app);

		alert(`Saved ${app.preferredBranchName}`);
	}

	private async onDeleteBranch(app: IAppListItem) {
		const response = await this.rest.deletePreferredBranch(this.selectedCustomer, app);

		if (response.ok !== undefined && !response.ok) {
			alert(`Error deleted ${app.appName}: ${response.statusText}`);
		}
		app.isPreferredBranch = false;
	}

	private sortByStringProperty(obj1: IAppListItem, obj2: IAppListItem, propertyName: string): number {
		if (obj1[propertyName] < obj2[propertyName]) {
			return -1;
		} else if (obj2[propertyName] < obj1[propertyName]) {
			return 1;
		}

		return 0;
	}

	private get appsIncluded(): number {
		return this.appList.filter(app => app.isPreferredBranch).length;
	}
}
