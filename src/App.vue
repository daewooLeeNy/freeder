<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import numeral from "numeral";

const perThousand = (value, fixed) => {
  fixed = typeof fixed === "boolean" ? fixed : String(value).indexOf(".") >= 0;
  let _value;
  if (fixed) {
    _value = numeral(value).format("0,0.00");
  } else {
    _value = numeral(value).format("0,0");
  }

  return String(value).replace(/-?\d*(\.\d*)?/, _value);
};

Vue.filter("perThousand", perThousand);
Vue.filter("perThousandFloor", value => {
  return perThousand(value, false);
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
  }

  var absValue = Math.abs(value);
  if (absValue >= 100000000) {
    return `${(parseFloat(value) / 100000000).toFixed(2)}억`;
  } else if (absValue >= 10000) {
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
