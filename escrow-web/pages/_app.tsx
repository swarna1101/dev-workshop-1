import "@rainbow-me/rainbowkit/styles.css";

import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Chain } from '@wagmi/core'

const metaChain = {
  id: 1133,
  name: 'DeFiChain Network',
  network: 'DeFiChain',
  nativeCurrency: {
    decimals: 18,
    name: 'DFI',
    symbol: 'DFI',
  },
  rpcUrls: {
    public: 'https://dmc.mydefichain.com/changi',
    default:  'https://dmc.mydefichain.com/changi',
  },
  blockExplorers: {
    etherscan: { name: 'Changi', url: 'https://meta.defiscan.live/?network=Changi' },
    default: { name: 'Changi', url: 'https://meta.defiscan.live/?network=Changi' },
  },
} as const satisfies Chain

const { chains, provider } = configureChains(
  [metaChain, chain.mainnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({ appName: "Escrow", chains });
const wagmiClient = createClient({ autoConnect: true, connectors, provider });

const theme = extendTheme({
  config: { initialColorMode: "dark" },
  components: {
    Input: { defaultProps: { variant: "filled" } },
    Select: { defaultProps: { variant: "filled" } },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme({
            // Use Chakra colors
            accentColor: theme.colors.blue[200],
            accentColorForeground: theme.colors.gray[800],
            borderRadius: "small",
          })}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}
