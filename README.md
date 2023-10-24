# HAPIID Smart Contract

The `HAPIID` contract is a specialized ERC-721 NFT (Non-Fungible Token) contract with additional functionalities. It is built on Ethereum and primarily serves as a unique identification mechanism.

## Key Features:

1. **ERC-721 Compliance**: Inherits from OpenZeppelin's ERC-721 standard for NFTs.
2. **Enumerable**: Implements the ERC721Enumerable extension for enumeration of token ownership.
3. **Access Control**: Utilizes OpenZeppelin's `AccessControl` to manage special roles like a `MINTER_ROLE`, which is responsible for minting new tokens.
4. **Custom URI**: Overrides `_baseURI` to provide a custom base URI (`https://id.hapi.one/`) for metadata.
5. **Minting**: Exposes a `safeMint` function which allows addresses with the `MINTER_ROLE` to securely mint new tokens.
6. **Interface Support**: Ensures compliance with various interfaces via `supportsInterface`.

## Security:

The contract has a security contact specified (`security@hapi.one`) to report security vulnerabilities.

## Development:

```shell
# Run tests
npx hardhat test

# Run tests with gas calculation
REPORT_GAS=true npx hardhat test

# Run a local node
npx hardhat node

# Deploy the contract on the local node
npx hardhat run scripts/deploy.ts
```
