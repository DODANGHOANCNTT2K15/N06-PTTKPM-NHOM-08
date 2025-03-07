<template>
  <div class="search-results-container">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="book">
          <div class="book-page"></div>
          <div class="book-page"></div>
          <div class="book-page"></div>
        </div>
        <p>Đang tải<span class="dots"></span></p>
      </div>
    </div>

    <div id="filter">
      <div><h1>Tất cả sản phẩm</h1></div>

      <div class="filter-controls">
        <div id="filter_tag_cover">
          <div
            class="filter_tag"
            v-for="tag in filterTags"
            :key="tag"
            @click="toggleTag(tag)"
            :class="{ active: selectedTags.includes(tag) }"
          >
            {{ tag }}
          </div>
        </div>

        <div>
          <div id="filter_tag_all" @click="showFilterPopup = true">
            <div>
              <i class="fas fa-filter"></i>
              Tất cả
            </div>
          </div>
        </div>
      </div>

      <div class="sort-container">
        <label for="sort-options">Sắp xếp</label>
        <select id="sort-options" v-model="sortOption" @change="sortProducts">
          <option value="popular">Phổ biến</option>
          <option value="best-seller">Bán chạy nhất</option>
          <option value="low-to-high">Giá thấp đến cao</option>
          <option value="high-to-low">Giá cao đến thấp</option>
          <option value="newest">Mới nhất</option>
        </select>
      </div>
    </div>

    <!-- Popup Filter -->
    <div :class="{ hidden: !showFilterPopup }" id="filter_popup">
      <div class="filter_popup_content">
        <div><h1>Tất cả bộ lọc</h1></div>
        <div class="filter_groups">
          <div class="filter_group_cover" style="border: none">
            <h1>Dịch vụ</h1>
            <div>
              <div>
                <input
                  type="checkbox"
                  v-model="filters.freeShipping"
                  id="freeShipping"
                />
                <label for="freeShipping">Giao hàng miễn phí</label>
              </div>
            </div>
          </div>

          <div class="filter_group_cover">
            <h1>Đánh giá</h1>
            <div>
              <div
                class="checkbox_cover"
                v-for="rating in [1, 2, 3, 4, 5]"
                :key="rating"
              >
                <input
                  type="checkbox"
                  v-model="filters.ratings[rating]"
                  :id="`rating${rating}`"
                />
                <label :for="`rating${rating}`"
                  >{{ "⭐".repeat(rating) }} {{ rating }} Sao</label
                >
              </div>
            </div>
          </div>

          <div class="filter_group_cover">
            <h1>Giá</h1>
            <div>
              <div
                class="checkbox_cover"
                v-for="(label, key) in priceRangeLabels"
                :key="key"
              >
                <input
                  type="checkbox"
                  v-model="filters.priceRanges[key]"
                  :id="key"
                />
                <label :for="key">{{ label }}</label>
              </div>
            </div>
            <div v-if="!hasPriceRangeSelected">
              <h1>Tự nhập khoảng giá</h1>
              <div id="about_price">
                <input
                  type="text"
                  v-model="customPriceRange.from"
                  placeholder="Từ"
                />
                <span>_</span>
                <input
                  type="text"
                  v-model="customPriceRange.to"
                  placeholder="Đến"
                />
                <button type="button" @click="clearCustomPriceRange">
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="filter_popup_button">
          <button @click="clearAllFilters">Xóa tất cả</button>
          <button @click="showResults">Xem kết quả</button>
        </div>
        <div class="close-icon">
          <i class="fas fa-times" @click="showFilterPopup = false"></i>
        </div>
      </div>
    </div>

    <div id="products">
      <ProductCard
        v-for="product in paginatedProducts"
        :key="product.book_id"
        :id="product.book_id"
        :image="product.images[0]?.image_path"
        :discountedPrice="
          calculateDiscountedPrice(product.price, product.discount_price)
        "
        :originalPrice="product.price"
        :author="product.author"
        :title="product.title"
        :sold="product.warehouses[0]?.sold_quantity"
        :tags="[product.bookType.name]"
        @click="goToProductDetail(product.book_id)"
      />
    </div>

    <div id="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">
        Previous
      </button>
      <span
        v-for="page in totalPages"
        :key="page"
        :class="{ active: currentPage === page }"
      >
        <button @click="currentPage = page">{{ page }}</button>
      </span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">
        Next
      </button>
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/client/ProductCard.vue";
import { apiSearchBooks } from "@/services/client/SearchService";

