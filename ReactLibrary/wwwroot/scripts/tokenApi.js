export function getToken() {
    let token = sessionStorage.getItem('token');
    if (!token || isExpired(token)) {
        let refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken)
            return null;
        fetch("/auth/refresh", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: refreshToken
        })
            .then(response => response.json())
            .then(data => {
            if (data.access_token) {
                localStorage.setItem('username', data.username);
                sessionStorage.setItem('token', data.access_token);
                localStorage.setItem('refreshToken', JSON.stringify(data.refresh_token));
            }
            else
                return null;
        });
    }
    token = sessionStorage.getItem('token');
    return token;
}
export function updateTokens(data) {
    if (data.access_token) {
        localStorage.setItem('username', data.username);
        sessionStorage.setItem('token', data.access_token);
        localStorage.setItem('refreshToken', JSON.stringify(data.refresh_token));
    }
}
function isExpired(jwt) {
    if (!jwt)
        return null;
    const decoded = JSON.parse(atob(jwt.split('.')[1]));
    let exp = decoded && decoded.exp && decoded.exp * 1000 || null;
    return Date.now() > exp;
}
//# sourceMappingURL=tokenApi.js.map