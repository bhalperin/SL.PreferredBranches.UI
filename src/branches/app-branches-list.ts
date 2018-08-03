import { EventAggregator } from "aurelia-event-aggregator";
import { HttpClient } from "aurelia-fetch-client";
import { bindable, inject } from "aurelia-framework";
import { IAppListItem } from "../shared/data/data-models";
import { Rest } from "../util/rest";

@inject(EventAggregator, HttpClient, Rest)
export class AppBranchesList {
	@bindable public app: IAppListItem;
	@bindable public disabled: boolean;
	@bindable public selectedBranch: string;
	private branches: string[] = [];
	private ea: EventAggregator;
	private isLoaded: boolean = false;
	private rest: Rest;

	constructor(private eventAggragator: EventAggregator, public http: HttpClient, private r: Rest) {
		this.ea = eventAggragator;
		this.rest = r;
	}

	public attached() {
		this.getBranches();
	}

	private async getBranches() {
		const branches = await this.rest.getBranches(this.app.appName);

		this.branches = branches.data.sort();
		this.isLoaded = true;
	}

	private onSelectBranch(event) {
		this.selectedBranch = event.currentTarget.options[event.currentTarget.selectedIndex].text;
		this.app.selectedBranchName = this.selectedBranch;
	}

	private publish(branch: string): void {
		this.ea.publish("branchSelected", branch);
	}
}
