import { IUserLocalInfo } from "../../Interface/IUserContext";

export function setLocalUserInfo(userInfo: IUserLocalInfo) {
    localStorage.setItem("user_id", userInfo.id);
    localStorage.setItem("token", userInfo.token);
    localStorage.setItem("email", userInfo.email);
    localStorage.setItem("role", userInfo.role);
    localStorage.setItem("name", userInfo.name);
    localStorage.setItem("first_name", userInfo.first_name);
    localStorage.setItem("last_name", userInfo.last_name);
    if (userInfo.role) {
        localStorage.setItem("raw_user", JSON.stringify(userInfo));
    }
    if (userInfo?.cart) {
        localStorage.setItem('cart', JSON.stringify(userInfo.cart));
    }
    localStorage.setItem("loggedIn", JSON.stringify(true));
}

export function getLocalUserInfo(): IUserLocalInfo {
    return ({
        id: localStorage.getItem("user_id")!,
        token: localStorage.getItem("token")!,
        email: localStorage.getItem("email")!,
        role: localStorage.getItem("role")!,
        name: localStorage.getItem("name")!,
        first_name: localStorage.getItem("first_name")!,
        last_name: localStorage.getItem("last_name")!,
        cart: JSON.parse(localStorage.getItem('cart')!),
        loggedIn: JSON.parse(localStorage.getItem("loggedIn")!),
        raw_user: JSON.parse(localStorage.getItem('raw_user')!)

    });
}

export function removeLocalUserInfo() {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("raw_user");
    localStorage.removeItem("loggedIn");
}

export function updateCart(obj: object): void {
    localStorage.setItem('cart', JSON.stringify(obj));
}

export function clearCart() {
    localStorage.setItem('cart', "{}");
}

export function getCart() {
    localStorage.getItem('cart');
}