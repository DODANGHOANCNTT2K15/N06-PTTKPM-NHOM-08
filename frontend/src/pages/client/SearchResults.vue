<template>
  <div class="search-results-container">
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
          <div 
            id="filter_tag_all" 
            @click="showFilterPopup = true"
          >
            <div>
              <i class="fas fa-filter"></i>
              Tất cả
            </div>
          </div>
        </div>
      </div>

      <div class="sort-container">
        <label for="sort-options">Sắp xếp</label>
        <select 
          id="sort-options" 
          v-model="sortOption"
          @change="sortProducts"
        >
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
                <input type="checkbox" v-model="filters.freeShipping" id="freeShipping" />
                <label for="freeShipping">Giao hàng miễn phí</label>
              </div>
            </div>
          </div>

          <div class="filter_group_cover">
            <h1>Đánh giá</h1>
            <div>
              <div class="checkbox_cover" v-for="rating in [1,2,3,4,5]" :key="rating">
                <input 
                  type="checkbox" 
                  v-model="filters.ratings[rating]" 
                  :id="`rating${rating}`"
                />
                <label :for="`rating${rating}`">{{ '⭐'.repeat(rating) }} {{ rating }} Sao</label>
              </div>
            </div>
          </div>

          <div class="filter_group_cover">
            <h1>Giá</h1>
            <div>
              <div class="checkbox_cover" v-for="(label, key) in priceRangeLabels" :key="key">
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
                <input type="text" v-model="customPriceRange.from" placeholder="Từ" />
                <span>_</span>
                <input type="text" v-model="customPriceRange.to" placeholder="Đến" />
                <button type="button" @click="clearCustomPriceRange">Xóa</button>
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
        :key="product.id"
        :id="product.id"
        :image="product.image"
        :discountedPrice="product.discountedPrice"
        :originalPrice="product.originalPrice"
        :author="product.author"
        :title="product.title"
        :sold="product.sold"
        :tags="product.tags"
        @click="goToProductDetail(product.id)"
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

export default {
  name: "SearchResults",
  components: {
    ProductCard
  },
  data() {
    return {
      showFilterPopup: false,
      filterTags: ["Truyện", "Tiểu thuyết", "Trinh thám"],
      selectedTags: [],
      sortOption: "popular",
      currentPage: 1,
      itemsPerPage: 12,
      filters: {
        freeShipping: false,
        ratings: { 1: false, 2: false, 3: false, 4: false, 5: false },
        priceRanges: {
          'under100k': false,
          '100k-200k': false,
          '200k-500k': false,
          '500k-1m': false,
          '1m-2m': false,
          'over2m': false
        }
      },
      customPriceRange: { from: '', to: '' },
      priceRangeLabels: {
        'under100k': 'Dưới 100.000₫',
        '100k-200k': '100.000₫ - 200.000₫',
        '200k-500k': '200.000₫ - 500.000₫',
        '500k-1m': '500.000₫ - 1.000.000₫',
        '1m-2m': '1.000.000₫ - 2.000.000₫',
        'over2m': 'Trên 2.000.000₫'
      },
      products: [
        {
          id: 1,
          image: "Product_00.png",
          discountedPrice: 150000,
          originalPrice: 200000,
          author: "Author Name",
          title: "Product Title",
          sold: 100,
          tags: ["Truyện", "Trinh thám"],
          rating: 4,
          freeShipping: true
        }
      ]
    };
  },
  computed: {
    hasPriceRangeSelected() {
      return Object.values(this.filters.priceRanges).some(val => val);
    },
    filteredProducts() {
      let filtered = this.products;

      // Tag filter
      if (this.selectedTags.length > 0) {
        filtered = filtered.filter(product =>
          product.tags.some(tag => this.selectedTags.includes(tag))
        );
      }

      // Free shipping filter
      if (this.filters.freeShipping) {
        filtered = filtered.filter(product => product.freeShipping);
      }

      // Rating filter
      const selectedRatings = Object.entries(this.filters.ratings)
        .filter(([, selected]) => selected)
        .map(([rating]) => Number(rating));
      if (selectedRatings.length > 0) {
        filtered = filtered.filter(product => 
          selectedRatings.includes(Math.round(product.rating))
        );
      }

      // Price range filter
      const selectedPriceRanges = Object.keys(this.filters.priceRanges)
        .filter(key => this.filters.priceRanges[key]);
      if (selectedPriceRanges.length > 0 || (this.customPriceRange.from && this.customPriceRange.to)) {
        filtered = filtered.filter(product => {
          const price = product.discountedPrice;
          
          // Custom price range
          if (this.customPriceRange.from && this.customPriceRange.to) {
            const from = Number(this.customPriceRange.from);
            const to = Number(this.customPriceRange.to);
            return price >= from && price <= to;
          }

          // Predefined price ranges
          return selectedPriceRanges.some(range => {
            switch(range) {
              case 'under100k': return price < 100000;
              case '100k-200k': return price >= 100000 && price <= 200000;
              case '200k-500k': return price >= 200000 && price <= 500000;
              case '500k-1m': return price >= 500000 && price <= 1000000;
              case '1m-2m': return price >= 1000000 && price <= 2000000;
              case 'over2m': return price > 2000000;
            }
          });
        });
      }

      return filtered;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    }
  },
  methods: {
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag);
      if (index === -1) {
        this.selectedTags.push(tag);
      } else {
        this.selectedTags.splice(index, 1);
      }
      this.currentPage = 1;
    },
    sortProducts() {
      // ... (giữ nguyên method cũ)
    },
    goToProductDetail(productId) {
      this.$router.push(`/product/${productId}`);
    },
    clearAllFilters() {
      this.filters.freeShipping = false;
      Object.keys(this.filters.ratings).forEach(key => {
        this.filters.ratings[key] = false;
      });
      Object.keys(this.filters.priceRanges).forEach(key => {
        this.filters.priceRanges[key] = false;
      });
      this.customPriceRange = { from: '', to: '' };
      this.selectedTags = [];
    },
    clearCustomPriceRange() {
      this.customPriceRange = { from: '', to: '' };
    },
    showResults() {
      this.showFilterPopup = false;
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>
.search-results-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
</style>