export default {
  name: "SearchResults",
  components: {
    ProductCard,
  },
  data() {
    return {
      isLoading: false, // Thêm trạng thái loading
      showFilterPopup: false,
      filterTags: ["Truyện tranh", "Công nghệ thông tin", "Ngoại ngữ"],
      selectedTags: [],
      sortOption: "popular",
      currentPage: 1,
      itemsPerPage: 12,
      filters: {
        freeShipping: false,
        ratings: { 1: false, 2: false, 3: false, 4: false, 5: false },
        priceRanges: {
          under100k: false,
          "100k-200k": false,
          "200k-500k": false,
          "500k-1m": false,
          "1m-2m": false,
          over2m: false,
        },
      },
      customPriceRange: { from: "", to: "" },
      priceRangeLabels: {
        under100k: "Dưới 100.000₫",
        "100k-200k": "100.000₫ - 200.000₫",
        "200k-500k": "200.000₫ - 500.000₫",
        "500k-1m": "500.000₫ - 1.000.000₫",
        "1m-2m": "1.000.000₫ - 2.000.000₫",
        over2m: "Trên 2.000.000₫",
      },
      products: [],
      searchKey: "",
    };
  },
  computed: {
    hasPriceRangeSelected() {
      return Object.values(this.filters.priceRanges).some((val) => val);
    },
    filteredProducts() {
      let filtered = [...this.products];

      if (this.selectedTags.length > 0) {
        filtered = filtered.filter((product) =>
          this.selectedTags.includes(product.bookType.name)
        );
      }

      if (this.filters.freeShipping) {
        filtered = filtered.filter((product) => product.freeShipping);
      }

      const selectedRatings = Object.entries(this.filters.ratings)
        .filter(([, selected]) => selected)
        .map(([rating]) => Number(rating));
      if (selectedRatings.length > 0) {
        filtered = filtered.filter((product) =>
          selectedRatings.includes(Math.round(product.rating_avg))
        );
      }

      const selectedPriceRanges = Object.keys(this.filters.priceRanges).filter(
        (key) => this.filters.priceRanges[key]
      );
      if (
        selectedPriceRanges.length > 0 ||
        (this.customPriceRange.from && this.customPriceRange.to)
      ) {
        filtered = filtered.filter((product) => {
          const price = this.calculateDiscountedPrice(
            product.price,
            product.discount_price
          );

          if (this.customPriceRange.from && this.customPriceRange.to) {
            const from = Number(this.customPriceRange.from);
            const to = Number(this.customPriceRange.to);
            return price >= from && price <= to;
          }

          return selectedPriceRanges.some((range) => {
            switch (range) {
              case "under100k":
                return price < 100000;
              case "100k-200k":
                return price >= 100000 && price <= 200000;
              case "200k-500k":
                return price >= 200000 && price <= 500000;
              case "500k-1m":
                return price >= 500000 && price <= 1000000;
              case "1m-2m":
                return price >= 1000000 && price <= 2000000;
              case "over2m":
                return price > 2000000;
            }
          });
        });
      }

      return this.sortFilteredProducts(filtered);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
  },
  methods: {
    calculateDiscountedPrice(price, discount) {
      return Math.round(price * (1 - discount / 100));
    },
    async fetchProducts() {
      this.isLoading = true; // Hiển thị loading
      try {
        const response = await apiSearchBooks({ key: this.searchKey });
        if (response?.status === 200 && response?.data?.err === 0) {
          this.products = response.data.data || [];
        } else {
          this.products = [];
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        this.products = [];
      } finally {
        this.isLoading = false; // Ẩn loading
      }
    },
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag);
      if (index === -1) {
        this.selectedTags.push(tag);
      } else {
        this.selectedTags.splice(index, 1);
      }
      this.currentPage = 1;
    },
    sortFilteredProducts(products) {
      this.isLoading = true; // Hiển thị loading khi sắp xếp
      let sortedProducts;
      switch (this.sortOption) {
        case "popular":
          sortedProducts = products.sort((a, b) => b.rating_avg - a.rating_avg);
          break;
        case "best-seller":
          sortedProducts = products.sort(
            (a, b) =>
              b.warehouses[0].sold_quantity - a.warehouses[0].sold_quantity
          );
          break;
        case "low-to-high":
          sortedProducts = products.sort((a, b) =>
            this.calculateDiscountedPrice(a.price, a.discount_price) -
            this.calculateDiscountedPrice(b.price, b.discount_price)
          );
          break;
        case "high-to-low":
          sortedProducts = products.sort((a, b) =>
            this.calculateDiscountedPrice(b.price, b.discount_price) -
            this.calculateDiscountedPrice(a.price, a.discount_price)
          );
          break;
        case "newest":
          sortedProducts = products.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        default:
          sortedProducts = products;
      }
      setTimeout(() => {
        this.isLoading = false; // Ẩn loading sau khi sắp xếp
      }, 300); // Giả lập độ trễ nhỏ để thấy hiệu ứng loading
      return sortedProducts;
    },
    sortProducts() {
      this.currentPage = 1;
    },
    goToProductDetail(productId) {
      this.$router.push(`/product/${productId}`);
    },
    clearAllFilters() {
      this.isLoading = true; // Hiển thị loading khi xóa bộ lọc
      this.filters.freeShipping = false;
      Object.keys(this.filters.ratings).forEach((key) => {
        this.filters.ratings[key] = false;
      });
      Object.keys(this.filters.priceRanges).forEach((key) => {
        this.filters.priceRanges[key] = false;
      });
      this.customPriceRange = { from: "", to: "" };
      this.selectedTags = [];
      this.currentPage = 1;
      setTimeout(() => {
        this.isLoading = false; // Ẩn loading
      }, 300); // Giả lập độ trễ
    },
    clearCustomPriceRange() {
      this.customPriceRange = { from: "", to: "" };
    },
    showResults() {
      this.showFilterPopup = false;
      this.currentPage = 1;
      this.isLoading = true; // Hiển thị loading khi áp dụng bộ lọc
      setTimeout(() => {
        this.isLoading = false; // Ẩn loading
      }, 300); // Giả lập độ trễ
    },
  },
  mounted() {
    this.searchKey = this.$route.query.q || "";
    if (this.searchKey) {
      this.fetchProducts();
    }
  },
  watch: {
    $route(to) {
      this.searchKey = to.query.q || "";
      this.currentPage = 1;
      this.fetchProducts();
    },
  },
};
</script>

