<template>
    <div>
        <div class="content cate-list">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">

            <div class="cate-header">
                
                <h1>여행지 / 축제</h1>
                 <p class="h6"> 총 <strong>{{allList.length || allList2.length || tvList.length + fsList.length }}</strong> 개</p>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                        data-bs-toggle="dropdown" aria-expanded="false" style="border: none;"> {{ sortCase }}
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" href="#" @click="sortList(0)">최신순</a></li>
                        <li><a class="dropdown-item" href="#" @click="sortList(1)">오래된순</a></li>
                        <li><a class="dropdown-item" href="#" @click="sortList(2)">여행지</a></li>
                        <li><a class="dropdown-item" href="#" @click="sortList(3)">축제</a></li>
                    </ul>
                </div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            
           <div class="s1" v-for="(row, rowIndex) in rowList" :key="rowIndex" style="height: 270px;  scale:120%">
                <div class="card" style="width: 230px; height: 370px; border:none; margin: 0 1%"
                    v-for="(item, index) in row" :key="index">
                    <a class="imgSpace" :href="'http://localhost:8080/' + (item.trip_category===1 ? 'tvdetail/' + item.trip_no : 'fsdetail/' + item.trip_no)">
                        <img :width="230"
                            :src="item.trip_img ? require(`../../../node-back/uploads/${item.trip_img}`) : (item.trip_img ? require(`../../../node-back/uploads/${item.trip_img}`) : '/empty.jpg')"
                            alt="이미지" />
                    </a>
                    <div>
                        <!-- 번호: {{ item.trip_category }}/ -->
                     <!-- TV 번호: {{ item.tv_no }}
                     FS 번호: {{ item.fs_no }} -->
                     <!-- {{item}} -->
                     </div>
                    <div class="card-body" style="padding: 1px;">
                        <p class="card-text align-left" style="font-size: 15px" @click="goToDetail(item.trip_no ? item.trip_no : item.trip_no)"> 
                            {{ item.trip_tit || item.trip_tit }}
                            
                     
                        </p>
                        <p class="card-text align-left" style="margin: 0;">
                            <span class="badge text-bg-light" style="font-size: 12px">[{{ item.trip_local_nm || item.trip_local_nm }}]</span><br>
                            <span v-if="item.trip_date" class="badge text-bg-light" style="font-size: 12px">{{ item.trip_date }}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="allList.length == 0 && allList2.length == 0 && tvList.length == 0 && fsList.length == 0" class="s1">
                <h1><img src="../assets/img_notReady.png" alt="..." style="text-align: center"></h1>
            </div>
            
            <nav aria-label="Page">
                <ul class="pagination justify-content-center">
                    <ul v-for="i in pageCnt" :key="i" class="pagination justify-content-center">
                        <a href="#top" style="text-decoration: none;">
                            <li v-if="i != pageNum + 1" class="page-item page-link page_btn" @click="setPage(i)">{{ i }}
                            </li>
                            <li v-else class="page-item page-link bg-secondary page_btn btn_active" @click="setPage(i)">{{ i
                            }}</li>
                        </a>
                    </ul>
                </ul>
            </nav>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';
