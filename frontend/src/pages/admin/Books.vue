<template>
    <div class="admin-books">
      <h1>Quản lý Sách</h1>
      <div class="book-list">
        <div class="book-item" v-for="book in books" :key="book.id">
          <h3>{{ book.title }}</h3>
          <p>Giá: {{ book.price }} VNĐ</p>
          <button @click="editBook(book.id)">Sửa</button>
          <button @click="deleteBook(book.id)">Xóa</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'BooksAdmin',
    setup() {
      const books = ref([
        { id: 1, title: 'Thiên Tài Bên Trái, Kẻ Điên Bên Phải', price: 600000 },
        { id: 2, title: 'Sách Hay', price: 500000 },
      ]);
  
      const editBook = (id) => {
        console.log(`Chỉnh sửa sách ID: ${id}`);
      };
  
      const deleteBook = (id) => {
        books.value = books.value.filter((book) => book.id !== id);
        console.log(`Xóa sách ID: ${id}`);
      };
  
      return {
        books,
        editBook,
        deleteBook,
      };
    },
  };
  </script>
  
  <style scoped>
  .admin-books {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .admin-books h1 {
    font-size: 24px;
    color: #2c3e50;
    margin-bottom: 20px;
  }
  
  .book-list {
    display: grid;
    gap: 20px;
  }
  
  .book-item {
    background-color: #ecf0f1;
    padding: 15px;
    border-radius: 5px;
  }
  
  .book-item h3 {
    font-size: 16px;
    color: #2c3e50;
    margin-bottom: 10px;
  }
  
  .book-item p {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }
  
  .book-item button {
    padding: 5px 10px;
    margin-right: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .book-item button:first-child {
    background-color: #3498db;
    color: white;
  }
  
  .book-item button:first-child:hover {
    background-color: #2980b9;
  }
  
  .book-item button:last-child {
    background-color: #e74c3c;
    color: white;
  }
  
  .book-item button:last-child:hover {
    background-color: #c0392b;
  }
  </style>