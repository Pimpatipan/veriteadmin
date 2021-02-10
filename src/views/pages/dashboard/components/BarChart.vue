<template>
  <div>
    <CChartBar
      :datasets="[
      {
        data: yData,
        backgroundColor: '#E55353',
         label: 'Revenue',
      }
    ]"
      :labels="xData"
      :options="options"
      class="panel-layout-chart"
    />
  </div>
</template>

<script>
import { CChartBar } from "@coreui/vue-chartjs";

export default {
  components: { CChartBar },
  props: {
    xData: {
      required: true,
      type: Array
    },
    yData: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      options: {
        maintainAspectRatio: false,
        legend: {
          labels: { boxWidth: 13 },
          position: "bottom"
        },
        responsive: true,
        scales: {
          xAxes: [{ display: true, stacked: true }],
          yAxes: [
            {
              display: true,
              stacked: false,
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    };
  },
  computed: {
    defaultDatasets() {
      return this.yData;
    }
  }
};
</script>

<style scoped>
::v-deep .chartjs-render-monitor {
  width: 400;
  height: 400;
}
::v-deep .panel-layout-chart {
  /* min-width: 600px; */
  height: 300px;
}

@media (max-width: 600px) {
  ::v-deep .panel-layout-chart {
    margin-top: 0px;
  }
}
</style>