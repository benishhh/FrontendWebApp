import {Outlet} from "react-router-dom";
import {AppNavbar} from "./AppNavbar";
import {AppShell, Burger, Group, Image, Title} from "@mantine/core";
import React from "react";
import {useDisclosure} from "@mantine/hooks";
import '../styles/Layout.css';


export const Layout = () => {

    const [opened, {toggle}] = useDisclosure();

    return (
        <AppShell
            header={{height: 60}}
            navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !opened}}}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                    <Group>
                        {/*<Image src="../logo3.png" alt="Logo MOTOOTO" width={45} height={45}></Image>*/}
                        <Image src="../motootologo.png" alt="Logo MOTOOTO" width={45} height={45}></Image>
                        <Title>MOTOOTO</Title>
                        {/*<Title className="logo-text">MOTOOTO</Title>*/}
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <AppNavbar/>
            </AppShell.Navbar>
            <AppShell.Main><Outlet/></AppShell.Main>
        </AppShell>
    )
}