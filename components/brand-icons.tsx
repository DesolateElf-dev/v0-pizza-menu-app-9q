export function BrandIcons() {
  return (
    <div className="flex gap-4 justify-center">
      {/* Add Button */}
      <div className="w-16 h-16 bg-gray-300 rounded-xl flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-600">+</span>
      </div>

      {/* Visa Card */}
      <div className="w-20 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
        <span className="text-white font-bold text-lg">VISA</span>
      </div>

      {/* Mastercard */}
      <div className="w-20 h-16 bg-red-600 rounded-xl flex items-center justify-center relative overflow-hidden">
        <div className="w-8 h-8 bg-red-500 rounded-full absolute left-2"></div>
        <div className="w-8 h-8 bg-yellow-500 rounded-full absolute right-2"></div>
      </div>
    </div>
  )
}
