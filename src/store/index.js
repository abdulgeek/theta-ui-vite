import { createStore } from "vuex";
import axios from "axios";

if (localStorage.getItem("principal") && JSON.parse(localStorage.getItem("principal")).token) {
	axios.defaults.headers.common["Authorization"] = "Bearer " + JSON.parse(localStorage.getItem("principal")).token;
}

export default createStore({
	state: {
		principal: (localStorage.getItem("principal") && JSON.parse(localStorage.getItem("principal"))) || {},
		notification: {
			title: null,
			content: {},
			show: false,
		},
	},
	mutations: {
		login(state, principal) {
			// console.log('mutation: login before state: ' + JSON.stringify(state) + " principal: " + JSON.stringify(principal));
			state.principal = principal;
			axios.defaults.headers.common["Authorization"] = "Bearer " + principal.token;
			localStorage.setItem("principal", JSON.stringify(principal));
			// console.log('mutation: login after state: ' + JSON.stringify(state, null, 4));
		},
		logout(state) {
			// console.log('mutation: logout before state: ' + JSON.stringify(state));
			state.principal = {};
			delete axios.defaults.headers.common["Authorization"];
			localStorage.removeItem("principal");
			// console.log('mutation: logout after state: ' + JSON.stringify(state));
		},
		showNotification(state, { title, content }) {
			state.notification.title = title;
			state.notification.content = content;
			state.notification.show = true;
		},
		hideNotification(state) {
			state.notification.show = false;
			state.notification.title = null;
			state.notification.content = {};
		},
		debug(state) {
			console.log("localStorage principal: " + localStorage.getItem("principal") + " state: " + JSON.stringify(state, null, 4));
		},
	},
	actions: {
		login({ commit }, principal) {
			// console.log('action: login');
			return new Promise((resolve, reject) => {
				axios
					.post("/system/authentication/login", {
						type: principal.type,
						email: principal.email,
						password: principal.password,
					})
					.then((response) => {
						let principal = response.data;
						if (principal && principal.token && principal.id) {
							commit("login", principal);
							resolve({ response: response, principal: principal });
						}
					})
					.catch((error) => reject(error));
			});
		},
		logout({ commit }) {
			// console.log('action: logout');
			return new Promise((resolve, reject) => {
				axios
					.post("/system/authentication/logout", {})
					.then((response) => {
						commit("logout");
						resolve(response);
					})
					.catch((error) => reject(error));
			});
		},
		debug({ commit }) {
			// console.log('action: debug');
			commit("debug");
		},
	},
	getters: {
		isAuthenticated: (state) => state.principal && state.principal.token,
	},
	modules: {},
});
