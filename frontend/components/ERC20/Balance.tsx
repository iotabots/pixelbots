import React from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
const BOLTS_ABI = require('../../contracts/bolts.json')
const { BOLTS_ADR } = require('../../config')

export const Balance: React.FC = () => {
  const context = useWeb3React<Web3Provider>()
  const { connector, chainId, library, account, deactivate, active, error } =
    context

  const [balance, setBalance] = React.useState()

  const init = async function (_account, _library) {
    const web3 = new Web3(_library.provider)

    let contract = new web3.eth.Contract(BOLTS_ABI, BOLTS_ADR)
    let data
    try {
      data = await contract.methods.balanceOf(_account).call()
      setBalance(data)
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
  }, [account, library, chainId, balance])

  return (
    <span>
      {/* eslint-disable-next-line no-nested-ternary */}
      Your BOLTS Balance: {balance === null ? null : balance ? balance : '-'}
    </span>
  )
}
