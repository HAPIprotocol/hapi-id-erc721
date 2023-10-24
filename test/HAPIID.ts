import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import "@nomicfoundation/hardhat-chai-matchers";

import { HAPIID, HAPIID__factory } from "../typechain-types";

describe("HAPIID", function () {
  let HAPIID: HAPIID__factory;
  let hapiid: HAPIID;
  let owner: Signer;
  let minter1: Signer;
  let minter2: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    HAPIID = await ethers.getContractFactory("HAPIID");
    [owner, minter1, minter2, addr1, addr2] = await ethers.getSigners();

    hapiid = await HAPIID.deploy(
      await owner.getAddress(),
      await minter1.getAddress()
    );
  });

  describe("Deployment", function () {
    it("Should set the correct default admin and minter", async function () {
      await expect(
        hapiid.hasRole(await hapiid.DEFAULT_ADMIN_ROLE(), owner.getAddress())
      ).to.eventually.be.true;
      await expect(
        hapiid.hasRole(await hapiid.MINTER_ROLE(), minter1.getAddress())
      ).to.eventually.be.true;
    });

    it("Should allow admin to grant minter role", async function () {
      await hapiid
        .connect(owner)
        .grantRole(await hapiid.MINTER_ROLE(), minter2.getAddress());
      await expect(
        hapiid.hasRole(await hapiid.MINTER_ROLE(), minter2.getAddress())
      ).to.eventually.be.true;
    });

    it("Should allow admin to revoke minter role", async function () {
      await hapiid
        .connect(owner)
        .grantRole(await hapiid.MINTER_ROLE(), minter2.getAddress());
      await hapiid
        .connect(owner)
        .revokeRole(await hapiid.MINTER_ROLE(), minter2.getAddress());
      await expect(
        hapiid.hasRole(await hapiid.MINTER_ROLE(), minter2.getAddress())
      ).to.eventually.be.false;
    });
  });

  describe("Minting", function () {
    it("Should allow the minter to mint tokens", async function () {
      await hapiid.connect(minter1).safeMint(addr1.getAddress(), 1);
      expect(await hapiid.ownerOf(1)).to.equal(await addr1.getAddress());
    });

    it("Should not allow non-minters to mint tokens", async function () {
      await expect(
        hapiid.connect(addr1).safeMint(addr1.getAddress(), 1)
      ).to.be.revertedWithCustomError(
        hapiid,
        "AccessControlUnauthorizedAccount"
      );
    });

    it("Should return the correct tokenURI", async function () {
      await hapiid.connect(minter1).safeMint(addr1.getAddress(), 1);
      expect(await hapiid.tokenURI(1)).to.equal("https://id.hapi.one/1");
    });
  });

  describe("Token Transfers", function () {
    it("Should allow the owner to transfer a token", async function () {
      await hapiid.connect(minter1).safeMint(addr1.getAddress(), 1);
      await hapiid
        .connect(addr1)
        .transferFrom(await addr1.getAddress(), await addr2.getAddress(), 1);
      expect(await hapiid.ownerOf(1)).to.equal(await addr2.getAddress());
    });

    it("Should not allow a non-owner to transfer a token", async function () {
      await hapiid.connect(minter1).safeMint(addr1.getAddress(), 1);
      await expect(
        hapiid
          .connect(addr2)
          .transferFrom(await addr1.getAddress(), await addr2.getAddress(), 1)
      ).to.be.revertedWithCustomError(hapiid, "ERC721InsufficientApproval");
    });

    it("Should allow an approved address to transfer a token", async function () {
      await hapiid.connect(minter1).safeMint(addr1.getAddress(), 1);
      await hapiid.connect(addr1).approve(await addr2.getAddress(), 1);
      await hapiid
        .connect(addr2)
        .transferFrom(await addr1.getAddress(), await addr2.getAddress(), 1);
      expect(await hapiid.ownerOf(1)).to.equal(await addr2.getAddress());
    });
  });
});
