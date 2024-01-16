import {showNotification} from "@mantine/notifications";

export const loginErrorNotification = () => {
    showNotification({
        color: 'red',
        title: 'Error',
        message: 'Login failed',
    })
}
export const registerErrorNotification = () => {
    showNotification({
        color: 'red',
        title: 'Error',
        message: 'Register failed',
    })
}
export const registerSuccessfulNotification = () => {
    showNotification({
        color: 'red',
        title: 'Successful',
        message: 'Pomyślnie zarejestrowano!',
    })
}