<template>
  <div>
    <CChartPie
      :labels="data.status"
      :datasets=" [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            data: data.order
          }
        ]"
      :options="options"
    ></CChartPie>
  </div>
</template>

<script>
import { CChartPie } from "@coreui/vue-chartjs";

export default {
  components: { CChartPie },
  props: {
    data: {
      required: false,
      type: Array | Object
    }
  },
  data: function() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        pieceLabel: {
          mode: "percentage",
          precision: 1
        }
      }
    };
  }
};
</script>