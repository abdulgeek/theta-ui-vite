<template>
	<div style="min-height:50px;padding:10px;text-align:center;">
		<iframe v-if="name && name.toLowerCase().endsWith('.pdf')" :src="$root.asset(name,'file')" frameborder="0" style="height:300px;overflow:scroll;width:100%;"></iframe>
		<img v-else-if="$root.isImage(name)" :src="$root.asset(name,'large')" />
		<video v-else-if="$root.isVideo(name)" controls :src="$root.asset(name,'file')"></video>
		<div v-else style="padding:10px 100px 10px 10px;">{{name}}</div>
	</div>
</template>

<script>
export default {
	props: ["name"]
};
</script>