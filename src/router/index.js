import { createRouter, createWebHistory } from "vue-router";
// import Home from "../views/Home.vue";
import navigation from "../components/navigation.vue";
import index from "../components/index.vue";
import registration from "../components/registration.vue";
import person from "../components/person.vue";
import dashboard from "../components/dashboard.vue";
import menu from "../components/menu.vue";

const routes = [
	{
		path: "/",
		component: navigation,
		props: true,
		children: [
			{ path: "/", component: index, props: true },
			{ path: "/register", component: registration, props: true }
		]
	},
	
	// portal
	{
		path: "/",
		component: menu,
		props: true,
		children: [
			{ path: "/person", component: person, props: true, meta: { restricted: true } },
			{ path: "/dashboard", component: dashboard, props: true, meta: { restricted: true } }
		]
	}
	
	// {
	// 	path: "/home",
	// 	name: "Home",
	// 	component: Home,
	// },
	// {
	// 	path: "/about",
	// 	name: "About",
	// 	// route level code-splitting
	// 	// this generates a separate chunk (about.[hash].js) for this route
	// 	// which is lazy-loaded when the route is visited.
	// 	component: function() {
	// 		return import(/* webpackChunkName: "about" */ "../views/About.vue");
	// 	},
	// },
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
