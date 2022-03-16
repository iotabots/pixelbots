import React from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
const IOTABOTS_ABI = require('../../contracts/iotabots.json')
const { IOTABOTS_ADR } = require('../../config')

export const AmountOfBots: React.FC = () => {
  const context = useWeb3React<Web3Provider>()
  const { connector, chainId, library, account, deactivate, active, error } =
    context

  const [amount, setAmount] = React.useState()

  const init = async function (_account, _library) {
    const web3 = new Web3(_library.provider)

    let contract = new web3.eth.Contract(IOTABOTS_ABI, IOTABOTS_ADR)
    let data
    try {
      data = await contract.methods.walletOfOwner(_account).call()
      if (data.length > 0) {
        setAmount(data.length)
      }
    } catch (e) {
      console.log(e)
      return null
    }
  }

  React.useEffect(() => {
    if (!!account && !!library) {
      init(account, library)
    }
    return null
  }, [account, library, chainId, amount])

  return <span>AmountOfBots: {amount}</span>
}
