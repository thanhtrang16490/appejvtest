# Đánh giá & Thiết kế lại Trang Sản phẩm - Phong cách Apple

## 📊 ĐÁNH GIÁ HIỆN TẠI

### Overall Score: 7/10

**Điểm mạnh:**
- ✅ 3D Particle Wave background ấn tượng
- ✅ Infinite scroll hoạt động tốt
- ✅ Category filter rõ ràng
- ✅ Product cards có hover effects
- ✅ Trust indicators tốt
- ✅ Responsive design

**Điểm yếu:**
- ❌ Thiếu advanced filters (price, sort)
- ❌ Không có quick view modal
- ❌ Product cards chưa đủ tinh tế
- ❌ Thiếu product comparison
- ❌ Search chưa có autocomplete
- ❌ Không có view mode toggle (grid/list)
- ❌ Product detail page quá đơn giản
- ❌ Thiếu image gallery
- ❌ Không có reviews/ratings
- ❌ Thiếu sticky CTA

---

## 🎨 THIẾT KẾ MỚI - PHONG CÁCH APPLE

### 1. HERO SECTION - Minimalist & Powerful

**Concept:** Giống Apple Store - clean, focused, với subtle animations

```astro
<!-- Hero Section - Apple Style -->
<section class="relative min-h-[70vh] flex items-center overflow-hidden bg-black">
  <!-- Video Background (optional) -->
  <video 
    autoplay 
    muted 
    loop 
    playsinline 
    class="absolute inset-0 w-full h-full object-cover opacity-40"
  >
    <source src="/videos/products-hero.mp4" type="video/mp4">
  </video>
  
  <!-- Gradient Overlay -->
  <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
  
  <!-- Content -->
  <div class="container mx-auto px-4 relative z-10">
    <div class="max-w-4xl mx-auto text-center">
      <!-- Animated Title -->
      <h1 class="text-display text-white mb-6">
        <span class="block opacity-0 animate-fade-in">Dinh dưỡng</span>
        <span class="block opacity-0 animate-fade-in animation-delay-200">chuyên nghiệp</span>
        <span class="block text-gray-400 opacity-0 animate-fade-in animation-delay-400">
          cho mọi giai đoạn phát triển
        </span>
      </h1>
      
      <!-- Subtitle -->
      <p class="text-xl text-gray-300 mb-12 font-light opacity-0 animate-fade-in animation-delay-600">
        Khám phá dòng sản phẩm được tin dùng bởi hàng nghìn trang trại
      </p>
      
      <!-- Search Bar - Apple Style -->
      <div class="max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-800">
        <div class="relative group">
          <svg class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            id="product-search"
            placeholder="Tìm kiếm sản phẩm..."
            class="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all text-lg"
            autocomplete="off"
          />
          <!-- Autocomplete Dropdown -->
          <div id="search-results" class="hidden absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
            <!-- Results will be populated here -->
          </div>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div class="flex justify-center gap-12 mt-16 opacity-0 animate-fade-in animation-delay-1000">
        <div class="text-center">
          <div class="text-4xl font-bold text-white mb-1">50+</div>
          <div class="text-sm text-gray-400">Sản phẩm</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-white mb-1">1500+</div>
          <div class="text-sm text-gray-400">Khách hàng</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-white mb-1">4.9</div>
          <div class="text-sm text-gray-400">Đánh giá</div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Scroll Indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
    <svg class="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </div>
</section>

<style>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-400 { animation-delay: 0.4s; }
.animation-delay-600 { animation-delay: 0.6s; }
.animation-delay-800 { animation-delay: 0.8s; }
.animation-delay-1000 { animation-delay: 1s; }
</style>
```

---

### 2. FILTER BAR - Sticky & Sophisticated

**Concept:** Giống Apple Store filter - clean, intuitive, với smooth transitions

