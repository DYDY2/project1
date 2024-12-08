<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <canvas id="myChart" width="400" height="400"></canvas>
  </div>
</template>
<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  mounted() {
    this.getChartData();
  },
  methods: {
    async getChartData() {
      try {

        const [response, response2] = await Promise.all([
          axios.get(`http://localhost:3000/best/likeCount`),
          axios.get(`http://localhost:3000/best/likeCount2`)
        ]);

        const tvLikesCount = response.data;
        const fsLikesCount = response2.data;

        // Prepare chart data
        const labels = ['TV Likes', 'FS Likes'];
        const data = {
          labels: labels,
          datasets: [{
            label: 'Likes Count',
            data: [tvLikesCount, fsLikesCount],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }]
        };

        // Render chart
        const ctx = document.getElementById('myChart');


        const myChart = new Chart(ctx, {
          type: 'doughnut', // Change chart type as per your preference (bar, line, etc.)
          data: data,
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
        myChart;
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>

<style scoped>
#myChart{
  scale: 50%;
  margin-top: -400px;
}
</style>