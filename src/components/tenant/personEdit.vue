<template>
	<v-main style="margin:0 10px;">
		<div style="height:10px;"></div>
		<v-card>
			<v-card-title>
				<span class="headline">Edit</span>
				<v-btn fab small elevation="0" @click="$router.push('/tenant/person')">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text>
				<v-text-field v-model="person.name" label="Name"></v-text-field>
				<v-text-field v-model="person.email" label="Email"></v-text-field>
				<v-text-field v-model="person.password" label="Password" type="password"></v-text-field>
				<v-switch v-model="person.active" label="Active"></v-switch>
				<v-select v-model="person.role" label="Role" :items="roleList"></v-select>
				<v-row>
					<v-col md="2" cols="12">
						<v-file-input v-model="attachment1" label="Attachment"></v-file-input>
					</v-col>
					<v-col md="2" cols="12">
						<v-file-input v-model="attachment2" label="Attachment"></v-file-input>
					</v-col>
					<v-col md="2" cols="12">
						<v-file-input v-model="attachment3" label="Attachment"></v-file-input>
					</v-col>
					<v-col md="2" cols="12">
						<v-file-input v-model="attachment4" label="Attachment"></v-file-input>
					</v-col>
					<v-col md="2" cols="12">
						<v-file-input v-model="attachment5" label="Attachment"></v-file-input>
					</v-col>
					<v-col md="2" cols="12">
						<v-file-input v-model="attachment6" label="Attachment"></v-file-input>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click="$router.push('/tenant/person')">Cancel</v-btn>
				<v-btn @click="editPerson" color="primary">Edit</v-btn>
			</v-card-actions>
			<div v-if="person.attachmentList.length > 0">
				<div v-for="item in person.attachmentList" :key="item">
					<v-card outlined style="display:inline-block;float:left;margin-bottom:10px;margin-left:10px;">
						<a :href="$root.asset(item, 'file')" target="_blank">
							<media :name="item" />
						</a>
						<v-btn small fab title="Download original" @click="$root.downloadAsset(item)" style="position:absolute;right:60px;bottom:10px;">
							<v-icon>mdi-download</v-icon>
						</v-btn>
						<v-btn small fab title="Delete" @click="deleteAttachment(item)" style="position:absolute;right:10px;bottom:10px;">
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</v-card>
				</div>
				<div style="clear:both"></div>
			</div>
		</v-card>
	</v-main>
</template>

<script>
/* eslint-disable no-unused-vars */
import axios from "axios";
import media from "../media";

export default {
	components: {
		media
	},
	props: ["id"],
	data: function() {
		return {
			person: {},
			attachment1: null,
			attachment2: null,
			attachment3: null,
			attachment4: null,
			attachment5: null,
			attachment6: null,
			roleList: []
		};
	},
	mounted: function() {
		this.findPerson();
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
		findPerson() {
			axios
				.get("/system/person?id=" + this.id)
				.then(response => {
					this.person = response.data;
				})
				.catch(() => {});
		},
		editPerson() {
			let formData = new FormData();
			formData.append("person", JSON.stringify(this.person));
			if (this.attachment1) {
				formData.append("attachment1", this.attachment1);
			}
			if (this.attachment2) {
				formData.append("attachment2", this.attachment2);
			}
			if (this.attachment3) {
				formData.append("attachment3", this.attachment3);
			}
			if (this.attachment4) {
				formData.append("attachment4", this.attachment4);
			}
			if (this.attachment5) {
				formData.append("attachment5", this.attachment5);
			}
			if (this.attachment6) {
				formData.append("attachment6", this.attachment6);
			}
			axios
				.post("/system/person/edit", formData, {
					headers: {
						"Content-Type": "multipart/form-data"
					}
				})
				.then(() => {
					this.$router.push("/tenant/person");
				})
				.catch(() => {});
		},
		deleteAttachment(name) {
			axios
				.post("/system/person/attachment/delete", {
					id: this.person.id,
					name: name
				})
				.then(() => {
					this.findPerson();
				})
				.catch(() => {});
		}
	}
};
</script>