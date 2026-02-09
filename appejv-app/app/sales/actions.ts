'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadProductImage(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin') return { error: 'Chỉ Admin mới có quyền thực hiện' }

    const file = formData.get('file') as File
    if (!file) return { error: 'No file provided' }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
        return { error: 'Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)' }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return { error: 'Kích thước file không được vượt quá 5MB' }
    }

    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `products/${fileName}`

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) throw error

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath)

        return { success: true, url: publicUrl, path: filePath }
    } catch (error: any) {
        return { error: error.message || 'Failed to upload image' }
    }
}

export async function deleteProductImage(imagePath: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin') return { error: 'Chỉ Admin mới có quyền thực hiện' }

    try {
        const { error } = await supabase.storage
            .from('product-images')
            .remove([imagePath])

        if (error) throw error

        return { success: true }
    } catch (error: any) {
        return { error: error.message || 'Failed to delete image' }
    }
}

export async function updateStock(productId: number, newStock: number) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Role check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin' && (profile as any)?.role !== 'sale_admin') return { error: 'Forbidden' }

    const { error } = await (supabase
        .from('products') as any)
        .update({ stock: newStock })
        .eq('id', productId)

    if (error) return { error: error.message }

    revalidatePath('/sales/inventory')
    revalidatePath('/sales')
    return { success: true }
}

// CUSTOMER ACTIONS
export async function createCustomer(data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const userRole = (profile as any)?.role
    
    // Only admin and sale can create customers
    if (!['admin', 'sale', 'sale_admin'].includes(userRole)) {
        return { error: 'Không có quyền thực hiện' }
    }

    // Auto-assign customer to the user creating it (unless admin specifies otherwise)
    const customerData = {
        ...data,
        assigned_sale: data.assigned_sale || user.id
    }

    const { error } = await (supabase.from('customers') as any).insert([customerData])
    if (error) return { error: error.message }

    revalidatePath('/sales/customers')
    return { success: true }
}

export async function updateCustomer(id: string, data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const userRole = (profile as any)?.role
    
    // Admin can update any customer, sale can only update their own customers
    if (userRole === 'sale' || userRole === 'sale_admin') {
        // Check if customer is assigned to this user
        const { data: customer } = await supabase
            .from('customers')
            .select('assigned_sale')
            .eq('id', id)
            .single()
        
        if ((customer as any)?.assigned_sale !== user.id) {
            return { error: 'Không có quyền chỉnh sửa khách hàng này' }
        }
    } else if (userRole !== 'admin') {
        return { error: 'Không có quyền thực hiện' }
    }

    const { error } = await (supabase.from('customers') as any).update(data).eq('id', id)
    if (error) return { error: error.message }

    revalidatePath(`/sales/customers/${id}`)
    revalidatePath('/sales/customers')
    return { success: true }
}

export async function deleteCustomer(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin') return { error: 'Chỉ Admin mới có quyền thực hiện' }

    // Soft delete: set deleted_at timestamp
    const { error } = await (supabase.from('customers') as any)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
    
    if (error) return { error: error.message }

    revalidatePath('/sales/customers')
    revalidatePath('/sales/orders')
    return { success: true }
}

// PRODUCT ACTIONS
export async function createProduct(data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin') return { error: 'Chỉ Admin mới có quyền thực hiện' }

    const { error } = await (supabase.from('products') as any).insert([data])
    if (error) return { error: error.message }

    revalidatePath('/sales/inventory')
    return { success: true }
}

export async function updateProduct(id: number, data: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin') return { error: 'Chỉ Admin mới có quyền thực hiện' }

    const { error } = await (supabase.from('products') as any).update(data).eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/sales/inventory')
    return { success: true }
}

export async function deleteProduct(id: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if ((profile as any)?.role !== 'admin') return { error: 'Chỉ Admin mới có quyền thực hiện' }

    // Soft delete: set deleted_at timestamp
    const { error } = await (supabase.from('products') as any)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
    
    if (error) return { error: error.message }

    revalidatePath('/sales/inventory')
    return { success: true }
}
