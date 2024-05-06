// import { getCreate2Address } from '@ethersproject/address'
// import { defaultAbiCoder } from '@ethersproject/abi';
// import { keccak256 } from '@ethersproject/solidity';
import { Token } from '@uniswap/sdk-core';
import { utils } from 'ethers';
// import { FeeAmount } from '../constants';
// import { utils } from '@ethersproject';
import { utils as zkUtils } from 'zksync-web3';

export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

export const POOL_BYTECODE_HASH =
  '0x010013f177ea1fcbc4520f9a3ca7cd2d1d77959e05aa66484027cb38e712aeed';
// /**
//  * Computes a pool address
//  * @param factoryAddress The Uniswap V3 factory address
//  * @param tokenA The first token of the pair, irrespective of sort order
//  * @param tokenB The second token of the pair, irrespective of sort order
//  * @param fee The fee tier of the pool
//  * @param initCodeHashManualOverride Override the init code hash used to compute the pool address if necessary
//  * @returns The pool address
//  */
// export function computePoolAddress({
//   factoryAddress,
//   tokenA,
//   tokenB,
//   fee,
//   initCodeHashManualOverride,
// }: {
//   factoryAddress: string;
//   tokenA: Token;
//   tokenB: Token;
//   fee: FeeAmount;
//   initCodeHashManualOverride?: string;
// }): string {
//   const [token0, token1] = tokenA.sortsBefore(tokenB)
//     ? [tokenA, tokenB]
//     : [tokenB, tokenA]; // does safety checks
//   // return getCreate2Address(
//   //   factoryAddress,
//   //   keccak256(
//   //     ['bytes'],
//   //     [defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0.address, token1.address, fee])]
//   //   ),
//   //   initCodeHashManualOverride ?? POOL_INIT_CODE_HASH
//   // )
//   return utils.create2Address(
//     factoryAddress,
//     initCodeHashManualOverride ?? POOL_INIT_CODE_HASH,
//     keccak256(
//       ['bytes'],
//       [
//         defaultAbiCoder.encode(
//           ['address', 'address', 'uint24'],
//           [token0.address, token1.address, fee]
//         ),
//       ]
//     ),
//     keccak256(
//       ['bytes'],
//       [
//         defaultAbiCoder.encode(
//           ['address', 'address', 'uint24'],
//           [token0.address, token1.address, fee]
//         ),
//       ]
//     )
//   );
//   // address = "0x29bac3E5E8FFE7415F97C956BFA106D70316ad50"
// }

export function computePoolAddress({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
}: // initCodeHashManualOverride,
{
  factoryAddress: string;
  tokenA: Token;
  tokenB: Token;
  fee: FeeAmount;
  initCodeHashManualOverride?: string;
}): string {
  const [token0, token1] =
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
      ? [tokenA.address, tokenB.address]
      : [tokenB.address, tokenA.address];
  const constructorArgumentsEncoded = utils.defaultAbiCoder.encode(
    ['address', 'address', 'uint24'],
    [token0, token1, fee]
  );
  return zkUtils.create2Address(
    factoryAddress,
    POOL_BYTECODE_HASH,
    utils.keccak256(constructorArgumentsEncoded),
    '0x'
  );
}
