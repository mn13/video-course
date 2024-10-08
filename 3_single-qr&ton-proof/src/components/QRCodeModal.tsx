import {FunctionComponent, useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay} from "@chakra-ui/react";
import {WalletInfoRemote} from "@tonconnect/sdk";
import QRCode from 'react-qr-code';
import {connector} from "../connector";
import {useWallet} from "../hooks/useWallet";
import {tonProofApi} from "../ton-proof-api";

export const QRCodeModal: FunctionComponent<{ isOpen: boolean; onClose: () => void, walletInfo: WalletInfoRemote | null }> = ({isOpen, onClose, walletInfo}) => {

    const [walletConnectionURL, setWalletConnectionURL] = useState('');

    useEffect(() => {
        (async () => {
            const payload = await tonProofApi.generatePayload();
            console.log('walletInfo', walletInfo, payload)
            if (walletInfo) {
                setWalletConnectionURL(
                    connector.connect({ bridgeUrl: walletInfo.bridgeUrl, universalLink: walletInfo.universalLink }, payload)
                );
            }
        })()
    }, [walletInfo]);

    const wallet = useWallet();

    useEffect(() => {
        if (isOpen && wallet) {
            onClose();
        }
    }, [isOpen, wallet, onClose])

    return <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalCloseButton />
            <ModalHeader>Connect to {walletInfo?.name}</ModalHeader>
            <ModalBody display="flex" flexDirection="column" alignItems="center">
                <QRCode value={walletConnectionURL} />
                <Button onClick={() => window.open(walletConnectionURL, '_blank')} w="100%" my="4">Open {walletInfo?.name}</Button>
            </ModalBody>
        </ModalContent>
    </Modal>
}
