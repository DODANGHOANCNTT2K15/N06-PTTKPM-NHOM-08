<template>
  <header>
        <div>
            <p>PLAYBOOK TỦ SÁCH CHO MỌI NHÀ</p>
        </div>
        <div>
            <div>
                <img src="@/assets/images/Logo_00.png" alt="">
            </div>
            <div>
                <div>
                    <div>
                        <form action="" class="search-container"> 
                            <i class="fa fa-search"></i> 
                            <input type="text" placeholder="Tìm kiếm"> 
                            <button type="submit">Tìm kiếm</button> 
                        </form>
                        <div>
                            <div>
                                <button type="button">
                                    <i class="fa fa-home"></i> Trang chủ
                                </button>
                                <button>
                                    <i class="fa fa-user"></i> Tài khoản
                                </button>
                            </div>
                            <div id="div_cart">
                                <button @click="$router.push('/cart')"><i class="fas fa-shopping-basket"></i></button>
                                <div>0</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div class="tag_search">
                                Truyện
                            </div>
                            <div class="tag_search">
                                Tiểu thuyết
                            </div>
                        </div>
                        <div>
                            <i class="fas fa-map-marker-alt"></i>
                            <a id="location_text" @click="goToAddress">Thị trấn Hương Sơn, Phú Bình, Thái Nguyên</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'HeaderComponent',
  setup() {
    const router = useRouter();

    const goToAddress = () => {
      router.push('/address');
    };

    return {
      goToAddress,
    };
  },
};
</script>

<style scoped>
header > div:nth-child(1) {
    background-color: black;
    color: white;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8em;
}
header > div:nth-child(2){
    background-color: rgb(255, 255, 255);
    height: 110px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10% 0 10%;
}
header > div:nth-child(2) > div:nth-child(2){
    width: 80%;
}
header > div:nth-child(2) > div:nth-child(2) > div:nth-child(1){
    background-color: rgb(255, 255, 255);
    width: 100%;
    height: 60%;
}
header > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form {
    position: relative;
    width: 34vw;
}
header > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form > input{
    width: 34vw;
    height: 40px;
    border-radius: 20px;
    position: absolute;
    padding-left: 35px;
    padding-right: 30px;
    box-sizing: border-box;
    border-color: rgba(74, 141, 176, 1);
}
header > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form > button{
    position: absolute;
    right: 0;
    background-color: rgb(255, 255, 255);
    color: rgba(74, 141, 176, 1);
    font-size: 1em;
    font-weight: bold;
    border: none;
    height: 38px;
    width: 100px;
    border-top-right-radius: 20px;border-bottom-right-radius: 20px;
    cursor: pointer;
    box-sizing: border-box;
    border: rgba(74, 141, 176, 1) 1px solid;
    transform: translateY(1px);
}
header > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > form > i{
    position: absolute;
    left: 12px;
    top: 12px;
    color: rgba(74, 141, 176, 1);
    z-index: 1000;
}
header > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div{
    margin-left: 43.5vw;
}   
header > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > button {
    color: black;
    border: none;
    height: 40px;
    box-sizing: border-box;
    padding: 0px 20px;
    font-weight: 600;
    font-size: 0.9em;
    background-color: white;
}
header > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > button > i{
    margin-right: 5px;
}
header > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div{
    display: flex;
}
#div_cart{
    position: relative;
    padding-left: 20px;
    margin-left: 10px;
    border-left: 1px solid rgba(74, 141, 176, 1);
}
#div_cart > button{
    height: 40px;
    width: 40px;   
    background-color: rgb(219, 219, 219);
    border: none;
    border-radius: 10px;
    color: rgba(74, 141, 176, 1);
    font-size: 1em;
}
#div_cart > div{
    position: absolute;
    background-color: rgb(245, 0, 0);
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    top: -5px;
    right: -5px;
}
header > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) {
    display: flex;
    flex-wrap: wrap;
}
header > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) {
    width: 100%;
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
    padding-right: 5%;
} 
header > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) {
    display: flex;
    flex-wrap: wrap;
}
#location_text { 
    text-decoration: underline; 
    font-style: italic; 
}
.tag_search{
    padding: 5px 20px;
    background-color: rgb(222, 222, 222);
    color: rgba(74, 141, 176, 1);
    margin-right: 10px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 600;
}
</style>
