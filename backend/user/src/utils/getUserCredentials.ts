const getUserCredentials = async (accessToken: string | string[] | undefined) => {
    if (!accessToken || typeof accessToken !== 'string') {
        return ({ error: 'Access token not provided or provided in the wrong format'});
    }

    const oAuthRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

    if (!oAuthRes.ok) {
        const errorResponse = await oAuthRes.json();
        return { error: errorResponse.error_description };
    }

    const {
        name,
        email
    } = await oAuthRes.json();

    return { name, email };
}

export default getUserCredentials;