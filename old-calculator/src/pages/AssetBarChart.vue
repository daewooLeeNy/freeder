<template>
  <div class="small">
    <canvas ref="myFirst"></canvas>
  </div>
</template>

<script>
// import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

// Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title);

import Chart from 'chart.js/auto';
import numeral from 'numeral';
import { calculateTotalAssetInPeriod } from '../components/Calculator';

export default {
  components: {
  },
  props: {
    asset: { required: false, type: Number },
    yearSavingAmount: { required: false, type: Number },
    interest: { required: false, type: Number },
    periodOfRetire: { required: false, type: Number },
    inflation: { required: false, type: Number },
  },
  data () {
    return {
      datacollection: {},
      thisChart: null
    }
  },
  mounted () {
    this.initChart()
  },
  watch: {
    asset() {
      this.updateData();
    },
    yearSavingAmount() {
      this.updateData();
    },
    interest() {
      this.updateData();
    },
    periodOfRetire() {
      this.updateData();
    },
    inflation() {
      this.updateData();
    },
  },
  methods: {
    initChart () {
      const {assetData, yearSavingData, yData } = this.fillData();
      this.loadChart(assetData, yearSavingData, yData);
    },
    fillData() {
      const historyOfAssets = calculateTotalAssetInPeriod({asset: this.asset, yearSavingAmount: this.yearSavingAmount, interest: this.interest, periodOfRetire: this.periodOfRetire, inflation: this.inflation });
      const totalAssetData = historyOfAssets.reduce((acc, cur) => { acc.push(cur.totalAsset); return acc;}, []);
      const assetData = historyOfAssets.reduce((acc, cur) => { acc.push(cur.calAsset); return acc;}, []);
      const yearSavingData = historyOfAssets.reduce((acc, cur) => { acc.push(cur.calYearSavingAmount); return acc;}, []);
      const yData = historyOfAssets.reduce((acc, cur) => { acc.push(`${cur.periodOfRetire}년`); return acc;}, []);

      return { historyOfAssets, totalAssetData, assetData, yearSavingData, yData};
    },
    updateData() {
      const {assetData, yearSavingData, yData } = this.fillData();
      if(this.thisChart) {
        const datasets = [];
        if (this.asset > 0) {
          datasets.push( this.addXAxisAsset(assetData));
        }

        if (this.yearSavingAmount > 0) {
          datasets.push(this.addXAxisYearSaving(yearSavingData));
        }

        this.thisChart.data.datasets=datasets;
        this.thisChart.data.labels = yData;

        this.thisChart.update();
      }
    },
    addXAxisAsset(data) {
      return {
        label: '자산',
        backgroundColor: '#FBE7C6',
        borderColor: '#FBE7C6',
        data: data,
        fill: true,
      };
    },
    addXAxisYearSaving(data) {
      return {
        label: '저축',
        backgroundColor: '#B4F8C8',
        borderColor: '#B4F8C8',
        data: data,
        fill: true,
      };
    },
    loadChart(assetData, yearSavingData, yData) {
      const labels = yData;

      const datasets = [];
      if (this.asset > 0) {
        datasets.push( this.addXAxisAsset(assetData));
      }

      if (this.yearSavingAmount > 0) {
        datasets.push(this.addXAxisYearSaving(yearSavingData));
      }

      const footer = (tooltipItems) => {
        let sum = 0;
        if(tooltipItems && tooltipItems.length >= 2) {
          tooltipItems.forEach(function(tooltipItem) {
            sum += tooltipItem.parsed.y;
          });

          return '총자산: ' + numeral(sum).format('0,0');
        }

        return '';
      };

      const data = {
        labels: labels,
        datasets: datasets
      };
      const config = {
        type: 'bar',
        data,
        options: {
          plugins: {
            title: {
              display: true,
              text: (ctx) => '총 자산 증가 추이'
            },
            tooltip: {
              callbacks: {
                 footer: footer,
              }
            },
          },
          hover: {
            mode: 'nearest',
            intersect: false
          },
          interaction: {
            mode: 'index',
            axis: 'x',
            intersect: false
          },
          radius: 0.5,
          elements: {
            line: {
              tension: 0.5
            }
          },
          scales: {
            x: {
              display: true,
              grid: {
                display: false
              },
              stacked: true
            },
            y: {
              display: true,
              grid: {
                display: false
              },
              // type: 'logarithmic',
              stacked: true
            }
          }
        }
      };
      this.thisChart = new Chart(
        this.$refs.myFirst,
        config,
      );
    },
  }
}
</script>

<style>
  .small {
    max-width: 600px;
    margin:  10px auto;
  }
</style>