```astro
<!-- Filter Bar - Apple Style -->
<div class="sticky top-16 z-40 bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm transition-all duration-300" id="filter-bar">
  <div class="container mx-auto px-4">
    <!-- Main Filter Row -->
    <div class="flex items-center justify-between py-4">
      <!-- Category Pills -->
      <div class="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <button class="filter-pill active" data-category="all">
          <span>Tất cả</span>
          <span class="count">48</span>
        </button>
        <button class="filter-pill" data-category="pig">
          <span class="icon">🐷</span>
          <span>Pig Feed</span>
          <span class="count">18</span>
        </button>
        <button class="filter-pill" data-category="poultry">
          <span class="icon">🐔</span>
          <span>Poultry Feed</span>
          <span class="count">15</span>
        </button>
        <button class="filter-pill" data-category="fish">
          <span class="icon">🐟</span>
          <span>Fish Feed</span>
          <span class="count">15</span>
        </button>
      </div>
      
      <!-- Filter Actions -->
      <div class="flex items-center gap-3 ml-4">
        <!-- Sort Dropdown -->
        <div class="relative">
          <button class="filter-action" id="sort-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <span>Sắp xếp</span>
          </button>
          <!-- Dropdown Menu -->
          <div class="dropdown-menu hidden">
            <button data-sort="newest">Mới nhất</button>
            <button data-sort="price-asc">Giá thấp → cao</button>
            <button data-sort="price-desc">Giá cao → thấp</button>
            <button data-sort="popular">Phổ biến nhất</button>
          </div>
        </div>
        
        <!-- Filter Button -->
        <button class="filter-action" id="filter-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span>Lọc</span>
        </button>
        
        <!-- View Toggle -->
        <div class="view-toggle">
          <button class="view-btn active" data-view="grid">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button class="view-btn" data-view="list">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Active Filters (if any) -->
    <div id="active-filters" class="hidden pb-4">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-sm text-gray-600">Đang lọc:</span>
        <!-- Active filter chips will be added here -->
      </div>
    </div>
  </div>
</div>

<style>
.filter-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f5f5f5;
  border-radius: 24px;
  border: 2px solid transparent;
  font-size: 14px;
  font-weight: 500;
  color: #171717;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.filter-pill:hover {
  background: #e5e5e5;
  transform: translateY(-1px);
}

.filter-pill.active {
  background: #171717;
  color: white;
  border-color: #171717;
}

.filter-pill .icon {
  font-size: 18px;
}

.filter-pill .count {
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.filter-pill.active .count {
  background: rgba(255, 255, 255, 0.2);
}

.filter-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: #f5f5f5;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #171717;
  transition: all 0.2s;
  cursor: pointer;
}

.filter-action:hover {
  background: #e5e5e5;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: #f5f5f5;
  padding: 4px;
  border-radius: 12px;
}

.view-btn {
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.view-btn:hover {
  background: #e5e5e5;
}

.view-btn.active {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
```

---

### 3. FILTER SIDEBAR - Slide-in Panel

```astro
<!-- Filter Sidebar - Slide-in from right -->
<div id="filter-sidebar" class="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform translate-x-full transition-transform duration-300 z-50">
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <h3 class="text-xl font-semibold">Bộ lọc</h3>
      <button id="close-filter" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Filter Content -->
    <div class="flex-1 overflow-y-auto p-6 space-y-8">
      <!-- Price Range -->
      <div class="filter-group">
        <h4 class="text-sm font-semibold text-gray-900 mb-4">Khoảng giá</h4>
        <div class="space-y-4">
          <div class="relative">
            <input 
              type="range" 
              id="price-min" 
              min="0" 
              max="1000000" 
              step="10000"
              value="0"
              class="range-slider"
            />
            <input 
              type="range" 
              id="price-max" 
              min="0" 
              max="1000000" 
              step="10000"
              value="1000000"
              class="range-slider"
            />
          </div>
          <div class="flex items-center justify-between text-sm">
            <span id="price-min-display" class="font-mono">0đ</span>
            <span class="text-gray-400">—</span>
            <span id="price-max-display" class="font-mono">1,000,000đ</span>
          </div>
        </div>
      </div>
      
      <!-- Stock Status -->
      <div class="filter-group">
        <h4 class="text-sm font-semibold text-gray-900 mb-4">Tình trạng</h4>
        <div class="space-y-2">
          <label class="checkbox-label">
            <input type="checkbox" value="in-stock" checked>
            <span>Còn hàng</span>
            <span class="count">(45)</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" value="pre-order">
            <span>Đặt trước</span>
            <span class="count">(3)</span>
          </label>
        </div>
      </div>
      
      <!-- Features -->
      <div class="filter-group">
        <h4 class="text-sm font-semibold text-gray-900 mb-4">Đặc điểm</h4>
        <div class="space-y-2">
          <label class="checkbox-label">
            <input type="checkbox" value="organic">
            <span>Hữu cơ</span>
            <span class="count">(12)</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" value="premium">
            <span>Cao cấp</span>
            <span class="count">(8)</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" value="export">
            <span>Xuất khẩu</span>
            <span class="count">(15)</span>
          </label>
        </div>
      </div>
    </div>
    
    <!-- Footer Actions -->
    <div class="p-6 border-t border-gray-200 space-y-3">
      <button class="btn-primary w-full">
        Áp dụng bộ lọc
      </button>
      <button class="btn-secondary w-full">
        Xóa tất cả
      </button>
    </div>
  </div>
</div>

<!-- Overlay -->
<div id="filter-overlay" class="hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>

<style>
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.checkbox-label:hover {
  background: #f5f5f5;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid #d4d4d4;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"]:checked {
  background: #171717;
  border-color: #171717;
}

.checkbox-label .count {
  margin-left: auto;
  font-size: 12px;
  color: #a3a3a3;
}

.range-slider {
  width: 100%;
  height: 4px;
  background: #e5e5e5;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #171717;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
```

