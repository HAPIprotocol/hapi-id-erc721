// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC5192} from "../interfaces/IERC5192.sol";

/// @title ERC-5192 Soulbound Token Standard (customized implementation)
abstract contract ERC5192 is IERC5192, AccessControl {
    bytes32 public constant LOCKER_ROLE = keccak256("LOCKER_ROLE");

    mapping(uint256 tokenId => bool) private _locked;

    /**
     * @dev See {IERC5192-locked}.
     */
    function locked(uint256 tokenId) external view returns (bool) {
        return _locked[tokenId];
    }

    /// @notice Locks a token.
    /// @dev Reverts if the caller does not have the locker role.
    /// @dev Reverts if the token is already locked.
    /// @param tokenId The identifier for a token.
    function lock(uint256 tokenId) public onlyRole(LOCKER_ROLE) {
        if (_locked[tokenId]) {
            revert AlreadyLocked(tokenId);
        }

        if (!hasRole(LOCKER_ROLE, _msgSender())) {
            revert AccessControlUnauthorizedAccount(_msgSender(), LOCKER_ROLE);
        }

        _locked[tokenId] = true;
        emit Locked(tokenId);
    }
}
