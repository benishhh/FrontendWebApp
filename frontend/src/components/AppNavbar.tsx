import {
    IconKey,
    IconLogin2,
    IconPlus,
    IconSearch, IconSettings,
    IconUserCircle
} from "@tabler/icons-react";
import {NavLink} from "@mantine/core";
import {useNavigate} from "react-router-dom";


interface AppNavbarProps {
    isLoggedIn: boolean;
}

export const AppNavbar = () => {

    const navigate = useNavigate();
    const isLoggedIn = !!sessionStorage.getItem('authToken');

    return (
        <div>
            <div style={{ position: 'relative', height: '100vh' }}>

                {!isLoggedIn && (
                    <>
                        <NavLink onClick={() => navigate('/moto/login')} label="Logowanie"
                                 leftSection={<IconLogin2 size="2rem" stroke={1.5}/>}/>
                        <NavLink onClick={() => navigate('/moto/register')} label="Rejestracja"
                                 leftSection={<IconKey size="2rem" stroke={1.5}/>}/>
                    </>
                )}

                <NavLink onClick={() => navigate('/moto/search')} label="Przegladaj samochody"
                         leftSection={<IconSearch size="2rem" stroke={1.5}/>}/>
                <NavLink onClick={() => navigate('/moto/addnew')} label="Dodaj ogloszenie"
                         leftSection={<IconPlus size="2rem" stroke={1.5}/>}/>
            </div>
            <div style={{ position: 'absolute', bottom: '0', width: '100%' }}>
                <NavLink onClick={() => navigate('/moto/profile')} label="Konto"
                         leftSection={<IconUserCircle size="2rem" stroke={1.5}/>}/>
                <NavLink onClick={() => navigate('/moto/settings')} label="Ustawienia"
                         leftSection={<IconSettings size="2rem" stroke={1.5}/>}/>
            </div>
        </div>

    )
}