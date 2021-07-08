<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-toolbar-title>
          낙원계산기 (feat 경제적자유)
        </q-toolbar-title>

        <q-btn :color="isV1 ? 'primary' : ''" @click="goV1">v1</q-btn>
        <q-btn :color="isV2 ? 'primary' : ''" @click="goV2">v2</q-btn>
        <q-btn flat round dense @click="goQuestion">
          <q-icon name="help_center" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MyLayout",
  data() {
    return {
    };
  },
  computed: {
    isV1() {
      return this.$route.name === 'v1';
    },
    isV2() {
      return this.$route.name === 'v2';
    }
  },
  methods: {
    goQuestion() {
      window.open("https://dev-daze.tistory.com/1", "_blank");
    },
    goV1() {
      window.gtag('menu', 'click', {
        event_category: 'menu',
        event_label: 'v1'
      });

      if(!this.isV1) {
        this.$router.push({name: 'v1'});
      }
    },
    goV2() {
      // TODO 로그 안남음
      window.gtag('menu', 'click', {
        event_category: 'menu',
        event_label: 'v2',
      });

      if(!this.isV2) {
        this.$router.push({name: 'v2'});
      }

    },
  }
};
</script>

<style></style>
