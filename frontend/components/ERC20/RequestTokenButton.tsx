import React from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { Button } from '@iotabots/components'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'

const BOLTS_ABI = require('../../contracts/bolts.json')
const { BOLTS_ADR } = require('../../config')

export const RequestTokenButton: React.FC = () => {
  const context = useWeb3React<Web3Provider>()
  const { connector, chainId, library, account, deactivate, active, error } =
    context

  const [balance, setBalance] = React.useState()

  const requestTokens = async function () {
    // @ts-ignore: Unreachable code error
    const web3 = new Web3(library.provider)
    let contract = new web3.eth.Contract(BOLTS_ABI, BOLTS_ADR)
    let data
    try {
      data = await contract.methods
        .requestTokens()
        .send({ from: context.account, gasPrice: '0' })
      setBalance(data)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  const init = async function (_account, _library) {
    const web3 = new Web3(_library.provider)
    let contract = new web3.eth.Contract(BOLTS_ABI, BOLTS_ADR)
  }

  React.useEffect(() => {
    if (!!account && !!library) {
      init(account, library)
    }
    return null
  }, [account, library, chainId, balance])

  return <Button onClick={requestTokens}>Request Tokens</Button>
}
