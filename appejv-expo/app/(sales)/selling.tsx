import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, FlatList, Modal, Animated, Image } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../src/lib/supabase'
import { useAuth } from '../../src/contexts/AuthContext'
import SuccessModal from '../../src/components/SuccessModal'
import { useDebounce } from '../../src/hooks/useDebounce'

// Import selling components
import { CartItem } from '../../src/components/selling'
import CustomerSelector from '../../src/components/selling/CustomerSelector'
import ProductGrid from '../../src/components/selling/ProductGrid'
import QuantityModal from '../../src/components/selling/QuantityModal'

export default function SellingScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [quickSearchQuery, setQuickSearchQuery] = useState('')
  const [customerSearchQuery, setCustomerSearchQuery] = useState('')
  
  // Debounced search queries for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const debouncedQuickSearchQuery = useDebounce(quickSearchQuery, 300)
  const debouncedCustomerSearchQuery = useDebounce(customerSearchQuery, 300)
  
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [showProductSheet, setShowProductSheet] = useState(false)
  const [showQuickSearchResults, setShowQuickSearchResults] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)
  const [editingQuantity, setEditingQuantity] = useState<number | null>(null)
  const [tempQuantity, setTempQuantity] = useState('')
  const [showQuantityModal, setShowQuantityModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; translateY: Animated.Value; opacity: Animated.Value }>>([])
  const toastIdCounter = useRef(0)

  useEffect(() => {
    fetchData()
  }, [])

  // Auto show/hide quick search results based on debounced query
  useEffect(() => {
    if (debouncedQuickSearchQuery && debouncedQuickSearchQuery.trim().length >= 2) {
      setShowQuickSearchResults(true)
    } else {
      setShowQuickSearchResults(false)
    }
  }, [debouncedQuickSearchQuery])

  const addToastNotification = useCallback((message: string) => {
    const id = toastIdCounter.current++
    const translateY = new Animated.Value(-100)
    const opacity = new Animated.Value(0)

    const newToast = { id, message, translateY, opacity }
    setToasts(prev => [...prev, newToast])

    // Slide in from top
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    // Auto dismiss after 2 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      })
    }, 2000)
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.replace('/(auth)/login')
        return
      }

      // Fetch profile to check role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single()

      if (!profileData || !['sale', 'admin', 'sale_admin'].includes(profileData.role)) {
        router.replace('/(auth)/login')
        return
      }

      const userRole = profileData.role
      const isSale = userRole === 'sale'
      const isSaleAdmin = userRole === 'sale_admin'

      // For Sale Admin, fetch managed sales IDs
      let managedSaleIds: string[] = []
      if (isSaleAdmin) {
        const { data: managedSales } = await supabase
          .from('profiles')
          .select('id')
          .eq('manager_id', authUser.id)
        managedSaleIds = managedSales?.map(s => s.id) || []
      }

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .gt('stock', 0)
        .order('name')
      
      console.log('=== PRODUCTS DEBUG ===')
      console.log('Products loaded:', productsData?.length)
      console.log('Sample product:', productsData?.[0])
      console.log('All products:', productsData?.map(p => ({ id: p.id, name: p.name, stock: p.stock })))
      console.log('======================')
      setProducts(productsData || [])

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      console.log('Categories loaded:', categoriesData?.length)
      console.log('Categories:', categoriesData)
      setCategories(categoriesData || [])

      // Fetch customers (profiles with role=customer)
      // Note: profiles table doesn't have email field, only id, full_name, phone, role, created_at
      let customersQuery = supabase
        .from('profiles')
        .select('id, full_name, phone, role, created_at')
        .eq('role', 'customer')
        .order('full_name', { ascending: true, nullsFirst: false })

      // Note: Not filtering by created_by since all sales staff can see all customers
      // This matches the customers page behavior

      const { data: customersData, error: customersError } = await customersQuery
      
      if (customersError) {
        console.error('Error loading customers:', customersError)
      }
      
      console.log('=== CUSTOMERS DEBUG ===')
      console.log('User role:', userRole)
      console.log('User ID:', authUser.id)
      console.log('Customers loaded:', customersData?.length)
      console.log('All customers:', JSON.stringify(customersData, null, 2))
      console.log('======================')
      
      setCustomers(customersData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = useCallback((product: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        addToastNotification(`Đã tăng số lượng "${product.name}"`)
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        )
      } else {
        addToastNotification(`Đã thêm "${product.name}" vào giỏ`)
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
    // Don't close modal - allow multiple selections
  }, [addToastNotification])

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta
        if (newQuantity <= 0) return null
        if (newQuantity > item.stock) return item
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(Boolean) as any[])
  }, [])

  const setQuantityDirectly = useCallback((productId: number, quantity: number) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === productId) {
        if (quantity <= 0) return null
        if (quantity > item.stock) {
          Alert.alert('Thông báo', `Số lượng tối đa: ${item.stock}`)
          return { ...item, quantity: item.stock }
        }
        return { ...item, quantity }
      }
      return item
    }).filter(Boolean) as any[])
  }, [])

  const handleQuantityEdit = useCallback((item: any) => {
    setEditingItem(item)
    setTempQuantity(item.quantity.toString())
    setShowQuantityModal(true)
  }, [])

  const handleQuantitySubmit = useCallback(() => {
    if (!editingItem) return
    
    const quantity = parseInt(tempQuantity)
    if (!isNaN(quantity) && quantity > 0) {
      setQuantityDirectly(editingItem.id, quantity)
    }
    setShowQuantityModal(false)
    setEditingItem(null)
    setTempQuantity('')
  }, [tempQuantity, editingItem, setQuantityDirectly])

  const getTotalAmount = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [cart])

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' đ'
  }, [])

  const handleCompleteOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng thêm sản phẩm vào đơn hàng')
      return
    }

    try {
      setIsCreatingOrder(true)
      const totalAmount = getTotalAmount()

      // Create draft order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: selectedCustomer?.id || null,
          sale_id: user?.id,
          status: 'draft',
          total_amount: totalAmount
        }])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_order: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Show success modal
      setCreatedOrderId(orderData.id)
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('Error creating order:', error)
      Alert.alert('Lỗi', error.message || 'Có lỗi khi tạo đơn hàng')
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handleViewOrder = () => {
    setShowSuccessModal(false)
    // Reset form before navigating
    setCart([])
    setSelectedCustomer(null)
    setCreatedOrderId(null)
    router.push('/(sales)/orders')
  }

  const handleCreateAnother = () => {
    setShowSuccessModal(false)
    setCart([])
    setSelectedCustomer(null)
    setCreatedOrderId(null)
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    // Auto reset when closing modal
    setCart([])
    setSelectedCustomer(null)
    setCreatedOrderId(null)
  }

  const filteredProducts = useMemo(() => {
    let filtered = products
    
    // Filter by category
    if (activeCategory !== 'all') {
      const categoryId = parseInt(activeCategory)
      filtered = filtered.filter(p => {
        if (!p.category_id) return false
        return p.category_id === categoryId
      })
    }
    
    // Filter by search query - use debounced value
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.code?.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [products, activeCategory, debouncedSearchQuery])

  const quickSearchResults = useMemo(() => {
    if (!debouncedQuickSearchQuery || debouncedQuickSearchQuery.trim().length < 2) {
      return []
    }
    
    const query = debouncedQuickSearchQuery.toLowerCase().trim()
    const filtered = products.filter(p => {
      const nameMatch = p.name?.toLowerCase().includes(query)
      const codeMatch = p.code?.toLowerCase().includes(query)
      const hasStock = p.stock > 0
      
      return (nameMatch || codeMatch) && hasStock
    })
    
    return filtered.slice(0, 5)
  }, [products, debouncedQuickSearchQuery])

  const renderProductItem = useCallback(({ item: product }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => addToCart(product)}
      activeOpacity={0.7}
    >
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          style={styles.productImage}
          resizeMode="cover"
          defaultSource={require('../../assets/icon.png')}
        />
      ) : (
        <View style={styles.productIcon}>
          <Ionicons name="cube" size={24} color="#175ead" />
        </View>
      )}
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
      <Text style={styles.productStock}>Còn: {product.stock}</Text>
    </TouchableOpacity>
  ), [addToCart])

  const renderCategoryItem = useCallback(({ item: cat }: { item: any }) => {
    return (
      <TouchableOpacity
        style={[styles.categoryChip, activeCategory === cat.id.toString() && styles.categoryChipActive]}
        onPress={() => setActiveCategory(cat.id.toString())}
      >
        <Text style={[styles.categoryText, activeCategory === cat.id.toString() && styles.categoryTextActive]}>
          {cat.name} ({cat.count})
        </Text>
      </TouchableOpacity>
    )
  }, [activeCategory])

  const categoriesWithProducts = useMemo(() => {
    const categoriesWithCount = categories
      .map(cat => ({
        ...cat,
        count: products.filter(p => p.category_id === cat.id).length
      }))
      .filter(cat => cat.count > 0) // Only show categories with products
    
    return [{ id: 'all', name: 'Tất cả', count: products.length }, ...categoriesWithCount]
  }, [categories, products])

  const keyExtractor = useCallback((item: any) => item.id.toString(), [])

  const getFilteredCustomers = useMemo(() => {
    // If search query is just a space, show all customers
    if (debouncedCustomerSearchQuery === ' ') {
      return customers.slice(0, 10) // Show max 10
    }
    
    if (!debouncedCustomerSearchQuery || debouncedCustomerSearchQuery.trim().length < 2) return []
    
    const query = debouncedCustomerSearchQuery.toLowerCase().trim()
    const filtered = customers.filter(c => {
      const name = c.full_name?.toLowerCase() || ''
      const phone = c.phone?.toLowerCase() || ''
      
      return name.includes(query) || phone.includes(query)
    })
    
    return filtered.slice(0, 10) // Show max 10
  }, [customers, debouncedCustomerSearchQuery])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <>
      {/* Toast notifications - global, above everything */}
      {toasts.map((toast, index) => (
        <Animated.View
          key={toast.id}
          style={[
            styles.toast,
            {
              top: insets.top + 16 + (index * 72), // Stack toasts with 72px spacing
              transform: [{ translateY: toast.translateY }],
              opacity: toast.opacity,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      ))}

      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bán hàng</Text>
        <TouchableOpacity
          onPress={handleCompleteOrder}
          disabled={cart.length === 0 || isCreatingOrder}
          style={[styles.doneButton, (cart.length === 0 || isCreatingOrder) && styles.doneButtonDisabled]}
        >
          <Text style={[styles.doneButtonText, (cart.length === 0 || isCreatingOrder) && styles.doneButtonTextDisabled]}>
            {isCreatingOrder ? 'Đang tạo...' : 'Xong'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Customer Selector Component */}
        <CustomerSelector
          customers={customers}
          selectedCustomer={selectedCustomer}
          searchQuery={customerSearchQuery}
          onSearchChange={setCustomerSearchQuery}
          onSelectCustomer={setSelectedCustomer}
          onClearSelection={() => setSelectedCustomer(null)}
          filteredCustomers={getFilteredCustomers}
        />

        {/* Cart Items or Empty State */}
        {cart.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Đơn này bạn bán hàng gì?</Text>
            <Text style={styles.emptyText}>
              Nhấn nút bên dưới để chọn sản phẩm
            </Text>
          </View>
        ) : (
          <View style={styles.cartContainer}>
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onPress={() => handleQuantityEdit(item)}
                onDecrease={(e) => {
                  e.stopPropagation()
                  updateQuantity(item.id, -1)
                }}
                onIncrease={(e) => {
                  e.stopPropagation()
                  updateQuantity(item.id, 1)
                }}
                formatCurrency={formatCurrency}
              />
            ))}

            {/* Total */}
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalAmount}>{formatCurrency(getTotalAmount())}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar - Compact Product Selection */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.compactProductButton}
          onPress={() => setShowProductSheet(true)}
        >
          <Ionicons name="grid" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.quickSearchWrapper}>
          <View style={styles.quickSearchContainer}>
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              style={styles.quickSearchInput}
              placeholder="Tìm sản phẩm nhanh..."
              value={quickSearchQuery}
              onChangeText={setQuickSearchQuery}
              onBlur={() => {
                // Delay to allow tap on result items
                setTimeout(() => {
                  setShowQuickSearchResults(false)
                }, 200)
              }}
              placeholderTextColor="#9ca3af"
            />
            {quickSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => {
                setQuickSearchQuery('')
                setShowQuickSearchResults(false)
              }}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Quick Search Results */}
          {showQuickSearchResults && (
            <View style={styles.quickSearchResults}>
              {quickSearchResults.length > 0 ? (
                quickSearchResults.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.quickSearchResultItem}
                    onPress={() => {
                      console.log('Adding product:', product.name)
                      addToCart(product)
                      // Don't close - keep search open for multiple selections
                    }}
                  >
                    {product.image_url ? (
                      <Image
                        source={{ uri: product.image_url }}
                        style={styles.quickResultImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.quickResultIcon}>
                        <Ionicons name="cube" size={20} color="#175ead" />
                      </View>
                    )}
                    <View style={styles.quickResultInfo}>
                      <Text style={styles.quickResultName} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <View style={styles.quickResultMeta}>
                        <Text style={styles.quickResultPrice}>
                          {formatCurrency(product.price)}
                        </Text>
                        <Text style={styles.quickResultStock}>
                          • Còn: {product.stock}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="add-circle" size={24} color="#175ead" />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.quickSearchEmpty}>
                  <Text style={styles.quickSearchEmptyText}>
                    Không tìm thấy sản phẩm
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Product Sheet Modal */}
      <Modal
        visible={showProductSheet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProductSheet(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowProductSheet(false)}
          />
          <View style={styles.productSheet}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Chọn sản phẩm ({products.length})</Text>
              <TouchableOpacity onPress={() => setShowProductSheet(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* Product Grid Component */}
            <ProductGrid
              products={filteredProducts}
              categories={categories}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onAddToCart={addToCart}
              formatCurrency={formatCurrency}
            />
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="Đơn hàng đã tạo!"
        message={`Đơn hàng nháp đã được tạo thành công với tổng giá trị ${formatCurrency(getTotalAmount())}`}
        onClose={handleCloseSuccessModal}
        primaryButton={{
          text: 'Xem đơn hàng',
          onPress: handleViewOrder
        }}
        secondaryButton={{
          text: 'Tạo đơn mới',
          onPress: handleCreateAnother
        }}
      />

      {/* Quantity Edit Modal */}
      <QuantityModal
        visible={showQuantityModal}
        item={editingItem}
        tempQuantity={tempQuantity}
        onTempQuantityChange={setTempQuantity}
        onSubmit={handleQuantitySubmit}
        onDelete={() => {
          if (editingItem) {
            updateQuantity(editingItem.id, -editingItem.quantity)
          }
          setShowQuantityModal(false)
          setEditingItem(null)
        }}
        onClose={() => {
          setShowQuantityModal(false)
          setEditingItem(null)
          setTempQuantity('')
        }}
        formatCurrency={formatCurrency}
      />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  doneButtonDisabled: {
    opacity: 0.5,
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#175ead',
  },
  doneButtonTextDisabled: {
    color: '#9ca3af',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  showAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#175ead',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  searchResults: {
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  noResults: {
    marginTop: 8,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 8,
  },
  noResultsHint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  selectedCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#175ead',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  cartContainer: {
    gap: 12,
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#6b7280',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    minWidth: 40,
    textAlign: 'center',
  },
  quantityInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    minWidth: 40,
    height: 32,
    textAlign: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#175ead',
    paddingHorizontal: 8,
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#175ead',
  },
  totalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  compactProductButton: {
    width: 56,
    height: 56,
    backgroundColor: '#175ead',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#175ead',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  quickSearchWrapper: {
    flex: 1,
    position: 'relative',
  },
  quickSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  quickSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  quickSearchResults: {
    position: 'absolute',
    bottom: 64,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: 300,
  },
  quickSearchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  quickResultIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickResultImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  quickResultInfo: {
    flex: 1,
  },
  quickResultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  quickResultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickResultPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#175ead',
  },
  quickResultStock: {
    fontSize: 12,
    color: '#6b7280',
  },
  quickSearchEmpty: {
    padding: 16,
    alignItems: 'center',
  },
  quickSearchEmptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  quantityModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quantityModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  quantityModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  quantityModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  quantityModalBody: {
    padding: 24,
    alignItems: 'center',
  },
  quantityModalImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#f3f4f6',
  },
  quantityModalImagePlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityModalInfo: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityModalProductName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  quantityModalPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  quantityModalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#175ead',
  },
  quantityModalPriceUnit: {
    fontSize: 13,
    color: '#6b7280',
  },
  quantityModalStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
  },
  quantityModalStock: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  quantityModalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  quantityModalButton: {
    width: 48,
    height: 48,
    backgroundColor: '#175ead',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#175ead',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  quantityModalInput: {
    width: 100,
    height: 60,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#175ead',
  },
  quantityModalTotal: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#dbeafe',
  },
  quantityModalTotalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  quantityModalTotalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  quantityModalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  quantityModalDeleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingVertical: 16,
  },
  quantityModalDeleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  quantityModalSubmit: {
    flex: 2,
    backgroundColor: '#175ead',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  quantityModalSubmitText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  emptyProducts: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyProductsText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 12,
  },
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#175ead',
    borderRadius: 12,
    paddingVertical: 16,
  },
  addProductButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  productSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  sheetSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  sheetSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  categoriesScroll: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#175ead',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  categoryTextActive: {
    color: 'white',
  },
  productsScroll: {
    flex: 1,
    backgroundColor: 'white',
  },
  productsScrollContent: {
    paddingBottom: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  productsGridContent: {
    padding: 16,
    paddingBottom: 32,
  },
  productsGridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCard: {
    width: '31%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
  },
  productIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#175ead',
    marginBottom: 2,
  },
  productStock: {
    fontSize: 10,
    color: '#6b7280',
  },
  toast: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
})
