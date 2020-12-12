import { HOST_URL, TABLE_STYLE } from "../constants";

const logoSrc = "https://firebasestorage.googleapis.com/v0/b/philips-academy-coffee.appspot.com/o/logo.png?alt=media&token=ac1be704-f5cb-4d56-a54f-41ba9747e66e";

export default (emailBody: string, emailAddress: string): string => {
    return `
        <html>
            <body style="padding: 12px">
                <div style="width: 100%; margin: auto; max-width: 620px; font-family: Arial, Helvetica, sans-serif">
                    <table style="${TABLE_STYLE} margin: auto">
                        <tbody>
                            <tr>
                                <td>
                                    <table style="${TABLE_STYLE}">
                                        <tbody>
                                            <tr>
                                                <td style="height: 100px; vertical-align: middle; text-align: center; padding: 8px 0">
                                                    <a style="text-decoration: none" href="${HOST_URL}">
                                                        <img style="vertical-align: middle" src="${logoSrc}" width="200" alt="Logo" />
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    ${emailBody}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table style="${TABLE_STYLE} margin: 24px auto; border-top: 1px solid #dddddd;">
                        <tbody>
                            <tr>
                                <td style="font-size: 12px; color: #888888; padding: 16px 0px;">
                                    Please do not reply to this email address as it is not monitored. This email was sent to <a style="text-decoration: underline; color: #888888;" href="mailto:${emailAddress}">${emailAddress}</a>.
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 12px; color: #888888">
                                    © Copyright ${new Date().getFullYear()} <a style="text-decoration: underline; color: #888888;" href="${HOST_URL}">Philips Academy</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    `
}