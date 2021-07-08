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
      { path: "paradise-calculator", name: "v1", component: () => paradiseCalculator },
      {
        path: "paradise-calculator2", name:"v2",
        component: () => import("pages/ParadiseCalculatorWithGraph.vue")
      },
      {
        path: "chart",
        component: () => import("pages/AssetAreaChart.vue"),
        props: {asset: 100000000, interest: 0.10, periodOfRetire: 10, yearSavingAmount: 0, inflation:0.02}
      },
      {
        path: "chart-bar",
        component: () => import("pages/AssetBarChart.vue"),
        props: {asset: 100000000, interest: 0.10, periodOfRetire: 10, yearSavingAmount: 1000000, inflation:0.02}
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