<style scoped>
.search-results-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative; /* Để overlay hoạt động trong container */
}

#filter {
  margin-bottom: 20px;
}

.filter-controls {
  display: flex;
  gap: 15px;
  margin: 15px 0;
}

#filter_tag_cover {
  display: flex;
  gap: 10px;
}

.filter_tag {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter_tag:hover,
.filter_tag.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

#filter_tag_all {
  cursor: pointer;
  padding: 8px 15px;
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

#sort-options {
  padding: 8px;
  border-radius: 5px;
}

#products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

#pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

#pagination button {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: white;
  cursor: pointer;
}

#pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

#pagination .active button {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

/* CSS cho Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: #fff;
}

.book {
  position: relative;
  width: 60px;
  height: 80px;
  margin: 0 auto 20px;
}

.book-page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 2px;
  transform-origin: left center;
  animation: flip 1.5s infinite ease-in-out;
}

.book-page:nth-child(1) {
  animation-delay: 0s;
  background: #f5f5f5;
}

.book-page:nth-child(2) {
  animation-delay: 0.3s;
  background: #e0e0e0;
}

.book-page:nth-child(3) {
  animation-delay: 0.6s;
  background: #d0d0d0;
}

@keyframes flip {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(-180deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

p {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dots::after {
  content: "...";
  display: inline-block;
  width: 1em;
  text-align: left;
  animation: dots 1.5s infinite;
}

@keyframes dots {
  0% {
    content: ".";
  }
  33% {
    content: "..";
  }
  66% {
    content: "...";
  }
  100% {
    content: ".";
  }
}
</style>