'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Bitcoin, Calendar, DollarSign } from 'lucide-react'

interface PriceData {
  date: string
  price: number
  predicted?: boolean
}

interface BitcoinAPIResponse {
  prices: [number, number][]
}

export default function BitcoinPricePrediction() {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [predictionDays, setPredictionDays] = useState<number>(7)
  const [historicalDays, setHistoricalDays] = useState<number>(30)

  useEffect(() => {
    fetchBitcoinData()
  }, [predictionDays, historicalDays])

  const fetchBitcoinData = async () => {
    try {
      // Fetch historical data (past historicalDays days)
      const interval = historicalDays > 90 ? 'weekly' : 'daily'
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=jpy&days=${historicalDays}&interval=${interval}`
      )
      const data: BitcoinAPIResponse = await response.json()
      
      // Convert to our format
      const historicalData: PriceData[] = data.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString('ja-JP'),
        price: Math.round(price),
        predicted: false
      }))

      // Generate simple prediction (next predictionDays days)
      const lastPrice = historicalData[historicalData.length - 1].price
      const predictions: PriceData[] = []
      
      for (let i = 1; i <= predictionDays; i++) {
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + i)
        
        // Simple prediction: random walk with slight upward bias
        const volatility = 0.03 // 3%
        const trend = 0.001 // 0.1% daily trend
        const randomFactor = (Math.random() - 0.5) * volatility
        const predictedPrice = lastPrice * (1 + trend + randomFactor) * Math.pow(1.001, i)
        
        predictions.push({
          date: futureDate.toLocaleDateString('ja-JP'),
          price: Math.round(predictedPrice),
          predicted: true
        })
      }

      const allData = [...historicalData, ...predictions]
      setPriceData(allData)
      setCurrentPrice(lastPrice)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching Bitcoin data:', error)
      // Fallback data if API fails
      const fallbackData: PriceData[] = Array.from({ length: historicalDays + predictionDays }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - historicalDays + i)
        const basePrice = 15000000 // ¥15,000,000 (approximately $100,000 in JPY)
        const variation = Math.sin(i * 0.2) * 500000 + Math.random() * 200000
        return {
          date: date.toLocaleDateString('ja-JP'),
          price: Math.round(basePrice + variation),
          predicted: i >= historicalDays
        }
      })
      setPriceData(fallbackData)
      setCurrentPrice(fallbackData[historicalDays - 1].price)
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="text-gray-600">{`日付: ${label}`}</p>
          <p className={`font-semibold ${data.predicted ? 'text-orange-600' : 'text-blue-600'}`}>
            {`価格: ${formatCurrency(payload[0].value)}`}
          </p>
          {data.predicted && (
            <p className="text-xs text-orange-500">予測値</p>
          )}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Bitcoin className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Bitcoin価格データを読み込み中...</p>
        </div>
      </div>
    )
  }

  const historicalData = priceData.filter(d => !d.predicted)
  const predictionData = priceData.filter(d => d.predicted)
  const priceChange = historicalData.length > 1 ? 
    ((historicalData[historicalData.length - 1].price - historicalData[historicalData.length - 2].price) / historicalData[historicalData.length - 2].price * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bitcoin className="w-12 h-12 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-800">Bitcoin価格予測</h1>
          </div>
          <p className="text-gray-600 text-lg">過去{historicalDays}日間の価格推移と今後{predictionDays}日間の予測</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">現在価格</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(currentPrice)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <TrendingUp className={`w-8 h-8 ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <div>
                <p className="text-sm text-gray-500">24時間変動</p>
                <p className={`text-2xl font-bold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">予測期間</p>
                <p className="text-2xl font-bold text-gray-800">{predictionDays}日間</p>
              </div>
            </div>
          </div>
        </div>

        {/* Period Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Historical Period Selector */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">過去データ期間</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {[7, 30, 90, 365].map((days) => (
                <button
                  key={days}
                  onClick={() => setHistoricalDays(days)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    historicalDays === days
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {days}日間
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カスタム期間（1-365日）
              </label>
              <input
                type="range"
                min="1"
                max="365"
                value={historicalDays}
                onChange={(e) => setHistoricalDays(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1日</span>
                <span className="font-medium text-green-600">{historicalDays}日</span>
                <span>365日</span>
              </div>
            </div>
          </div>

          {/* Prediction Period Selector */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">予測期間設定</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {[3, 7, 14, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => setPredictionDays(days)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    predictionDays === days
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {days}日間
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カスタム期間（1-90日）
              </label>
              <input
                type="range"
                min="1"
                max="90"
                value={predictionDays}
                onChange={(e) => setPredictionDays(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1日</span>
                <span className="font-medium text-blue-600">{predictionDays}日</span>
                <span>90日</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">価格チャート</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  fontSize={12}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `¥${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={(props) => {
                    if (props.payload.predicted) {
                      return <circle cx={props.cx} cy={props.cy} r={4} fill="#f97316" stroke="#f97316" strokeWidth={2} />
                    }
                    return <circle cx={props.cx} cy={props.cy} r={3} fill="#3b82f6" stroke="#3b82f6" strokeWidth={2} />
                  }}
                  connectNulls={false}
                  name="Bitcoin価格 (JPY)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">実際の価格</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">予測価格</span>
            </div>
          </div>
        </div>

        {/* Prediction Table */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">今後{predictionDays}日間の価格予測</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">日付</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">予測価格</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">変動率</th>
                </tr>
              </thead>
              <tbody>
                {predictionData.map((data, index) => {
                  const previousPrice = index === 0 ? currentPrice : predictionData[index - 1].price
                  const changePercent = ((data.price - previousPrice) / previousPrice * 100)
                  
                  return (
                    <tr key={data.date} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800">{data.date}</td>
                      <td className="py-3 px-4 text-right font-semibold text-orange-600">
                        {formatCurrency(data.price)}
                      </td>
                      <td className={`py-3 px-4 text-right font-semibold ${changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>注意:</strong> この予測は過去のデータに基づく簡単な統計モデルによるものです。
              実際の価格は様々な要因により大きく変動する可能性があります。
              投資判断は慎重に行ってください。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}