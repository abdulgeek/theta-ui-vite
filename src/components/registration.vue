<template>
	<v-main>
		<div class="d-flex justify-center align-center" style="background-color:#f8f8f8;height:100vh;">
			<v-form>
				<v-card width="360">
					<v-card-title class="title d-flex justify-center align-center" style="background-color:#fff;">
						<v-img max-width="150" src="logo.png"></v-img>
					</v-card-title>
					<v-card-text style="padding-top:20px;">
						<v-text-field v-model="person.name" label="Name"></v-text-field>
						<v-text-field v-model="person.email" label="Email"></v-text-field>
						<v-text-field v-model="person.password" label="Password" type="password"></v-text-field>
						<v-select v-model="person.role" label="Role" :items="roleList"></v-select>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn @click="register" color="primary">Register</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</div>
	</v-main>
</template>

<script>
import axios from "axios";

export default {
	data: function() {
		return {
			person: {},
			roleList: []
		};
	},
	mounted: function() {
		this.listRole();
	},
	methods: {
		listRole() {
			axios
				.get("/system/common/person/role/list")
				.then(response => {
					this.roleList = response.data;
				})
				.catch(() => {});
		},
		register() {
			axios
				.post("/system/authentication/register", { person: this.person })
				.then(() => {
					this.$store.commit("showNotification", { title: "Notification", content: "Registration successful" });
				})
				.catch(() => {});
		}
	}
};
</script>