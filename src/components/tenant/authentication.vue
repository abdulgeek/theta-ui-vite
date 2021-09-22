<template>
	<v-main>
		<div class="d-flex justify-center align-center" style="background-color:#f8f8f8;background-size:cover;height:100vh;">
			<v-form>
				<v-card width="360">
					<v-card-title class="title d-flex justify-center align-center" style="background-color:#fff;">
						<v-img max-width="150" src="logo.png"></v-img>
					</v-card-title>
					<v-card-text style="padding-top:20px;">
						<v-text-field v-model="email" label="Email"></v-text-field>
						<v-text-field v-model="password" label="Password" type="password" @keyup.enter="login"></v-text-field>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn @click="login" color="primary">Login</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</div>
	</v-main>
</template>

<script>
export default {
	data: function() {
		return {
			email: null,
			password: null
		};
	},
	methods: {
		login() {
			this.$store
				.dispatch("login", {
					type: "Tenant",
					email: this.email,
					password: this.password
				})
				.then(() => this.$router.push("/tenant/dashboard"))
				.catch(() => {});
		}
	}
};
</script>