---


### 4. PRODUCT CARDS - Premium & Interactive

**Concept:** Giống Apple product cards - clean, với subtle animations và quick actions

```astro
<!-- Product Grid - Apple Style -->
<div class="container mx-auto px-4 py-20">
  <!-- Results Header -->
  <div class="flex items-center justify-between mb-8">
    <div class="text-sm text-gray-600">
      Hiển thị <span class="font-semibold text-gray-900">1-12</span> trong <span class="font-semibold text-gray-900">48</span> sản phẩm
    </div>
    <button id="compare-toggle" class="text-sm text-blue-600 hover:text-blue-700 font-medium hidden">
      <span id="compare-count">0</span> sản phẩm đã chọn
    </button>
  </div>
  
  <!-- Products Grid -->
  <div id="products-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <!-- Product Card -->
    <div class="product-card group">
      <!-- Image Container -->
      <div class="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4">
        <img 
          src="/products/product-1.jpg" 
          alt="Product Name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <!-- Quick Actions Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="absolute bottom-4 left-4 right-4 flex gap-2">
            <button class="quick-action flex-1" data-action="quick-view">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Xem nhanh</span>
            </button>
            <button class="quick-action" data-action="compare">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Badges -->
        <div class="absolute top-4 left-4 flex flex-col gap-2">
          <span class="badge badge-new">Mới</span>
          <span class="badge badge-hot">Hot</span>
        </div>
        
        <!-- Wishlist -->
        <button class="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <!-- Product Info -->
      <div class="space-y-2">
        <!-- Category -->
        <div class="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Pig Feed
        </div>
        
        <!-- Name -->
        <h3 class="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          APPE Premium Pig Feed - Giai đoạn sinh trưởng
        </h3>
        
        <!-- Description -->
        <p class="text-sm text-gray-600 line-clamp-2 font-light">
          Công thức dinh dưỡng tối ưu cho heo giai đoạn sinh trưởng, giúp tăng trọng nhanh
        </p>
        
        <!-- Rating -->
        <div class="flex items-center gap-2">
          <div class="flex items-center">
            <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <span class="text-sm font-medium text-gray-900 ml-1">4.9</span>
          </div>
          <span class="text-sm text-gray-500">(127 đánh giá)</span>
        </div>
        
        <!-- Price -->
        <div class="flex items-baseline gap-2 pt-2">
          <span class="text-2xl font-bold text-gray-900">
            450,000đ
          </span>
          <span class="text-sm text-gray-500 font-light">/bao 50kg</span>
        </div>
        
        <!-- Stock Status -->
        <div class="flex items-center gap-2 text-sm">
          <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          <span class="text-gray-600">Còn hàng</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Load More -->
  <div class="text-center mt-12">
    <button id="load-more" class="btn-secondary">
      Xem thêm sản phẩm
    </button>
  </div>
</div>

<style>
.product-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover {
  transform: translateY(-4px);
}

.quick-action {
  display: flex;
  align-items: center;
  justify-center;
  gap: 6px;
  padding: 10px 16px;
  background: white;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #171717;
  transition: all 0.2s;
  cursor: pointer;
}

.quick-action:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
}

.badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-new {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.badge-hot {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}
</style>
```

---

### 5. QUICK VIEW MODAL - Smooth & Informative

