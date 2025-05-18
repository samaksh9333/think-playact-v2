<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  props: {
    labels: Array,
    values: Array,
    title: String,
  },
  mounted() {
    const ctx = this.$refs.canvas.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.title,
            data: this.values,
            backgroundColor: "#125cf2",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => `${val} hrs`,
            },
          },
        },
      },
    });
  },
};
</script>