export default {
    data() {
        return {
            tvList: [],
            fsList: [],
            allList: [], //최신순
            allList2: [], //오래된순
            rowList: [],
            sortCase: "최신순",
            pageTvList: [],
            pageFsList: [],
            pageAllList: [],
            pageAllList2: [],
            pageNum: 0,
            pageCnt: 0,
            onePageCnt: 10,
        };
    },
    mounted() {
        // this.getTvList(0);
        // this.getFsList(0);
        this.getAllList(); //최신순이 처음 실행할때 나오도록
        // this.getAllList2(0);
    },
    
    methods: {
        setPage(page) {
            this.pageNum = page - 1;
            this.sliceList();
        },
        sliceList() {
            const start = 0 + this.pageNum * this.onePageCnt;
            this.pageTvList = this.tvList.slice(start, start + this.onePageCnt);
            this.pageFsList = this.fsList.slice(start, start + this.onePageCnt);
            this.pageAllList = this.allList.slice(start, start + this.onePageCnt);
            this.pageAllList2 = this.allList2.slice(start, start + this.onePageCnt);
        },
        sortList(sortNum) {
            if (sortNum == 0) {
                this.sortCase = "최신순";
                //  this.fsList = []; 
                // this.tvList = [];  
                // this.allList2=[];
                this.getAllList(sortNum);
            } else if (sortNum == 1) {
                this.sortCase = "오래된순";
                // this.fsList = []; 
                // this.tvList = [];  
                // this.allList=[];
                this.getAllList2(sortNum);
            } else if (sortNum == 2) {
                this.sortCase = "여행지";
                this.fsList = [];  
                this.allList=[];
                this.allList2=[];
                this.getTvList(sortNum);
            } else if (sortNum == 3) {
                this.sortCase = "축제";
                this.tvList = [];  
                this.allList=[];
                this.allList2=[];
                this.getFsList(sortNum);
            }
            
        },
        
         goToDetail(trip_no, trip_category) {
             
            // window.location.href = `http://localhost:8080/${trip_no ? 'tvdetail/' + trip_no : 'fsdetail/' + trip_no}`;
            window.location.href = `http://localhost:8080/${trip_category===1 ? 'tvdetail/' + trip_no : 'fsdetail/' + trip_no}`;
        },
        async getAllList(sortCase) {
            try {
                const response = await axios.get(`http://localhost:3000/best/all/${sortCase}`);
                // const response = await axios.get(`http://localhost:3000/best/tvSearch/${this.keyword}/${sortCase}`);
                this.allList = response.data;
                this.pageCnt = Math.ceil((this.allList.length) / this.onePageCnt);
                this.setPage(1);
                 this.allArrangeRows();
            } catch (error) {
                console.error(error);
            }
        },
        async getAllList2(sortCase) {
            try {
                const response = await axios.get(`http://localhost:3000/best/all2/${sortCase}`);
                // const response = await axios.get(`http://localhost:3000/best/tvSearch/${this.keyword}/${sortCase}`);
                this.allList2 = response.data;
                this.pageCnt = Math.ceil((this.allList2.length) / this.onePageCnt);
                this.setPage(1);
                this.all2ArrangeRows();
            } catch (error) {
                console.error(error);
            }
        },
        async getTvList(sortCase) {
            try {
                const response = await axios.get(`http://localhost:3000/best/tv/${sortCase}`);
                // const response = await axios.get(`http://localhost:3000/best/tvSearch/${this.keyword}/${sortCase}`);
                this.tvList = response.data;
                this.pageCnt = Math.ceil((this.tvList.length) / this.onePageCnt);
                this.setPage(1);
                this.arrangeRows();
            } catch (error) {
                console.error(error);
            }
        },
        async getFsList(sortCase) {
            try {
                const response = await axios.get(`http://localhost:3000/best/fs/${sortCase}`);
                // const response = await axios.get(`http://localhost:3000/best/fsSearch/${this.keyword}/${sortCase}`);
                this.fsList = response.data;
                this.pageCnt = Math.ceil((this.fsList.length) / this.onePageCnt);
                this.setPage(1);
                this.arrangeRows();
            } catch (error) {
                console.error(error);
            }
        },
        
        arrangeRows() { //축제, 여행지 탭 눌렀을때 화면 부분
            this.rowList = [];
            const rowSize = 5;
            let row = [];
            const combinedList = [...this.pageTvList, ...this.pageFsList];

            combinedList.forEach((item, index) => {
                row.push(item);
                if ((index + 1) % rowSize === 0 || index === combinedList.length - 1) {
                    this.rowList.push(row);
                    row = [];
                }
            });
        },
         allArrangeRows() {
            this.rowList = [];
            const rowSize = 5;
            let row = [];
            const combinedList = [...this.pageAllList];

            combinedList.forEach((item, index) => {
                row.push(item);
                if ((index + 1) % rowSize === 0 || index === combinedList.length - 1) {
                    this.rowList.push(row);
                    row = [];
                }
            });
        },
        all2ArrangeRows() {
            this.rowList = [];
            const rowSize = 5;
            let row = [];
            const combinedList = [...this.pageAllList2];

            combinedList.forEach((item, index) => {
                row.push(item);
                if ((index + 1) % rowSize === 0 || index === combinedList.length - 1) {
                    this.rowList.push(row);
                    row = [];
                }
            });
        },
    },
    
    // watch를 추가하거나 아니면 async getFsList(sortCase) { 부분들에서 this.arrangeRows(); 추가하기.


    // watch: {
    //     allList: {
    //         immediate: true,
    //         handler() {
    //             this.allArrangeRows();
    //         }
    //     },
    //     allList2: {
    //         immediate: true,
    //         handler() {
    //             this.all2ArrangeRows();
    //         }
    //     },
    //     tvList: {
    //         immediate: true,
    //         handler() {
    //             this.arrangeRows();
    //         }
    //     },
    //     fsList: {
    //         immediate: true,
    //         handler() {
    //             this.arrangeRows();
    //         }
    //     }
    // }
};
</script>
<style scoped>
@font-face {
    font-family: 'ONE-Mobile-Regular';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/ONE-Mobile-Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

.page_btn {
    border-radius: 100px;
    color: #cc8c00;
    border: none;
}

.btn_active {
    color: white;
    background-color: #cc8c00;
}


.cate-list {
    font-family: ONE-Mobile-Regular;
}

.tv-nm {
    font-size: 14px;
    color: black;
    font-weight: bold;
}

.tv-tv:hover {
    color: #FFAF7D;
    cursor: pointer;
}

.tv-price {
    font-size: 13px;
}

.cate-header {
    display: flex;
    justify-content: space-between;
}

.cate-header mark {
    height: 36px;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    color: #cc8c00;
    background-color: #ffffff;
}

.cate-header .h6 {
    font-size: 14px;
    margin: auto;
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

@media screen and (max-width: 768px) {

    img {
        width: auto;
        height: 200px;
        /* object-fit: contain; 이미지 비율 */
    }
}
</style>


