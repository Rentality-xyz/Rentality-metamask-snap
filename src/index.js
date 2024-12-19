/**
 * Главная функция снепа
 */
import { ManageStateOperation } from '@metamask/snaps-sdk';
import banner from '../images/banner.png';
import { ethers } from 'ethers';

import type { OnHomePageHandler, OnRpcRequestHandler } from "@metamask/snaps-sdk";
import {Box, Heading, Text, Image, Link, Divider} from "@metamask/snaps-sdk/jsx";

async function getAvailableCars() {
    const contractAbi = [
        {
            "type": "function",
            "name": "getAvailableCarsForUser",
            "constant": true,
            "stateMutability": "view",
            "payable": false,
            "inputs": [{"type": "address", "name": "user"}],
            "outputs": [
                {
                    "type": "tuple[]",
                    "name": "",
                    "components": [
                        {"type": "uint256", "name": "carId"},
                        {"type": "string", "name": "carVinNumber"},
                        {"type": "bytes32", "name": "carVinNumberHash"},
                        {"type": "address", "name": "createdBy"},
                        {"type": "string", "name": "brand"},
                        {"type": "string", "name": "model"},
                        {"type": "uint32", "name": "yearOfProduction"},
                        {"type": "uint64", "name": "pricePerDayInUsdCents"},
                        {"type": "uint64", "name": "securityDepositPerTripInUsdCents"},
                        {"type": "uint8", "name": "engineType"},
                        {"type": "uint64[]", "name": "engineParams"},
                        {"type": "uint64", "name": "milesIncludedPerDay"},
                        {"type": "uint32", "name": "timeBufferBetweenTripsInSec"},
                        {"type": "bool", "name": "currentlyListed"},
                        {"type": "bool", "name": "geoVerified"},
                        {"type": "string", "name": "timeZoneId"},
                        {"type": "bool", "name": "insuranceIncluded"},
                        {"type": "bytes32", "name": "locationHash"}
                    ]
                }
            ]
        }
    ]
    const contractAddress = "0xCf261b0275870d924d65d67beB9E88Ebd8deE693";
    const rpcUrl = "https://mainnet.base.org";
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);
    let availableCars = 0
    try {
        const cars = await contract.getAvailableCarsForUser(contractAddress);
        availableCars = cars.length
    } catch (error) {
        console.error("Error:", error);
    }
    return availableCars
}

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
    return ""
}

export const onHomePage: OnHomePageHandler = async () => {

    const cars = await getAvailableCars();

    return {
        content: (
            <Box>
                <Image src={banner}/>
                <Box alignment={'space-between'}  direction="horizontal">
                    <Heading>Available cars</Heading>
                    <Heading>{cars.toString()}</Heading>
                </Box>
                <Divider />
                <Link href="https://app.rentality.xyz">Rent Car</Link>
            </Box>
        ),
    };
}
