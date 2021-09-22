<template>
	<v-main style="margin:0 10px;">
		<div style="height:10px;"></div>
		<v-data-table :headers="fieldList" :items="personList" sort-by="id" :search="keyword" :footer-props="{ itemsPerPageOptions: [50,100,500,-1] }">
			<template v-slot:top>
				<v-row no-gutters style="padding:5px 0 0 0;">
					<v-col cols="12" sm="6">
						<div class="d-flex px-2">
							<h2>Person list</h2>
						</div>
					</v-col>
					<v-col cols="12" sm="6">
						<div class="d-flex px-2">
							<v-text-field v-model="keyword" append-icon="mdi-magnify" label="Search" hide-details style="margin-right:10px;"></v-text-field>
							<v-btn small fab dark color="secondary" title="Add" @click="$router.push('/tenant/person/add')">
								<v-icon>mdi-plus</v-icon>
							</v-btn>
						</div>
					</v-col>
				</v-row>
			</template>
			<template v-slot:item.active="{ item }">
				<v-icon v-if="item.active === true" color="green" title="Active">mdi-check</v-icon>
				<v-icon v-else color="red" title="Inactive">mdi-block-helper</v-icon>
			</template>
			<template v-slot:item.role="{ item }">{{ $root.enum(item.role) }}</template>
			<template v-slot:item.action="{ item }">
				<v-icon @click="$router.push('/tenant/person/edit/' + item.id)">mdi-pencil</v-icon>
				<v-icon @click="showDeletePerson(item)">mdi-delete</v-icon>
			</template>
			<template v-slot:no-data>Empty list</template>
		</v-data-table>

		<v-dialog v-model="dialogDelete" max-width="600px">
			<v-card>
				<v-card-title>
					<span class="headline">Delete</span>
				</v-card-title>
				<v-card-text>Are you sure you want to delete '{{ person.name }}' ({{ person.id }})?</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="dialogDelete = false">Cancel</v-btn>
					<v-btn @click="deletePerson" color="accent">Delete</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-main>
</template>

<script>
/* eslint-disable no-unused-vars */
import axios from "axios";

export default {
	data: function() {
		return {
			fieldList: [
				{
					text: "Id",
					value: "id"
				},
				{ text: "Name", value: "name" },
				{ text: "Email", value: "email" },
				{ text: "Active", value: "active" },
				{ text: "Role", value: "role" },
				{ text: "", value: "action", sortable: false }
			],
			keyword: "",
			personList: [],
			person: {},
			dialogDelete: false
		};
	},
	mounted: function() {
		this.listPerson();
	},
	methods: {
		listPerson() {
			axios
				.get("/system/person/list")
				.then(response => {
					this.personList = response.data;
				})
				.catch(() => {});
		},
		showDeletePerson(item) {
			this.person = this.$root.clone(item);
			this.dialogDelete = true;
		},
		deletePerson() {
			axios
				.post("/system/person/delete", { id: this.person.id })
				.then(() => {
					this.dialogDelete = false;
					this.listPerson();
				})
				.catch(() => {});
		}
	}
};
</script>