```astro
<!-- Quick View Modal -->
<div id="quick-view-modal" class="fixed inset-0 z-50 hidden">
  <!-- Backdrop -->
  <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" id="modal-backdrop"></div>
  
  <!-- Modal Content -->
  <div class="absolute inset-0 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform scale-95 opacity-0 transition-all duration-300" id="modal-content">
      <!-- Close Button -->
      <button class="absolute top-6 right-6 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors" id="close-modal">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div class="grid md:grid-cols-2 gap-8 p-8">
        <!-- Image Gallery -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
            <img 
              id="qv-main-image"
              src="/products/product-1.jpg" 
              alt="Product"
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- Thumbnails -->
          <div class="grid grid-cols-4 gap-2">
            <button class="thumbnail active">
              <img src="/products/product-1.jpg" alt="" />
            </button>
            <button class="thumbnail">
              <img src="/products/product-1-2.jpg" alt="" />
            </button>
            <button class="thumbnail">
              <img src="/products/product-1-3.jpg" alt="" />
            </button>
            <button class="thumbnail">
              <img src="/products/product-1-4.jpg" alt="" />
            </button>
          </div>
        </div>
        
        <!-- Product Info -->
        <div class="flex flex-col">
          <!-- Category -->
          <div class="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            Pig Feed
          </div>
          
          <!-- Name -->
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            APPE Premium Pig Feed
          </h2>
          
          <!-- Rating -->
          <div class="flex items-center gap-3 mb-4">
            <div class="flex items-center">
              <div class="flex">
                {[1,2,3,4,5].map(i => (
                  <svg class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <span class="text-sm font-medium text-gray-900 ml-2">4.9</span>
            </div>
            <span class="text-sm text-gray-500">(127 đánh giá)</span>
          </div>
          
          <!-- Description -->
          <p class="text-gray-600 mb-6 leading-relaxed">
            Công thức dinh dưỡng tối ưu cho heo giai đoạn sinh trưởng, giúp tăng trọng nhanh, tỷ lệ FCR thấp, tăng cường sức đề kháng.
          </p>
          
          <!-- Key Features -->
          <div class="space-y-3 mb-6">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-sm text-gray-700">Protein cao 18-20%</span>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-sm text-gray-700">Vitamin & khoáng chất cân bằng</span>
            </div>
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span class="text-sm text-gray-700">Không chất cấm, an toàn tuyệt đối</span>
            </div>
          </div>
          
          <!-- Price -->
          <div class="bg-gray-50 rounded-2xl p-6 mb-6">
            <div class="flex items-baseline gap-3 mb-2">
              <span class="text-4xl font-bold text-gray-900">
                450,000đ
              </span>
              <span class="text-lg text-gray-500 font-light">/bao 50kg</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              <span class="text-gray-600">Còn hàng - Giao trong 1-2 ngày</span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-3 mt-auto">
            <a href="/san-pham/product-slug" class="btn-primary flex-1">
              Xem chi tiết
            </a>
            <a href="tel:+84351359520" class="btn-secondary flex-1">
              Gọi ngay
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
.thumbnail {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.2s;
  cursor: pointer;
}

.thumbnail:hover {
  border-color: #d4d4d4;
}

.thumbnail.active {
  border-color: #171717;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-cover;
}

#quick-view-modal.active #modal-content {
  transform: scale(1);
  opacity: 1;
}
</style>

<script>
// Quick View Modal Logic
const modal = document.getElementById('quick-view-modal');
const modalContent = document.getElementById('modal-content');
const closeModal = document.getElementById('close-modal');
const backdrop = document.getElementById('modal-backdrop');

// Open modal
document.querySelectorAll('[data-action="quick-view"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
  });
});

// Close modal
function closeQuickView() {
  modal.classList.remove('active');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 300);
}

closeModal.addEventListener('click', closeQuickView);
backdrop.addEventListener('click', closeQuickView);

// Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeQuickView();
  }
});

// Thumbnail switching
document.querySelectorAll('.thumbnail').forEach(thumb => {
  thumb.addEventListener('click', function() {
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const img = this.querySelector('img').src;
    document.getElementById('qv-main-image').src = img;
  });
});
</script>
```

---

### 6. PRODUCT COMPARISON BAR - Sticky Bottom

```astro
<!-- Comparison Bar -->
<div id="comparison-bar" class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl transform translate-y-full transition-transform duration-300 z-40">
  <div class="container mx-auto px-4 py-4">
    <div class="flex items-center justify-between">
      <!-- Selected Products -->
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-gray-700">So sánh:</span>
        <div class="flex gap-2" id="comparison-products">
          <!-- Product thumbnails will be added here -->
        </div>
        <span class="text-sm text-gray-500">
          <span id="comparison-count">0</span>/4 sản phẩm
        </span>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button id="clear-comparison" class="text-sm text-gray-600 hover:text-gray-900 font-medium">
          Xóa tất cả
        </button>
        <button id="compare-btn" class="btn-primary">
          So sánh ngay
        </button>
      </div>
    </div>
  </div>
</div>

<style>
#comparison-bar.active {
  transform: translateY(0);
}

.comparison-thumb {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e5e5e5;
}

.comparison-thumb img {
  width: 100%;
  height: 100%;
  object-cover;
}

.comparison-thumb .remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #171717;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-center;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.comparison-thumb:hover .remove {
  opacity: 1;
}
</style>
```

---

