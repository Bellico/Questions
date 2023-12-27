var html = `
<html>
    <body style="font-family: Calibri">

        <div style="max-width: 650px;margin: 0 auto">

            <div style="background: #272525; color: #fff;height: 85px;">
                <div style="text-align: center;font-size: 2.2rem; padding-top: 20px;text-transform: uppercase;">Questions editor</div>
            </div>

            <p style="text-align: center;font-size: 26px;">Almost, complete your registery</p>

            <div style="margin: 1em auto;width: 18%;">
                <a href="[Url]" style="display: inline-block; padding: 10px 20px; background-color: #CCA250; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; letter-spacing:1px">
                    Click here
                </a>
            </div>

           <div style="background: #272525; color: #fff;height: 85px;">
                <div style="text-align: center;font-size: 1.2rem; padding-top: 30px;">© 2023 Questions App by Bellico</div>
            </div>
        </div>
    </body>
</html>
`;

export async function sendVerificationAuthToken(email: string, url: string) {
    const response = await fetch("https://api.resend.com/emails", {
        // The body format will vary depending on provider, please see their documentation
        // for further details.
        body: JSON.stringify({
            to: [email],
            from: "noreply@resend.dev",
            subject: "Sign in to Your page",
            html: html.replace('[Url]', url)
        }),
        headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        method: "POST",
    })

    if (!response.ok) {
        const { errors } = await response.json()
        throw new Error(JSON.stringify(errors))
    }
}
