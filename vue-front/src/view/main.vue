<template>
    <div>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous" />
        <div id="mainslider">
            <splide :options="options">
                <splide-slide>
                    <img class="slider-image" src="../assets/banner1.png" alt="main1" />
                </splide-slide>
                <splide-slide>
                    <img class="slider-image" src="../assets/banner2.png" alt="main1" />
                </splide-slide>
                <splide-slide>
                    <img class="slider-image" src="../assets/banner3.png" alt="main2" />
                </splide-slide>
            </splide>
        </div>
        <div class="content cate-list">
            <h2 class="home_title" >여행지 BEST</h2><br>
            <div class="s1" style="height: 230px; scale:120%">
                <div class="card" style="width: 20rem; height: 370px; border: none; margin: 0 1%;"
                    v-for="(tv, index) in filteredTvList(1).slice(0, 4)" :key="index">
                    
                    <span class="rank-badge"><i v-if="!index" class="fas fa-crown crown"></i><strong>{{ index + 1 }}</strong> 위</span>
                    <a :href="'http://localhost:8080/tvdetail/' + tv.trip_no" class="imgSpace">
                        <img :width="230 "
                            :src="tv.trip_img ? require(`../../../node-back/uploads/${tv.trip_img}`) : '/empty.jpg'"
                            alt="이미지" />
                    </a>
                    <div class="card-body" style="padding: 1px;">
                        <p class="card-text align-left tv-nm" style="font-size: 15px" @click="goToDetail(tv.trip_no)">
                            {{ tv.trip_tit }}
                        </p>
                        <p class="card-text align-left" style="margin: 0;">
                             <span class="badge text-bg-light" style="font-size: 12px">[{{ tv.trip_local_nm }}]</span>
                        </p>
                    </div>
                </div>
            </div>
<br/>
            <h2 class="home_title">축제 BEST</h2><br/><br/>
            <div class="s1" style="height: 350px; scale:120%">
                <div class="card" style="width: 20rem; height: 370px; border: none; margin: 0 1%;"
                    v-for="(fs, index) in filteredFsList(2).slice(0, 4)" :key="index">
                    <span class="rank-badge"><i v-if="!index" class="fas fa-crown crown"></i><strong>{{ index + 1 }}</strong> 위</span>
                    <a :href="'http://localhost:8080/fsdetail/' + fs.trip_no" class="imgSpace">
                        <img :width="230"
                            :src="fs.trip_img ? require(`../../../node-back/uploads/${fs.trip_img}`) : '/empty.jpg'"
                            alt="이미지" />
                    </a>
                    <div class="card-body" style="padding: 1px;">
                        <p class="card-text align-left fs-nm" style="font-size: 15px" @click="goToDetail(fs.trip_no)">
                            {{ fs.trip_tit }}
                        </p>
                        <p class="card-text align-left" style="margin: 0;">
                            <span class="badge text-bg-light" style="font-size: 12px">[{{ fs.trip_local_nm }}]</span><br/>
                            <span class="badge text-bg-light" style="font-size: 12px">축제기간 : {{fs.trip_date }}</span>
                        </p>
                    </div>
                </div>
            </div>

           

           
                </div>
            </div>
</template>
  
<script>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import axios from 'axios';

export default {
    name: 'MainSlider',
    components: {
        Splide,
        SplideSlide,
    },
    data() {
        return {
            tvList: [],
            fsList: [],
            options: {
                type: 'fade',
                rewind: true,
                perPage: 1,
                autoplay: true,
                interval: 3000,
                pauseOnHover: false,
                arrows: false,
                dots: true,
                animatedDots: true,
                transition: 'fade',
                speed: 800,
            },
        };
    },
    mounted() {
        this.getTvList();
        this.getFsList();
    },
    methods: {
        async getTvList() {
            try {
                const response = await axios.get('http://localhost:3000/best/tvbest');
                this.tvList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async getFsList() {
            try {
                const response = await axios.get('http://localhost:3000/best/fsbest');
                this.fsList = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        goToDetail(trip_no) {
            window.location.href = `http://localhost:8080/tvdetail/${trip_no}`;
        },
         goToDetail2(trip_no) {
            window.location.href = `http://localhost:8080/fsdetail/${trip_no}`;
        },
        formatPrice(price) {
            if (price !== undefined) {
                const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                return `${formattedPrice} `;
            }
            return '';
        },
        filteredTvList(category) {
            return this.tvList.filter((tv) => tv.trip_category === category);
        },
        filteredFsList(category) {
            return this.fsList.filter((fs) => fs.trip_category === category);
        },
    },
};
</script>
  
  
<style scoped>
.slider-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
}

@media screen and (max-width: 768px) {
    .slider-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    img {
        width: auto;
        height: 200px;
        /* object-fit: contain; 이미지 비율 */
    }
}

@font-face {
    font-family: 'ONE-Mobile-Regular';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/ONE-Mobile-Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

.cate-list {
    font-family: ONE-Mobile-Regular;
}

.goods-nm {
    font-size: 14px;
    color: black;
    font-weight: bold;
}

.goods-nm:hover {
    color: #FFAF7D;
    cursor: pointer;
}

.goods-price {
    font-size: 13px;
}

.cate-header {
    display: flex;
    justify-content: space-between;
}

.cate-header .h6 {
    font-size: 14px;
    margin: auto;
}

.crown {
    padding-right: 5px;
}

/* 이미지 확대 */
.imgSpace {
    max-width: 230px;
    max-height: 230px;
    min-width: 100px;
    min-height: 100px;
    overflow: hidden;
    padding: auto;
    border-radius: 15%;
    background-color: #eeeeee;
}

a img {
    margin: auto;
    width: 100%;
    height: 200px;

}

a:hover img {
    transform: scale(1.12);
    transition: all 0.1s linear;
}

a:not(:hover) img {
    transform: scale(1.0);
    transition: all 0.1s linear;
}

/* ----------------------------- */

.card-text {
    margin: 3px;
    margin-top: 5px;
}

.card-text.align-left {
    text-align: left;
}

.card {
    flex-direction: column;
    flex-wrap: wrap;
}

.s1 {
    display: flex;
    margin-bottom: 150px;
}

.content {
    max-width: 1040px;
    width: 80%;
    margin: auto;
    padding-top: 30px;

}

.home_title {
    margin: 40px 0px 20px 0px;
    text-align: center;
}

@media screen and (max-width: 768px) {

    img {
        width: auto;
        height: 200px;
        /* object-fit: contain; 이미지 비율 */
    }
}
</style>