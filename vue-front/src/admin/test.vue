<template>
  <div>
    <canvas ref="likeTripChartCanvas" />
    <canvas ref="likeFsChartCanvas" />
    <canvas ref="viewCountChartCanvas" />
   
    <h1>{{ msg }}</h1>
    <canvas id="myChart" width="400" height="400"></canvas>
  
  </div>
  
</template>

<script>
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

export default {
   props: {
    msg: String
  },
  data() {
    return {
      likeTripChart: null,
      viewCountChart: null,
      likeTripData: {
        labels: [],
        datasets: [
          {
            label: '여행지 좋아요 수',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      },
      likeFsData: {
        labels: [],
        datasets: [
          {
            label: '축제 좋아요 수',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      },
      viewCountData: {
        labels: [],
        datasets: [
          {
            label: '자유게시판 조회수',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  },
  mounted() {
    this.fetchLikeTripData();
    this.fetchLikeFsData();
    this.fetchViewCountData();
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
        const labels = ['여행지 좋아요 수', '축제 좋아요 수'];
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
    },
    createLikeTripChart() {
      this.likeTripChart = new Chart(this.$refs.likeTripChartCanvas, {
        type: 'bar',
        data: this.likeTripData,
        options: this.options,
      });
    },
    createLikeFsChart() {
      this.likeFsChart = new Chart(this.$refs.likeFsChartCanvas, {
        type: 'bar',
        data: this.likeFsData,
        options: this.options,
      });
    },
    createViewCountChart() {
      this.viewCountChart = new Chart(this.$refs.viewCountChartCanvas, {
        type: 'line',
        data: this.viewCountData,
        options: this.options,
      });
    },
    fetchLikeTripData() {
      axios.post("http://localhost:3000/admin/liketrip")
        .then(response => {
          const tripData = response.data;

          this.likeTripData.labels = tripData.map(item => item.trip_tit);
          this.likeTripData.datasets[0].data = tripData.map(item => item.total_good);

          const colors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ];
          const borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ];

          this.likeTripData.datasets[0].backgroundColor = tripData.map((_, index) => colors[index % colors.length]);
          this.likeTripData.datasets[0].borderColor = tripData.map((_, index) => borderColors[index % borderColors.length]);

          this.sortLikeTripData();
          this.createLikeTripChart();
        })
        .catch(error => {
          console.error('Error fetching like trip data:', error);
        });
    },
    fetchLikeFsData() {
      axios.post("http://localhost:3000/admin/likeFs")
        .then(response => {
          const fsData = response.data;

          this.likeFsData.labels = fsData.map(item => item.trip_tit);
          this.likeFsData.datasets[0].data = fsData.map(item => item.total_good);

          const colors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ];
          const borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ];

          this.likeFsData.datasets[0].backgroundColor = fsData.map((_, index) => colors[index % colors.length]);
          this.likeFsData.datasets[0].borderColor = fsData.map((_, index) => borderColors[index % borderColors.length]);

          this.sortLikeFsData();
          this.createLikeFsChart();
        })
        .catch(error => {
          console.error('Error fetching like fs data:', error);
        });
    },
    fetchViewCountData() {
      axios.post("http://localhost:3000/admin/viewcount")
        .then(response => {
          const viewCountData = response.data;

          this.viewCountData.labels = viewCountData.map(item => item.board_tit);
          this.viewCountData.datasets[0].data = viewCountData.map(item => item.board_view);

          const colors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ];
          const borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ];

          this.viewCountData.datasets[0].backgroundColor = viewCountData.map((_, index) => colors[index % colors.length]);
          this.viewCountData.datasets[0].borderColor = viewCountData.map((_, index) => borderColors[index % borderColors.length]);

          this.sortViewCountData();
          this.createViewCountChart();
        })
        .catch(error => {
          console.error('Error fetching view count data:', error);
        });
    },
    sortLikeTripData() {
      const sortedIndices = this.likeTripData.datasets[0].data
        .map((value, index) => ({ value, index }))
        .sort((a, b) => b.value - a.value)
        .map((item) => item.index);

      this.likeTripData.labels = sortedIndices.map((index) => this.likeTripData.labels[index]);
      this.likeTripData.datasets[0].data = sortedIndices.map(
        (index) => this.likeTripData.datasets[0].data[index]
      );
      this.likeTripData.datasets[0].backgroundColor = sortedIndices.map(
        (index) => this.likeTripData.datasets[0].backgroundColor[index]
      );
      this.likeTripData.datasets[0].borderColor = sortedIndices.map(
        (index) => this.likeTripData.datasets[0].borderColor[index]
      );
    },
    sortLikeFsData() {
      const sortedIndices = this.likeFsData.datasets[0].data
        .map((value, index) => ({ value, index }))
        .sort((a, b) => b.value - a.value)
        .map((item) => item.index);

      this.likeFsData.labels = sortedIndices.map((index) => this.likeFsData.labels[index]);
      this.likeFsData.datasets[0].data = sortedIndices.map(
        (index) => this.likeFsData.datasets[0].data[index]
      );
      this.likeFsData.datasets[0].backgroundColor = sortedIndices.map(
        (index) => this.likeTripData.datasets[0].backgroundColor[index]
      );
      this.likeTripData.datasets[0].borderColor = sortedIndices.map(
        (index) => this.likeFsData.datasets[0].borderColor[index]
      );
    },
    sortViewCountData() {
      const sortedIndices = this.viewCountData.datasets[0].data
        .map((value, index) => ({ value, index }))
        .sort((a, b) => b.value - a.value)
        .map((item) => item.index);

      this.viewCountData.labels = sortedIndices.map((index) => this.viewCountData.labels[index]);
      this.viewCountData.datasets[0].data = sortedIndices.map(
        (index) => this.viewCountData.datasets[0].data[index]
      );
      this.viewCountData.datasets[0].backgroundColor = sortedIndices.map(
        (index) => this.viewCountData.datasets[0].backgroundColor[index]
      );
      this.viewCountData.datasets[0].borderColor = sortedIndices.map(
        (index) => this.viewCountData.datasets[0].borderColor[index]
      );
    },
  },
};
</script>

<style scoped>
#myChart{
  scale: 70%;
  margin-top: -200px;
}
</style>