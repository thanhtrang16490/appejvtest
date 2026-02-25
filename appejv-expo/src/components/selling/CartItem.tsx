import { memo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// Cart item type
export interface CartItemType {
  id: number
  name: string
  price: number
  quantity: number
  stock: number
  image_url?: string | null
  code?: string | null
}

interface CartItemProps {
  item: CartItemType
  onPress: () => void
  onDecrease: (e: any) => void
  onIncrease: (e: any) => void
  formatCurrency: (amount: number) => string
}

const CartItem = memo(({ 
  item, 
  onPress, 
  onDecrease, 
  onIncrease,
  formatCurrency 
}: CartItemProps) => (
  <TouchableOpacity
    style={styles.cartItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.cartItemHeader}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>{formatCurrency(item.price)}</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          onPress={onDecrease}
          style={styles.quantityButton}
        >
          <Ionicons name="remove" size={16} color="#6b7280" />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity
          onPress={onIncrease}
          style={styles.quantityButton}
        >
          <Ionicons name="add" size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
    <Text style={styles.cartItemTotal}>
      Thành tiền: {formatCurrency(item.price * item.quantity)}
    </Text>
  </TouchableOpacity>
))

CartItem.displayName = 'CartItem'

const styles = StyleSheet.create({
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
  cartItemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#175ead',
  },
})

export default CartItem

