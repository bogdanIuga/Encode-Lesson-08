import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";

import * as dotenv from 'dotenv';
dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS ?? "";

async function main() {
    //receive parameters
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 1)
        throw new Error("Parameters not provided");
    const delegateTo = parameters[0];

    //configure provider
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");

    //configure wallet
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    console.log(`Using address ${wallet.address}`);

    //attach contract
    const ballotFactory = new Ballot__factory(wallet);
    const ballotContract = ballotFactory.attach(CONTRACT_ADDRESS) as Ballot;

    const tx = await ballotContract.delegate(delegateTo);
    const receipt = await tx.wait();
    console.log(`Transaction completed ${receipt?.hash}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});