<template>
  <body>
    <div id="app" ref="app" class="container">
      <div class="map">
        <div class="col-12">
          <svg ref="map" class="w-100"></svg>
        </div>
      </div>
      <div class="region-container">
        <h2 class="region">{{ regionname }}</h2>
      </div>
        <div class="trip-list">
          <div class="card" :key="i" v-for="(row, i) in rowList" ref="row-container">
            <a :href="'/fsdetail/'+ row.trip_no" class="imgSpace" >
                <img :width="230" :src="row.trip_img ? require(`../../../node-back/uploads/${row.trip_img}`) : require('/goodsempty.jpg')" alt="여행지 이미지">
            </a>  
                <div class="card-body">
                <p class="card-text align" style="margin-left:10px" @click="goToDetail2(row.trip_no)">{{ row.trip_tit }}</p>
                 <p class="card-text align-left" style="margin: 0;">
                           
                            <span class="badge text-bg-light" style="font-size: 12px; color:black">축제기간 : {{row.trip_date }}</span>
                        </p>
              </div>
          </div>
        </div>
    </div>
</body>
</template>

<script>
import * as d3 from 'd3';
import KoreaMapData from '../assets/korea.json'; // GeoJSON 데이터를 임포트합니다.
import axios from 'axios';

export default {
  name: 'App',
  data(){
    return {
      rowList: [],
      colorMaping: {
        '서울특별시': 'red',
        '경기도': '#00FFFF',
        '강원도': '#CC00FF',
        '충청북도': '#CCFFCC',
        '충청남도': '#CCFF66',
        '전라북도': '#00FFFF',
        '전라남도': '#BDB76B',
        '인천광역시': '#99FF00',
        '대구광역시': '#FFE4C4',
        '광주광역시': '#FF8C00',
        '세종특별자치시': '#CC9966',
        '제주특별자치도': '#00CED1',
        '대전광역시': '#FAEBD7',
        '경상북도': '#00FFFF',
        '경상남도': '#F5F5DC',
        '울산광역시': '#D2691E',
        '부산광역시': '#FFF8DC',
      }
    };
  },
  mounted() {
    this.drawMap();
    // 화면 크기가 변경될 때마다 맵을 다시 그림
    window.addEventListener('resize', this.drawMap);
    this.loadFesList();
    this.getFesList(this.$route.params.id);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.drawMap);
  },
  computed: {
    regionname() {
      return this.$route.params.name;
    }

  },
  methods: {
    //지도 생성
    drawMap() {
      // const width = 500;
      // const height = 700;

      const svg = d3.select(this.$refs.map)
        // .attr('width', width)
        // .attr('height', height);
      const container = this.$refs.app;

      // 컨테이너 실제 크기를 동적으로 가져오기
      const width = container.clientWidth / 2;
      const height = container.clientHeight;

      svg.selectAll('*').remove();

      //svg 크기 설정
      svg.attr('width', width).attr('height', height);


      const projection = d3.geoMercator()
        .center([127.7669, 35.9078])
        .scale(5700)
        // .translate([width / 2, height / 2]);
        .translate([width / 2 -130, height / 2 - 30]);

      const path = d3.geoPath().projection(projection);

      svg.append('g')
        .selectAll('path')
        .data(KoreaMapData.features) // GeoJSON 데이터 사용
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#ccc')
        // .attr('fill', d => {
        //   const regon = d.properties.name;
        //   return this.colorMaping[regon] || '#ccc'; //지역에 맞는 색상 또는 기본 색상
        // })
        .attr('stroke', '#333')
        .attr('stroke-width', 0.5)
        .on('mouseover', function() {
          // const regon = d.properties.name;
          // d3.select(this).attr('fill', this.colorMaping[regon] || '#DimGray');
          // d3.select(this).attr('fill', 'DimGray');
          d3.select(this).attr('fill', 'orange');
          })
          
        .on('mouseout', function() {
          // const regon = d.properties.name;
          // d3.select(this).attr('fill', this.colorMaping[regon] || '#ccc');
          d3.select(this).attr('fill', '#ccc');
        })
        // .on('click', (event, d) => {
        //   this.$router.push(`/trip/${d.properties.name}`); // 지역 이름에따라 불러오는 게시글 
        //   if (this.getTripList()) {
        //     this.$router.push(this.getTripList());
        //   }
        // });
        .on('click', (event, d) => { // 지역에 따라 이름과 id를 갖고 온다
          const regionname = d.properties.name;
          const regionid = d.properties.id
          this.$router.push(`/festival/${regionname}/${regionid}`);
          this.getFesList(regionid);
        });

      svg.append('g')
        .selectAll('text')
        .data(KoreaMapData.features)
        .enter().append('text')
        .attr('x', d => {
          const centroid = path.centroid(d);
          if (d.properties.name === '경기도') {
            return centroid[0] + 10; // 경기도의 x 좌표를 오른쪽으로 20픽셀 이동
          }
          return centroid[0];
        })
        .attr('y', d => {
          const centroid = path.centroid(d);
          if (d.properties.name === '경기도') {
            return centroid[1] + 20; // 경기도의 y 좌표를 아래로 20픽셀 이동
          }
          if (d.properties.name === '충청남도') {
            return centroid[1] + 10; // 충청남도의 y 좌표를 아래로 10픽셀 이동
          }
          if (d.properties.name === '인천광역시') {
            return centroid[1] - 10; // 인천광역시의 y 좌표를 아래로 -10픽셀 이동
          }
          if (d.properties.name === '충청북도') {
            return centroid[1] - 10; // 충청북도의 y 좌표를 아래로 -10픽셀 이동
          }
          return centroid[1];
        })
        .attr('text-anchor', 'middle')
        .attr('font-size', '15px')
        .attr('fill', 'black')
        .text(d => d.properties.name);
    },
    goToDetail2(trip_no){
      window.location.href = `http://localhost:8080/fsdetail/${trip_no}`;
    },
    async getFesList(regionid){
        const response = await axios.get(`http://localhost:3000/trip/regions/api/${regionid}`);
        this.rowList = response.data;
         this.$nextTick(this.checkscroll);
    },
    async loadFesList() {
      const {regionid} = this.$route.params;
      if(regionid == 1) {
        await this.getTripList(1);
      }
    }

  }
    
}

