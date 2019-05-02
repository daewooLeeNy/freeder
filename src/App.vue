<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import numeral from "numeral";

Vue.filter("perThousand", value => {
  return numeral(value).format("0,0");
});

Vue.filter("format10Thousand", value => {
  if (isNaN(value)) {
    return "";
  } else {
    return parseFloat(value) / 10000;
  }
});

export default {
  name: "App"
};
</script>

<style></style>
