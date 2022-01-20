import type { FC, ReactChild } from 'react'
import React from 'react'
import { ListContextProvider, useListContext } from 'vtex.list-context'
import { useProduct } from 'vtex.product-context'

import { Promotion } from './Promotion'

interface PromotionsListProps {
  children: ReactChild
  isScriptLoaded: boolean
  products: string[]
}

const PromotionsList: FC<PromotionsListProps> = ({
  children,
  isScriptLoaded,
  products,
}) => {
  const { list } = useListContext()
  const productContextValue = useProduct()
  const selectedPrice =
    productContextValue?.selectedItem?.sellers[0].commertialOffer.Price

  if (!selectedPrice || !isScriptLoaded) {
    return null
  }

  const priceInCents = +(selectedPrice * 100).toFixed(0)

  const promotionsList = products.map((product: string) => (
    <Promotion key={product} product={product} amount={priceInCents} />
  ))

  const listContextValue = list.concat(promotionsList)

  return (
    <ListContextProvider list={listContextValue}>
      {children}
    </ListContextProvider>
  )
}

export { PromotionsList }
