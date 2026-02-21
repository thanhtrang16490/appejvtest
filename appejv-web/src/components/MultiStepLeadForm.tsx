import { useState } from 'react'

interface FormData {
  animalType: string
  farmSize: string
  name: string
  phone: string
  email: string
  note: string
}

export default function MultiStepLeadForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    animalType: '',
    farmSize: '',
    name: '',
    phone: '',
    email: '',
    note: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const animalTypes = [
    { value: 'pig', label: 'Heo', icon: '🐷', color: 'from-pink-500 to-red-500' },
    { value: 'poultry', label: 'Gia cầm', icon: '🐔', color: 'from-yellow-500 to-orange-500' },
    { value: 'fish', label: 'Thủy sản', icon: '🐟', color: 'from-blue-500 to-cyan-500' },
    { value: 'all', label: 'Tất cả', icon: '🌾', color: 'from-green-500 to-emerald-500' }
  ]

  const farmSizes = [
    { value: 'small', label: 'Nhỏ', desc: '< 100 con', icon: '🏠' },
    { value: 'medium', label: 'Trung bình', desc: '100 - 500 con', icon: '🏘️' },
    { value: 'large', label: 'Lớn', desc: '500 - 2000 con', icon: '🏭' },
    { value: 'xlarge', label: 'Rất lớn', desc: '> 2000 con', icon: '🏢' }
  ]

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Form submitted:', formData)
    
    setIsSubmitting(false)
    setIsSuccess(true)
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSuccess(false)
      setStep(1)
      setFormData({
        animalType: '',
        farmSize: '',
        name: '',
        phone: '',
        email: '',
        note: ''
      })
    }, 3000)
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const canProceed = () => {
    if (step === 1) return formData.animalType !== ''
    if (step === 2) return formData.farmSize !== ''
    if (step === 3) return formData.name !== '' && formData.phone !== ''
    return false
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12 animate-fadeIn">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Đăng ký thành công!
        </h3>
        <p className="text-gray-600">
          Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  s <= step
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    s < step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Loại vật nuôi</span>
          <span>Quy mô</span>
          <span>Thông tin</span>
        </div>
      </div>

      {/* Step 1: Animal Type */}
      {step === 1 && (
        <div className="animate-fadeIn">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
            Bạn đang nuôi loại nào?
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Chọn loại vật nuôi để chúng tôi tư vấn phù hợp
          </p>
          <div className="grid grid-cols-2 gap-4">
            {animalTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFormData({ ...formData, animalType: type.value })}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  formData.animalType === type.value
                    ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="text-5xl mb-3">{type.icon}</div>
                <div className="text-lg font-semibold text-gray-900">
                  {type.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Farm Size */}
      {step === 2 && (
        <div className="animate-fadeIn">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
            Quy mô trang trại của bạn?
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Giúp chúng tôi đề xuất giải pháp phù hợp
          </p>
          <div className="space-y-3">
            {farmSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => setFormData({ ...formData, farmSize: size.value })}
                className={`w-full p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  formData.farmSize === size.value
                    ? 'border-blue-600 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="text-4xl">{size.icon}</div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">{size.label}</div>
                  <div className="text-sm text-gray-600">{size.desc}</div>
                </div>
                {formData.farmSize === size.value && (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Contact Info */}
      {step === 3 && (
        <div className="animate-fadeIn">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
            Thông tin liên hệ
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Để chúng tôi gửi báo giá và tư vấn chi tiết
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0351 359 520"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (không bắt buộc)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={3}
                placeholder="Cho chúng tôi biết thêm về nhu cầu của bạn..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex gap-3">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
          >
            ← Quay lại
          </button>
        )}
        
        {step < 3 ? (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tiếp tục →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang gửi...
              </>
            ) : (
              'Nhận tư vấn miễn phí'
            )}
          </button>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Thông tin của bạn được bảo mật tuyệt đối
        </p>
      </div>
    </div>
  )
}
