<template>
	<v-app>
		<v-main style="display:flex;align-items:center;">
			<center>
				<h1>Unauthorized</h1>
				<p>You are not authorized to view this page.</p>
				<v-btn small :to="'/'" color="primary">Go to homepage</v-btn>
			</center>
		</v-main>
	</v-app>
</template>