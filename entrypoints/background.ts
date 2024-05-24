import { themes } from "@/themes";
import { Files, State } from "@/types";

export default defineBackground(() => {
	console.log("Hello background!", { id: browser.runtime.id });
	const DEV_CONSOLE_URL = "salesforce.com/_ui/common/apex/debug/ApexCSIPage";
	const APEX_CLASS_REQUEST = "SELECT%20Id,%20Name,%20NamespacePrefix%20FROM%20ApexClass";

	const UNIQUE_ID = "x-from-sfdo";

	const initState: State = {
		active: false,
		themeId: 0,
		themes: themes,
		animations: false
	};

	const initFiles: Files = {
		apexClasses: {
      name: "Apex Classes",
      files: []
    }
	};

	// Return the current tab
	async function getCurrentTab() {
		const queryOptions = { active: true, currentWindow: true };
		const [tab] = await browser.tabs.query(queryOptions);
		return tab;
	}

	// Returns true if the url is a dev console url
	function allowedUrl(url: string | undefined) {
		return url?.startsWith("http") && url?.indexOf(DEV_CONSOLE_URL) !== -1;
	}

	browser.runtime.onInstalled.addListener(() => {
		browser.storage.sync.set({ state: initState });
		browser.storage.sync.set({ files: initFiles });
	});

	browser.storage.onChanged.addListener(handleChange);

	browser.tabs.onActivated.addListener(handleChange);

	browser.tabs.onUpdated.addListener(handleChange);
	browser.webRequest.onSendHeaders.addListener(
		async (details) => {
			// Ignore the request if it has the unique identifier
			if (details.requestHeaders?.find((header) => header.name === UNIQUE_ID)) return;
			
			if (details.url.indexOf(APEX_CLASS_REQUEST) !== -1) {
				const req: Request = new Request(details.url);
				details.requestHeaders?.forEach((header) => {
					if (header.value !== undefined) {
						return req.headers.append(header.name, header.value);
					}
				});
				req.headers.append(UNIQUE_ID, "true");
				const response = await fetch(req);
				if (response.ok) {
					const responseBody = await response.text();
					try {
						const json = JSON.parse(responseBody);
            console.log(json)
						if (json.size && json.size > 0 && json.records && json.records.length > 0) {
							const files = json.records.map((record: any) => {
								return {
									id: record.Id,
									name: record.Name,
									url: record.attributes.url,
                  type: ".cls"
								};
							});
							const data = await browser.storage.sync.get("files");
							data.files.apexClasses.files = files;
							await browser.storage.sync.set({ files: data.files });
						}
					} catch (e) {
						console.error(e)
					}
				} else {
					console.log("Request failed, making the request again...");
				}
			}
			return { cancel: false };
		},
		{ urls: ["<all_urls>"] },
		["requestHeaders", "extraHeaders"]
	);

	async function handleChange() {
		const tab = await getCurrentTab();
		const data = await browser.storage.sync.get("state");
		applyBadge(tab, data.state);
	}

	function applyBadge(tab: any, state: State) {
		if (state.active && allowedUrl(tab?.url) && tab.id !== undefined) {
			setBadgeOn(state.themes[state.themeId].colors.word);
		} else {
			setBadgeOff();
		}
	}

	function setBadgeOn(color: string) {
		browser.action.setBadgeBackgroundColor({ color: color });
		browser.action.setBadgeText({ text: " " });
	}

	function setBadgeOff() {
		browser.action.setBadgeText({ text: "" });
	}
});
