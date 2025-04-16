interface Window {
  phantom?: {
    solana?: {
      isPhantom?: boolean
      connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{
        publicKey: {
          toString(): string
        }
      }>
      disconnect: () => Promise<void>
    }
  }
}
