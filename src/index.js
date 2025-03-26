import banner from '../images/banner.png';
import { ethers } from 'ethers';
import { abi } from './abi.json'

import type { OnHomePageHandler, OnRpcRequestHandler } from "@metamask/snaps-sdk";
import {Box, Heading, Text, Image, Link, Divider, Button} from "@metamask/snaps-sdk/jsx";

const rpcUrl = "https://mainnet.base.org";
// const rpcUrl = "https://sepolia.base.org";
const rentalityAppUrl = "https://app.rentality.io";
const contractGatewayAddress = "0xCf261b0275870d924d65d67beB9E88Ebd8deE693";
// const contractGatewayAddress = "0xB257FE9D206b60882691a24d5dfF8Aa24929cB73";
const contractReferralAddress = "0x4f7cF63DCd5c418EEBdDb29FC7E5bFf841F51ddF";
// const contractReferralAddress = "0xBeF58aBf15D45B9c1e2c18339e2c2Dc9520a5e5D";


async function getAvailableCars(): Promise<number> {

    let availableCars = 0

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(contractGatewayAddress, abi, provider);

    try {
        const cars = await contract.getAvailableCarsForUser(contractGatewayAddress);
        availableCars = cars.length
    } catch (error) {
        console.error("Error:", error);
    }
    return availableCars
}

async function getPointsForUser(userAddress): Promise<number> {

    let points = 0;
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(contractReferralAddress, abi, provider);

    try {
        const response = await contract.getReadyToClaim(userAddress);
        points = response[1];
    } catch (error) {
        console.error("Error:", error);
    }
    return points
}

async function getTripForUser(userAddress) {

    let answer = [false, []]

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(contractGatewayAddress, abi, provider);

    try {
        const response = await contract.getTripsAs(false, { from: userAddress });
        const trip = response.at(-1)
        const statusCode = trip[0][2]
        const carModel = trip[9]
        const carBrand = trip[10]
        const carYear = trip[11]
        const status = getTripStatus(statusCode)

        if(statusCode !== BigInt(7)) {
            answer[0] = true
            answer[1] = [`${carBrand} ${carModel} ${carYear}`, status]
        }
    } catch (error) {
        console.error("Error:", error);
    }
    return answer
}

async function getWalletAddress() {
    try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts"});
        return accounts[0];
    } catch (error) {
        return "0x00";
    }
}

function getTripStatus(statusCode: bigint): string {
    switch (statusCode) {
        case BigInt(0):
            return "Pending"
        case BigInt(1):
            return "Confirmed"
        case BigInt(2):
            return "Started"
        case BigInt(3):
            return "On the trip"
        case BigInt(4):
            return "Finished by guest"
        case BigInt(5):
            return "Finished"
        case BigInt(6):
            return "Completed"
        case BigInt(7):
            return "Rejected"
        case BigInt(100):
            return "Completed without guest confirmation"
        default:
            return "Rejected"
    }
}

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
    return ""
}

export const onHomePage: OnHomePageHandler = async () => {

    const walletAddress = await getWalletAddress();
    const cars = await getAvailableCars();
    const points = await getPointsForUser(walletAddress);
    const currentTrip = await getTripForUser(walletAddress);

    return {
        content: (
            <Box>
                <Image src={banner}/>
                <Box alignment={'space-between'}  direction="horizontal">
                    <Box alignment={'start'}  direction="horizontal">
                        <Heading>🚗</Heading>
                        <Heading> Available cars</Heading>
                    </Box>
                    <Heading>{cars.toString()}</Heading>
                </Box>
                <Box alignment={'space-between'}  direction="horizontal">
                    <Box alignment={'start'}  direction="horizontal">
                        <Heading>⭐</Heading>
                        <Heading> Your points</Heading>
                    </Box>
                    <Heading>{points.toString()}</Heading>
                </Box>
                <Link href={`${rentalityAppUrl}/guest/points`}>About points</Link>
                <Divider />
                {
                    currentTrip[0] ? (
                        <Box>
                            <Box alignment={'start'}  direction="horizontal">
                                <Heading>🛣</Heading>
                                <Heading> Your current trip</Heading>
                            </Box>
                            <Box alignment={'space-between'}  direction="horizontal">
                                <Text>Car</Text>
                                <Text>{currentTrip[1][0]}</Text>
                            </Box>
                            <Box alignment={'space-between'}  direction="horizontal">
                                <Text>Status</Text>
                                <Text>{currentTrip[1][1]}</Text>
                            </Box>
                        </Box>
                    ): (
                        <Box alignment={'start'}  direction="horizontal">
                            <Heading>🛣</Heading>
                            <Heading>Current trip not found</Heading>
                        </Box>
                    )
                }
                <Link href={`${rentalityAppUrl}/guest/trips/booked`}>See details</Link>
                <Divider />
                <Link href={`${rentalityAppUrl}/guest/search`}>Rent Car</Link>
            </Box>
        ),
    };
}
