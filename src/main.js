import { createApp, h } from "vue";
import vuetify from "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";

const app = createApp({
	render() {
		return h(App);
	},
	data() {
		return {
			loader: { count: 0, stroke: 7, diameter: 50, value: false },
			monthList: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		};
	},
	created() {
		axios.interceptors.request.use(
			(request) => {
				this.load();
				return request;
			},
			(error) => {
				this.unload();

				let notification = { title: "Unknown error", content: "" };
				if (error.response) {
					if (error.response.status === 400) {
						notification.title = "Bad request";
					} else if (error.response.status === 500) {
						notification.title = "Server error";
					} else if (error.response.status === 401) {
						notification.title = "Unauthorized";
					} else if (error.response.status === 403) {
						notification.title = "Forbidden";
					} else if (error.response.status === 404) {
						notification.title = "Not found";
					} else {
						notification.title = "Notification (" + error.response.status + ")";
					}
					notification.content = error.response.data;
				}
				store.commit("showNotification", notification);

				return Promise.reject(error);
			}
		);

		axios.interceptors.response.use(
			(response) => {
				this.unload();

				if (response.data && response.data.type === "NOTIFICATION") {
					store.commit("showNotification", { title: "Notification", content: response.data });
				}

				return response;
			},
			(error) => {
				this.unload();

				let notification = { title: "Unknown error", content: "" };
				if (error.response) {
					if (error.response.status === 400) {
						notification.title = "Bad request";
					} else if (error.response.status === 500) {
						notification.title = "Server error";
					} else if (error.response.status === 401) {
						notification.title = "Unauthorized";
					} else if (error.response.status === 403) {
						notification.title = "Forbidden";
					} else if (error.response.status === 404) {
						notification.title = "Not found";
					} else {
						notification.title = "Notification (" + error.response.status + ")";
					}
					notification.content = error.response.data;
				}
				store.commit("showNotification", notification);

				return Promise.reject(error);
			}
		);
	},
	methods: {
		load() {
			this.loader.count++;
			this.loader.value = true;
		},
		unload() {
			this.loader.count--;
			if (this.loader.count < 0) {
				this.loader.count = 0;
			}
			this.loader.value = this.loader.count > 0;
		},
		clone(object) {
			return JSON.parse(JSON.stringify(object));
		},
		ellipsify(text, limit) {
			if (text && text.length > limit) {
				return text.substring(0, limit) + "...";
			}
			return text;
		},
		textify(text, before, after) {
			if (text && text.trim().length > 0) {
				return (before ? before : "") + text + (after ? after : "");
			}
			return "";
		},
		enum(text) {
			if (text) {
				return text.replace(/_/g, " ");
			}
			return text;
		},
		downloadAsset(name) {
			location.href = axios.defaults.baseURL + "/asset/file/" + name + "?download&random=" + new Date().getTime();
		},
		isImage(text) {
			if (text) {
				let q = text.toLowerCase();
				return q.endsWith(".jpg") || q.endsWith(".jpeg") || q.endsWith(".png");
			}
			return false;
		},
		isVideo(text) {
			if (text) {
				let q = text.toLowerCase();
				return q.endsWith(".mp4");
			}
			return false;
		},
		asset(text, resolution) {
			if (text) {
				if (text.toLowerCase().startsWith("http")) {
					return text;
				} else {
					return axios.defaults.baseURL + "/asset/" + resolution + "/" + text;
				}
			}
			return null;
		},
		projection(list, array) {
			for (let item of list) {
				for (let property in item) {
					if (!array.includes(property)) {
						delete item[property];
					}
				}
			}
		},
		formatJavaScriptDateTime(instant) {
			if (instant != null) {
				return instant.getDate() + " " + this.monthList[instant.getMonth()] + " " + instant.getFullYear() + " " + (instant.getHours() < 10 ? "0" : "") + instant.getHours() + ":" + (instant.getMinutes() < 10 ? "0" : "") + instant.getMinutes();
			} else {
				return "";
			}
		},
		capitalizeFirst(text) {
			return text && text[0].toUpperCase() + text.slice(1);
		},
	},
});

// axios
axios.defaults.baseURL = "";

if (window.location.origin.includes("localhost")) {
	axios.defaults.withCredentials = true;
	axios.defaults.baseURL = "http://localhost:8900/theta";
}

app.config.globalProperties.$base = axios.defaults.baseURL;
app.config.globalProperties.$window = window;

// router
router.beforeEach((to, from, next) => {
	if (to.matched.some((record) => record.meta.restricted === true)) {
		if (store.state.principal.role) {
			next();
			return;
		}
		next("/unauthorized");
	} else if (to.matched.some((record) => record.meta.role === "Administrator")) {
		if (store.state.principal.role === "Administrator") {
			next();
			return;
		}
		next("/administrator");
	} else if (to.matched.some((record) => record.meta.role === "Tenant")) {
		if (store.state.principal.role === "Tenant") {
			next();
			return;
		}
		next("/tenant");
	} else if (to.matched.some((record) => record.meta.role === "User")) {
		if (store.state.principal.role === "User") {
			next();
			return;
		}
		next("/user");
	} else {
		next();
	}
});

app.use(store);
app.use(router);
app.use(vuetify);

app.mount("#app");
