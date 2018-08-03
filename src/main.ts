import { Aurelia, PLATFORM } from "aurelia-framework";

export async function configure(aurelia: Aurelia) {
	aurelia.use
		.standardConfiguration()
		.developmentLogging()
		.globalResources(PLATFORM.moduleName("bootstrap/dist/css/bootstrap.css"))
		.feature(PLATFORM.moduleName("util/index"));
	await aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName("app")));
}
