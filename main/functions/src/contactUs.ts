import { CallableContext } from 'firebase-functions/lib/providers/https';
import axios from 'axios';
import { ADMIN_EMAILS} from './constants';
import { handleError, sendEmail } from './utils';
import { GOOGLE_RECAPTCHA_SECRET } from './config';

function validate(data: any) {
    if (!data.name || !data.email || !data.message) {
        throw new Error('Invalid data');
    }
}

async function validateRecaptchaToken(response: string) {
    const { data } = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${GOOGLE_RECAPTCHA_SECRET}&response=${response}`, {})
    if (!data.success) {
        throw new Error("Invalid recaptcha token");
    }
    return;
}

export default async (data: any, context: CallableContext) => {
    try {
        validate(data);
        await validateRecaptchaToken(data.recaptchaToken);
        await Promise.all(ADMIN_EMAILS.map(recipient => {
            return sendEmail(recipient, 'New Message from Contact Us Form', `<div>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Message:</strong> ${data.message}</p>
            </div>`)
        }))
    }
    catch (err) {
        console.log(err);
        return handleError(err);
    }
    return;
}