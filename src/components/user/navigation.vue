<template>
	<v-app>
		<v-app-bar color="#f8f8f8" absolute clipped-left flat app>
			<v-app-bar-nav-icon class="hidden-sm-and-up"></v-app-bar-nav-icon>

			<img src="logo.png" style="height:50px;" @click="$store.commit('debug')" />

			<v-spacer></v-spacer>

			<v-menu left bottom offset-y rounded="b-xl">
				<template v-slot:activator="{ on, attrs }">
					<v-btn text v-bind="attrs" v-on="on">
						<v-icon>mdi-account-circle</v-icon>
						<span class="mx-1" style="text-transform:none;">{{$store.state.principal.email}}</span>
					</v-btn>
				</template>

				<v-list>
					<v-list-item @click="showChangePassword = true" link>
						<v-list-item-icon>
							<v-icon>mdi-lock-reset</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title>Change password</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
					<v-list-item @click="logout" link>
						<v-list-item-icon>
							<v-icon>mdi-logout-variant</v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title>Log out</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-app-bar>

		<router-view :key="$route.fullPath"></router-view>

		<v-dialog v-model="showChangePassword" max-width="500">
			<v-card>
				<v-card-title>Change password</v-card-title>
				<v-form class="px-5">
					<v-alert v-model="alert.show" :type="alert.type" dismissible>{{alert.message}}</v-alert>
					<v-text-field v-model="password" label="Password" type="password"></v-text-field>
					<v-text-field v-model="confirmPassword" label="Confirm password" type="password"></v-text-field>
				</v-form>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="showChangePassword = false">Cancel</v-btn>
					<v-btn @click="changePassword" color="primary">Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="$store.state.notification.show" max-width="500">
			<v-card style="padding:20px;">
				<div style="display:flex;justify-content:space-between;">
					<h2 style="margin-bottom:10px;">{{$store.state.notification.title}}</h2>
					<v-btn icon color="secondary" @click="hideNotification">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</div>

				<template v-if="$store.state.notification.content && $store.state.notification.content.type === 'NOTIFICATION'">
					<div style="color:#C42126;font-size:14px;" :key="item" v-for="item in $store.state.notification.content.fieldErrorList" v-html="item"></div>
					<div style="color:#ED5025;font-size:14px;" :key="item" v-for="item in $store.state.notification.content.errorList" v-html="item"></div>
					<div style="color:#E26026;font-size:14px;" :key="item" v-for="item in $store.state.notification.content.noticeList" v-html="item"></div>
				</template>
				<template v-else>
					<div style="color:#E26026;font-size:14px;" v-html="$store.state.notification.content"></div>
				</template>
				<div style="text-align:center;margin-top:20px;">
					<v-btn color="primary" @click="hideNotification">Close</v-btn>
				</div>
			</v-card>
		</v-dialog>

		<img v-show="$root.loader.value" src="loader.svg" class="loader" />
	</v-app>
</template>

<script>
import axios from "axios";

export default {
	data: function() {
		return {
			showChangePassword: false,
			password: null,
			confirmPassword: null,
			alert: { show: false, message: "" }
		};
	},
	methods: {
		changePassword() {
			axios
				.post("/system/changepassword", {
					password: this.password,
					confirmPassword: this.confirmPassword
				})
				.then(() => {
					[this.alert.type, this.alert.message, this.alert.show] = ["success", "Your password has been changed", true];
					this.$refs.form.reset();
				})
				.catch(() => {
					[this.alert.type, this.alert.message, this.alert.show] = ["error", "Change password failed", true];
				});
		},
		logout() {
			this.$store
				.dispatch("logout")
				.then(() => {
					this.$router.push("/user");
				})
				.catch(() => {});
		},
		hideNotification() {
			if (this.$store.state.notification.title === "Unauthorized") {
				this.$store.commit("hideNotification");
				this.$router.push("/user");
			} else {
				this.$store.commit("hideNotification");
			}
		}
	}
};
</script>