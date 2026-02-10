import { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../src/lib/supabase'
import { useAuth } from '../../src/contexts/AuthContext'

export default function CustomerSellingScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [showProductSheet, setShowProductSheet] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.replace('/(auth)/customer-login')
        return
      }

      // Fetch profile to check role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single()

      if (!profileData || profileData.role !== 'customer') {
        router.replace('/(auth)/customer-login')
        return
      }

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .gt('stock', 0)
        .order('name')
      
      setProducts(productsData || [])

      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      setCategories(categoriesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
    setShowProductSheet(false)
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta
        if (newQuantity <= 0) return null
        if (newQuantity > item.stock) return item
        return { ...item, quantity: newQuantity }
      }
      return item
    }).filter(Boolean) as any[])
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' đ'
  }

  const handleCompleteOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng thêm sản phẩm vào đơn hàng')
      return
    }

    try {
      setIsCreatingOrder(true)
      const totalAmount = getTotalAmount()

      // Create draft order for customer
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: user?.id,
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

      Alert.alert('Thành công', 'Đã tạo đơn hàng thành công!', [
        { text: 'OK', onPress: () => router.push('/(customer)/orders') }
      ])

      setCart([])
    } catch (error: any) {
      console.error('Error creating order:', error)
      Alert.alert('Lỗi', error.message || 'Có lỗi khi tạo đơn hàng')
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const getFilteredProducts = () => {
    let filtered = products
    
    // Filter by category
    if (activeCategory !== 'all') {
      const categoryId = parseInt(activeCategory)
      filtered = filtered.filter(p => {
        if (!p.category_id) return false
        return p.category_id === categoryId
      })
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return filtered
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.logoTitle}>APPE JV</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCompleteOrder}
            disabled={cart.length === 0 || isCreatingOrder}
            style={[styles.doneButton, (cart.length === 0 || isCreatingOrder) && styles.doneButtonDisabled]}
          >
            <Text style={[styles.doneButtonText, (cart.length === 0 || isCreatingOrder) && styles.doneButtonTextDisabled]}>
              {isCreatingOrder ? 'Đang tạo...' : 'Đặt hàng'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Page Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Đặt hàng</Text>
        <Text style={styles.subtitle}>Chọn sản phẩm và tạo đơn hàng</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Cart Items or Empty State */}
        {cart.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
            <Text style={styles.emptyText}>
              Nhấn nút bên dưới để chọn sản phẩm
            </Text>
          </View>
        ) : (
          <View style={styles.cartContainer}>
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.cartItemHeader}>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>{formatCurrency(item.price)}</Text>
                  </View>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, -1)}
                      style={styles.quantityButton}
                    >
                      <Ionicons name="remove" size={16} color="#6b7280" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, 1)}
                      style={styles.quantityButton}
                    >
                      <Ionicons name="add" size={16} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.cartItemTotal}>
                  Thành tiền: {formatCurrency(item.price * item.quantity)}
                </Text>
              </View>
            ))}

            {/* Total */}
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Tổng cộng</Text>
              <Text style={styles.totalAmount}>{formatCurrency(getTotalAmount())}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addProductButton}
          onPress={() => setShowProductSheet(true)}
        >
          <Ionicons name="grid" size={24} color="white" />
          <Text style={styles.addProductButtonText}>Chọn sản phẩm</Text>
        </TouchableOpacity>
      </View>

      {/* Product Sheet Modal */}
      {showProductSheet && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setShowProductSheet(false)}
          />
          <View style={styles.productSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Chọn sản phẩm ({products.length})</Text>
              <TouchableOpacity onPress={() => setShowProductSheet(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.sheetSearch}>
              <Ionicons name="search" size={20} color="#9ca3af" />
              <TextInput
                style={styles.sheetSearchInput}
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
              contentContainerStyle={styles.categoriesContent}
            >
              <TouchableOpacity
                style={[styles.categoryChip, activeCategory === 'all' && styles.categoryChipActive]}
                onPress={() => setActiveCategory('all')}
              >
                <Text style={[styles.categoryText, activeCategory === 'all' && styles.categoryTextActive]}>
                  Tất cả ({products.length})
                </Text>
              </TouchableOpacity>
              {categories.map((cat) => {
                const count = products.filter(p => p.category_id === cat.id).length
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryChip, activeCategory === cat.id.toString() && styles.categoryChipActive]}
                    onPress={() => setActiveCategory(cat.id.toString())}
                  >
                    <Text style={[styles.categoryText, activeCategory === cat.id.toString() && styles.categoryTextActive]}>
                      {cat.name} ({count})
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>

            {/* Products Grid */}
            <ScrollView style={styles.productsScroll}>
              <View style={styles.productsGrid}>
                {getFilteredProducts().map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.productCard}
                    onPress={() => addToCart(product)}
                  >
                    <View style={styles.productIcon}>
                      <Ionicons name="cube" size={24} color="#10b981" />
                    </View>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
                    <Text style={styles.productStock}>Còn: {product.stock}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#10b981',
    borderRadius: 12,
  },
  doneButtonDisabled: {
    opacity: 0.5,
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  doneButtonTextDisabled: {
    color: '#9ca3af',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#f0f9ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
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
    minWidth: 24,
    textAlign: 'center',
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
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
  },
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10b981',
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
    height: 36,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#10b981',
  },
  categoryText: {
    fontSize: 12,
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
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
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
  productIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#d1fae5',
    borderRadius: 24,
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
    color: '#10b981',
    marginBottom: 2,
  },
  productStock: {
    fontSize: 10,
    color: '#6b7280',
  },
})
