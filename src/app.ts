import { PLATFORM } from "aurelia-framework";
import { RouteConfig, Router, RouterConfiguration } from "aurelia-router";

export class App {
	public router: Router;

	public configureRouter(config: RouterConfiguration, router: Router) {
		const routes: RouteConfig[] = [
			{
				moduleId: PLATFORM.moduleName("branches/branches"),
				name: "branches",
				route: "",
				title: "Branches"
			},
			{
				moduleId: PLATFORM.moduleName("users/users"),
				name: "users",
				route: "users",
				title: "Users"
			}
		];
		config.map(routes);
		this.router = router;
		config.title = "Sealights Reports Admin";
	}
}
