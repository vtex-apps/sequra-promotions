import type { FC, ReactChild } from 'react'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { canUseDOM } from 'vtex.render-runtime'

import { PromotionsList } from './components/PromotionsList'
import AppSettings from './graphql/settings.gql'
import { buildSequraScript } from './utils/index.js'

declare global {
  interface Window {
    $: any
    Sequra: any
  }
}

interface PromotionsProps {
  children: ReactChild
}

const Promotions: FC<PromotionsProps> = ({ children }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [products, setProducts] = useState<string[]>([])
  const [appSettings, setAppSettings] = useState({} as AppSettings)

  const headScript = canUseDOM && document.getElementById('SeQura')
  const handleOnLoad = () => {
    setIsScriptLoaded(true)
  }

  const { data } = useQuery(AppSettings, { ssr: false })

  useEffect(() => {
    if (!data) {
      return
    }

    const settings: AppSettings = JSON.parse(data.appSettings.message)
    const availableProducts = []

    settings.i1 && availableProducts.push('i1')
    settings.pp3 && availableProducts.push('pp3')
    settings.sp1 && availableProducts.push('sp1')

    setProducts(availableProducts)
    setAppSettings(settings)
  }, [data])

  useEffect(() => {
    if (isScriptLoaded || !appSettings.assetKey) {
      return
    }

    if (headScript) {
      headScript.remove()
    }

    const { merchant, assetKey, production } = appSettings

    const script = document.createElement('script')
    const sequraLibrary = production ? 'live' : 'sandbox'
    const sequraConfigParams = {
      merchant,
      assetKey,
      products,
      scriptUri: `https://${sequraLibrary}.sequracdn.com/assets/sequra-checkout.min.js`, // SeQura Javascript library uri for production or sandbox."
      decimalSeparator: ',', // Decimal separator used in currencies formatting. Optional, default `,`.
      thousandSeparator: '.', // Thousand separator used in currencies formatting. Optional, default `.`.
      locale: 'es-ES', // Language and country codes separated by hyphen -. Optional, default `es-ES`.
      currency: 'EUR',
    }

    script.innerHTML = buildSequraScript(sequraConfigParams)

    window.Sequra.onLoad(() => {
      handleOnLoad()
    })
  }, [appSettings, headScript, isScriptLoaded, products])

  if (!products || !isScriptLoaded) {
    return null
  }

  return (
    <PromotionsList isScriptLoaded={isScriptLoaded} products={products}>
      {children}
    </PromotionsList>
  )
}

export default Promotions
