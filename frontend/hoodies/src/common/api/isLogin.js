export const isLogin = () => !!localStorage.getItem("nickname");
export const isAdmin = () => !!localStorage.getItem("flag")
