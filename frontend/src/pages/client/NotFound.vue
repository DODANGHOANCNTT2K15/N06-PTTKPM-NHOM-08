<template>
    <div class="not-found">
    <h1>404 - Không Tìm Thấy Trang</h1>
    <p>Đường dẫn bạn yêu cầu không tồn tại. Vui lòng kiểm tra lại URL hoặc quay lại <router-link to="/">trang chủ</router-link>.</p>
    <button @click="$router.push('/')">Quay về Trang chủ</button>
    </div>
</template>

<script>
export default {
    name: 'NotFound',
};
</script>

<style scoped>
.not-found {
    background-color: white;
    padding: 50px;
    text-align: center;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 50px auto;
}

.not-found h1 {
    font-size: 36px;
    color: #2c3e50;
    margin-bottom: 20px;
}

.not-found p {
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
}

.not-found a {
    color: #007bff;
    text-decoration: none;
}

.not-found a:hover {
    text-decoration: underline;
}

.not-found button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.not-found button:hover {
    background-color: #0056b3;
}
</style>