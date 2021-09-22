<template>
	<v-main style="margin:0 10px;">
		<div style="height:10px;"></div>
		<v-data-table :headers="fieldList" :items="personList" :footer-props="{ itemsPerPageOptions: [1,50,100,500,-1] }" :options.sync="personListOption" :server-items-length="personListTotal" :loading="loading" sort-by="id">
			<template v-slot:top>
				<v-row no-gutters style="padding:5px 0 0 0;">
					<v-col cols="12" sm="6">
						<div class="d-flex px-2">
							<h2>{{ $root.capitalizeFirst(title) }} list</h2>
						</div>
					</v-col>
					<v-col cols="12" sm="6">
						<div class="d-flex px-2">
							<v-spacer></v-spacer>
							<v-btn small fab dark color="secondary" title="Add" @click="showAddPerson">
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
				<v-icon @click="showEditPerson(item)">mdi-pencil</v-icon>
				<v-icon @click="showDeletePerson(item)">mdi-delete</v-icon>
			</template>
			<template v-slot:no-data>Empty list</template>
		</v-data-table>

		<v-dialog v-model="dialogAdd" fullscreen>
			<v-card>
				<v-card-title>
					<span class="headline">Add {{ title }}</span>
					<v-spacer></v-spacer>
					<v-btn fab small elevation="0" @click="dialogAdd = false"><v-icon>mdi-close</v-icon></v-btn>
				</v-card-title>
				<v-card-text>
					<v-text-field v-model="person.name" label="Name"></v-text-field>
					<v-text-field v-model="person.email" label="Email"></v-text-field>
					<v-text-field v-model="person.password" label="Password" type="password"></v-text-field>
					<v-switch v-model="person.active" label="Active"></v-switch>
					<v-select v-model="person.role" label="Role" :items="roleList"></v-select>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="dialogAdd = false">Cancel</v-btn>
					<v-btn @click="addPerson" color="primary">Add</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="dialogEdit" fullscreen>
			<v-card>
				<v-card-title>
					<span class="headline">Edit {{ title }}</span>
					<v-spacer></v-spacer>
					<v-btn fab small elevation="0" @click="dialogEdit = false"><v-icon>mdi-close</v-icon></v-btn>
				</v-card-title>
				<v-card-text>
					<v-text-field v-model="person.name" label="Name"></v-text-field>
					<v-text-field v-model="person.email" label="Email"></v-text-field>
					<v-text-field v-model="person.password" label="Password" type="password"></v-text-field>
					<v-switch v-model="person.active" label="Active"></v-switch>
					<v-select v-model="person.role" label="Role" :items="roleList"></v-select>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="dialogEdit = false">Cancel</v-btn>
					<v-btn @click="editPerson" color="primary">Edit</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="dialogDelete" max-width="600px">
			<v-card>
				<v-card-title>
					<span class="headline">Delete {{ title }}</span>
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
			title: "person",
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
			personList: [],
			person: {},
			dialogAdd: false,
			dialogEdit: false,
			dialogDelete: false,
			roleList: [],
			personListOption: {},
			personListTotal: 0,
			loading: true
		};
	},
	mounted: function() {
		this.listPerson();
		this.listRole();
	},
	watch: {
		personListOption: {
			handler() {
				this.listPerson();
			},
			deep: true
		}
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
		listPerson() {
			const { sortBy, sortDesc, page, itemsPerPage, multiSort } = this.personListOption;
			let sortField = "id";
			let sortDirection = "desc";
			if (!multiSort && sortBy && sortBy.length === 1 && sortDesc && sortDesc.length === 1) {
				sortField = sortBy[0];
				sortDirection = sortDesc[0] ? "asc" : "desc";
			}
			axios
				.get("/system/person/list/pagination?page=" + page + "&pageSize=" + itemsPerPage + "&sortField=" + sortField + "&sortDirection=" + sortDirection)
				.then(response => {
					this.personList = response.data.list;
					this.personListTotal = response.data.total;
					this.loading = false;
				})
				.catch(() => {});
		},
		showAddPerson() {
			this.person = {};
			this.dialogAdd = true;
		},
		addPerson() {
			axios
				.post("/system/person/add", { person: this.person })
				.then(() => {
					this.dialogAdd = false;
					this.listPerson();
				})
				.catch(() => {});
		},
		showEditPerson(item) {
			this.person = this.$root.clone(item);
			this.dialogEdit = true;
		},
		editPerson() {
			axios
				.post("/system/person/edit", { person: this.person })
				.then(() => {
					this.dialogEdit = false;
					this.listPerson();
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