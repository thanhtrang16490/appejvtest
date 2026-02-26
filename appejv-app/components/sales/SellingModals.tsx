'use client'

import { X, Plus, Minus, CheckCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export function QuantityModal({ item, tempQty, onTempQtyChange, onSubmit, onDelete, onClose }: {
    item: any; tempQty: string; onTempQtyChange: (v: string) => void
    onSubmit: () => void; onDelete: () => void; onClose: () => void
}) {
    if (!item) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-900">Chỉnh số lượng</span>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center overflow-hidden">
                        {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover rounded-2xl" alt={item.name} /> : <span className="text-3xl font-bold text-[#175ead]">{item.name?.[0]}</span>}
                    </div>
                    <div className="text-center">
                        <p className="text-base font-bold text-gray-900">{item.name}</p>
                        <p className="text-sm text-[#175ead] font-semibold">{formatCurrency(item.price)}</p>
                        <p className="text-xs text-gray-400">Còn: {item.stock}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => onTempQtyChange(String(Math.max(1, parseInt(tempQty || '1') - 1)))} className="w-12 h-12 bg-[#175ead] rounded-full flex items-center justify-center">
                            <Minus className="w-5 h-5 text-white" />
                        </button>
                        <input type="number" value={tempQty} onChange={e => onTempQtyChange(e.target.value)} className="w-20 h-14 text-2xl font-bold text-center bg-gray-100 rounded-xl border-2 border-[#175ead] outline-none" />
                        <button onClick={() => onTempQtyChange(String(Math.min(item.stock, parseInt(tempQty || '0') + 1)))} className="w-12 h-12 bg-[#175ead] rounded-full flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    <div className="w-full bg-blue-50 rounded-xl p-3 text-center border-2 border-blue-100">
                        <p className="text-xs text-gray-500 mb-1">Thành tiền</p>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(item.price * (parseInt(tempQty) || 0))}</p>
                    </div>
                    <div className="flex gap-3 w-full">
                        <button onClick={onDelete} className="flex-1 py-3 bg-red-50 text-red-500 font-semibold rounded-xl text-sm">Xóa</button>
                        <button onClick={onSubmit} className="flex-[2] py-3 bg-[#175ead] text-white font-semibold rounded-xl text-sm">Xác nhận</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function SuccessModal({ orderId, total, onCreateAnother, onViewOrders }: {
    orderId: any; total: number; onCreateAnother: () => void; onViewOrders: () => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Đơn hàng đã tạo!</h2>
                <p className="text-sm text-gray-500 mb-6">Đơn hàng nháp #{orderId} đã được tạo thành công với tổng giá trị {formatCurrency(total)}</p>
                <div className="flex gap-3">
                    <button onClick={onCreateAnother} className="flex-1 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm">Tạo đơn mới</button>
                    <button onClick={onViewOrders} className="flex-1 py-3 bg-[#175ead] text-white font-semibold rounded-xl text-sm">Xem đơn hàng</button>
                </div>
            </div>
        </div>
    )
}
