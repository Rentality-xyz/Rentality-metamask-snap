/**
 * Главная функция снепа
 */
import { ManageStateOperation } from '@metamask/snaps-sdk';
import banner from '../images/banner.png';

import type { OnHomePageHandler, OnRpcRequestHandler } from "@metamask/snaps-sdk";
import {Box, Heading, Text, Image, Link, Divider} from "@metamask/snaps-sdk/jsx";


export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
    return ""
}

export const onHomePage: OnHomePageHandler = async () => {

    return {
        content: (
            <Box>
                <Image src={banner}/>
                {/*<Text>{persistedData.message || JSON.stringify(persistedData)}</Text>*/}
                <Box alignment={'space-between'}  direction="horizontal">
                    <Heading>Balance</Heading>
                    <Heading>0</Heading>
                </Box>
                <Box alignment={'space-between'}  direction="horizontal">
                    <Heading>Available cars</Heading>
                    <Heading>37</Heading>
                </Box>
                <Box alignment={'space-between'}  direction="horizontal">
                    <Heading>Is host</Heading>
                    <Heading>❌</Heading>
                </Box>
                <Divider />
                <Link href="https://app.rentality.xyz">Rent Car</Link>
            </Box>
        ),
    };
}
