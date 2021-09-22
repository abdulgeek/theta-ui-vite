<template>
	<v-app>
		<router-view :key="$route.fullPath"></router-view>

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
export default {
	methods: {
		hideNotification() {
			this.$store.commit("hideNotification");
		}
	}
};
</script>