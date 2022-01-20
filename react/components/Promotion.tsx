import type { FC } from 'react'
import React, { useEffect } from 'react'

import styles from './Promotion.css'

interface PromotionProps {
  product: string
  amount: number
}

const Promotion: FC<PromotionProps> = ({ product, amount }) => {
  useEffect(() => {
    window.Sequra.refreshComponents()
  }, [])

  return (
    <div
      className={`${styles.sequraWidget} sequra-promotion-widget`}
      data-amount={amount}
      data-product={product}
      data-size="L"
    />
  )
}

export { Promotion }
