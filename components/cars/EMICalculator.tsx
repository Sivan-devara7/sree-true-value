'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingDown } from 'lucide-react'
import { formatPriceExact, calculateEMI } from '@/lib/utils'

interface EMICalculatorProps {
  carPrice: number
}

export default function EMICalculator({ carPrice }: EMICalculatorProps) {
  const [downPayment, setDownPayment] = useState(Math.round(carPrice * 0.2))
  const [interestRate, setInterestRate] = useState(9.5)
  const [tenure, setTenure] = useState(60)

  const loanAmount = carPrice - downPayment
  const emi = loanAmount > 0 ? calculateEMI(loanAmount, interestRate, tenure) : 0
  const totalPayment = emi * tenure + downPayment
  const totalInterest = totalPayment - carPrice

  const downPaymentPercent = Math.round((downPayment / carPrice) * 100)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/8 p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center">
          <Calculator className="w-4 h-4 text-gold-500" />
        </div>
        <h3 className="font-display font-bold text-gray-900 dark:text-white text-base">EMI Calculator</h3>
      </div>

      <div className="space-y-5">
        {/* Down Payment Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs font-medium text-gray-500">Down Payment</label>
            <span className="text-xs font-bold text-gold-500">{formatPriceExact(downPayment)} ({downPaymentPercent}%)</span>
          </div>
          <input
            type="range"
            min={carPrice * 0.1}
            max={carPrice * 0.7}
            step={10000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full accent-gold-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>10%</span>
            <span>70%</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs font-medium text-gray-500">Interest Rate</label>
            <span className="text-xs font-bold text-gold-500">{interestRate}% p.a.</span>
          </div>
          <input
            type="range"
            min={7}
            max={18}
            step={0.5}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-gold-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>7%</span>
            <span>18%</span>
          </div>
        </div>

        {/* Loan Tenure */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs font-medium text-gray-500">Loan Tenure</label>
            <span className="text-xs font-bold text-gold-500">{tenure / 12} Years ({tenure} months)</span>
          </div>
          <div className="flex gap-2">
            {[12, 24, 36, 48, 60, 84].map((months) => (
              <button
                key={months}
                onClick={() => setTenure(months)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tenure === months
                    ? 'bg-gold-500 text-black'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                {months / 12}Y
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <motion.div
          key={emi}
          initial={{ scale: 0.97, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-gold-500/10 to-gold-500/5 rounded-xl p-4 border border-gold-500/20"
        >
          <div className="text-center mb-4">
            <p className="text-xs text-gray-500 mb-1">Monthly EMI</p>
            <p className="font-display font-bold text-3xl text-gold-500">
              {formatPriceExact(emi)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-gray-500">Loan Amount</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{formatPriceExact(loanAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Interest</p>
              <p className="text-sm font-bold text-orange-500">{formatPriceExact(totalInterest)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Payment</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{formatPriceExact(totalPayment)}</p>
            </div>
          </div>
        </motion.div>

        <p className="text-xs text-gray-400 flex items-center gap-1">
          <TrendingDown className="w-3 h-3" />
          EMI values are indicative. Actual rates may vary by lender.
        </p>
      </div>
    </div>
  )
}
