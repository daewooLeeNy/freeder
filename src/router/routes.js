const paradiseCalculator = import("pages/ParadiseCalculator.vue");

const routes = [
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      {
        path: "",
        component: () => paradiseCalculator,
        redirect: "/paradise-calculator"
      },
      { path: "paradise-calculator", component: () => paradiseCalculator },
      {
        path: "paradise-calculator2",
        component: () => import("pages/ParadiseCalculator2.vue")
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
