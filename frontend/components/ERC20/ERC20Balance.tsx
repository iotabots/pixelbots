import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Box, Typography } from '@iotabots/components'
import { useEagerConnect, useInactiveListener } from '../../utils/hooks'

import { RequestTokenButton } from './RequestTokenButton'
import { Balance } from './Balance'
import { TotalSupply } from './TotalSupply'
import { AmountOfBots } from './AmountOfBots'
const { BOLTS_ADR } = require('../../config')

declare global {
  interface library {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    provider: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }
}

const ERC20Balance: React.FC = () => {
  const context = useWeb3React<Web3Provider>()
  const { connector, library, account, deactivate, active, error } = context

  // handle logic to recognize the connector currently being activated
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  /* handle logic to eagerly connect to the injected ethereum provider, 
  if it exists and has granted access already */
  const triedEager = useEagerConnect()

  /* handle logic to connect in reaction to certain events on the 
  injected ethereum provider, if it exists */
  useInactiveListener({ suppress: !triedEager || !!activatingConnector })

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <Balance />
      <br />
      <AmountOfBots />
      <br />
      <RequestTokenButton />
      <Typography variant='body1' align='center' sx={{ pb: 6 }}>
        This is just for testing! Have fun!
      </Typography>
      <Typography variant='h4' align='center' sx={{ pt: 4 }}>
        BOLT Token Information
      </Typography>
      <Typography variant="body1" align="center" sx={{ pb: 6 }}>
          Contract Address: {BOLTS_ADR}
        </Typography>
      <TotalSupply />
    </Box>
  )
}

export default ERC20Balance
