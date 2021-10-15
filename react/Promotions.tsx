import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useListContext, ListContextProvider } from 'vtex.list-context'
import { useProduct } from 'vtex.product-context'
import { canUseDOM } from 'vtex.render-runtime'

import styles from './Promotions.css'
import AppSettings from './graphql/settings.gql'
import { buildSequraScript } from './utils/index.js'

declare global {
  interface Window {
    $: any
    Sequra: any
  }
}

type AppSettings = {
  merchant: string
  assetKey: string
  widgetHeaderTitle: string
  widgetButtonText: string
  i1: boolean
  pp3: boolean
  sp1: boolean
  production: boolean
}

function SinglePromo({ product, amount }: { product: string; amount: number }) {
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

const Promotions = ({
  children,
  scriptLoaded,
  products,
}: {
  children: any
  scriptLoaded: boolean
  products: string[]
}) => {
  const { list } = useListContext()
  const productContextValue = useProduct()

  const selectedPrice =
    productContextValue?.selectedItem?.sellers[0].commertialOffer.Price

  if (!selectedPrice || !scriptLoaded) return null

  const promosListContent = products.map((item: string, idx: any) => (
    <SinglePromo key={idx} product={item} amount={selectedPrice} />
  ))

  const newListContextValue = list.concat(promosListContent)

  return (
    <ListContextProvider list={newListContextValue}>
      {children}
    </ListContextProvider>
  )
}

const Wrapper = ({ children }: { children: any }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [appSettings, setAppSettings] = useState<AppSettings>({
    i1: false,
    pp3: false,
    sp1: false,
  } as AppSettings)

  const { data } = useQuery(AppSettings)

  const headScript = canUseDOM && document.getElementById('SeQura')

  const { i1, pp3, sp1 } = appSettings

  const products: string[] = []

  i1 && products.push('i1')
  pp3 && products.push('pp3')
  sp1 && products.push('sp1')

  const handleOnLoad = () => {
    setScriptLoaded(true)
  }

  useEffect(() => {
    if (!data) {
      return
    }

    const settings = JSON.parse(data.appSettings.message)

    setAppSettings(settings)
  }, [data])

  useEffect(() => {
    if (scriptLoaded || !appSettings.assetKey) {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appSettings])

  return (
    <Promotions scriptLoaded={scriptLoaded} products={products}>
      {children}
    </Promotions>
  )
}

export default Wrapper