</script>

<style scoped>

.container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
}


body {
  margin:0;
  overflow: hidden;
}

svg {
  width: 100%;
  height: 100%;
}
.card {
  flex-direction: column;
  flex-wrap: wrap;
  /* height: 330px; */
  display: flex;
  box-sizing: border-box;
  /* scale: 120%; */
  /* padding: 0 14%; */
  margin-bottom: 20px;
}

.card-text {
  text-align: center;
  scale: 120%;
}

.card-body {
  /* position: relative; */
  padding: 10px;
  
  
}

.card-text.align {
  text-align: left;
  padding: 3px;
}

a img {
  margin: auto;
  height: 220px;
  left: 600px;
  width: 100%;
}

a:hover img {
  transform: scale(1.12);
  transition: all 0.1s linear;
}

a:not(:hover) img {
  transform: scale(1.0);
  transition: all 0.1s linear;
}

#app{
  padding-top: 20px;

}


.map {
  position: absolute;
  width: 100%;
  height: 100%;
  right: auto;
}

.region-container {
  position: absolute;
  left: 688px;
  top: 70px;
}
.region {
  /* position: fixed;
  top: 190px;
  left: 700px;
  border: none;
  font-family: 'Courier New', Courier, monospace; */
  /* position: relative; */
  /* top: 40px;
  left: 790px; */
  margin: 0;
  padding: 0;
  border: none;
  font-family: 'Courier New', Courier, monospace;
  
}

.imgSpace {
  /* max-width: 230px;
  max-height: 900px;
  min-width: 130px;
  min-height: 230px; */
  width: 100%;
  overflow: hidden;
  /* padding: auto; */
  border-radius: 5%;
  background-color: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;

}

.trip-list {
  display: grid;
  width: 100%;
  /* grid-template-columns: repeat(4, 1fr); */
  grid-template-columns: repeat(4, minmax(20%, 1fr));
  /* grid-template-columns: repeat(4, minmax(250px, 1fr)); */
  gap: 20px;
  max-height: calc(100vh - 300px);
  min-height: 700px;
  overflow-y: auto;
  margin-top: 120px;
  padding-left: 680px;
  padding-right: 30px;
  overflow-x: hidden;
}

@media screen and (max-width: 768px) {
  .trip-list {
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 80px;
  }
} 
</style>
