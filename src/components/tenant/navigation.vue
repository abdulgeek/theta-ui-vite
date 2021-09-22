<template>
	<v-app style="background-color:#f8f8f8;">
		<v-app-bar app dense>
			<v-app-bar-nav-icon small v-if="!drawer" @click="drawer = true;"></v-app-bar-nav-icon>
			<v-spacer></v-spacer>
			<img src="logo.png" @click="$store.commit('debug');" height="20" class="ml-1" />
			<v-spacer></v-spacer>
			{{$store.state.principal.email}}
			<v-btn small icon class="ml-2" @click="logout">
				<v-icon color="black">mdi-exit-to-app</v-icon>
			</v-btn>
		</v-app-bar>
		<v-navigation-drawer app v-model="drawer">
			<v-list nav>
				<v-list-item link>
					<v-list-item-icon @click="drawer = false;">
						<v-icon color="black">mdi-close</v-icon>
					</v-list-item-icon>
					<v-list-item-content></v-list-item-content>
				</v-list-item>
				<v-list-item>
					<v-list-item-icon>
						<v-icon color="secondary">mdi-account-circle</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<span v-bind="attrs" v-on="on">
										<strong>{{$store.state.principal.name}}</strong>
									</span>
								</template>
								{{$store.state.principal.role}}
							</v-tooltip>
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item @click="currentPassword = newPassword = confirmNewPassword = null;showEditPassword = true;" link>
					<v-list-item-icon>
						<v-icon color="secondary">mdi-lock-outline</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Change password</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-divider></v-divider>
			<v-list nav>
				<v-list-item link to="/tenant/dashboard">
					<v-list-item-icon>
						<v-icon color="secondary">mdi-monitor-dashboard</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Dashboard</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-list nav v-if="['Tenant'].includes($store.state.principal.role)">
				<v-list-item link to="/tenant/person">
					<v-list-item-icon>
						<v-icon color="secondary">mdi-account-multiple</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Person</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<router-view :key="$route.fullPath"></router-view>

		<v-dialog v-model="showEditPassword" max-width="500">
			<v-card style="padding-bottom:10px;">
				<v-card-title>Change password</v-card-title>
				<v-form ref="formEditPassword" class="px-5">
					<v-text-field v-model="currentPassword" label="Current password" type="password"></v-text-field>
					<v-text-field v-model="newPassword" label="New password" type="password"></v-text-field>
					<v-text-field v-model="confirmNewPassword" label="Confirm new password" type="password"></v-text-field>
				</v-form>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="showEditPassword = false">Cancel</v-btn>
					<v-btn @click="editPassword" color="primary">Save</v-btn>
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
			drawer: true,
			showEditPassword: false,
			currentPassword: null,
			newPassword: null,
			confirmNewPassword: null
		};
	},
	methods: {
		editPassword() {
			axios
				.post("/system/password/edit", {
					currentPassword: this.currentPassword,
					newPassword: this.newPassword,
					confirmNewPassword: this.confirmNewPassword
				})
				.then(() => {
					this.$refs.formEditPassword.reset();
					this.showEditPassword = false;
				})
				.catch(() => {});
		},
		logout() {
			this.$store
				.dispatch("logout")
				.then(() => {
					this.$router.push("/tenant");
				})
				.catch(() => {});
		},
		hideNotification() {
			if (this.$store.state.notification.title === "Unauthorized") {
				this.$store.commit("hideNotification");
				this.$router.push("/tenant");
			} else {
				this.$store.commit("hideNotification");
			}
		}
	}
};
</script>