<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import numeral from "numeral";

Vue.filter("perThousand", value => {
  return String(value).replace(/\d*/, numeral(value).format("0,0"));
});

Vue.filter("format10Thousand", value => {
  if (isNaN(value)) {
    return "";
  } else {
    return parseFloat(value) / 10000;
  }
});

Vue.filter("format100Million", value => {
  if (isNaN(value)) {
    return "";
  } else {
    return parseFloat(value) / 100000000;
  }
});

Vue.filter("formatMultipleUnitFrom10TTo100M", value => {
  if (isNaN(value)) {
    return "";
  } else if (value >= 100000000) {
    return `${(parseFloat(value) / 100000000).toFixed(2)}억`;
  } else if (value >= 10000) {
    return `${Math.ceil(parseFloat(value) / 10000)}만원`;
  } else {
    return value;
  }
});

export default {
  name: "App"
};
</script>

<style></style>
