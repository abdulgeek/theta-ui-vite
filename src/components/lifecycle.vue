<template>
	<v-main>
		<div class="d-flex justify-center align-center" style="background-color:#f8f8f8;height:100vh;flex-direction:column;">
			<v-btn @click="$router.push('/lifecycle/' + (new Number(id) + 1))">Click</v-btn>
		</div>
	</v-main>
</template>

<script>
export default {
	props: ["id"],
	data: function() {
		return {};
	},
	watch: {
		$route: function() {
			this.command();
		}
	},
	created: function() {
		console.log("created " + this.id);
	},
	mounted: function() {
		console.log("mounted " + this.id);
		this.command();
	},
	methods: {
		command() {
			console.log("command");
		}
	}
};
</script>