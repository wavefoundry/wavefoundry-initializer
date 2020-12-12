import React from "react";

const RecaptchaMessage: React.FC = () => {
  return (
    <div className="border-gray-300 border w-52 mt-2 px-2 py-1 bg-gray-100 leading-none">
      <div className="pb-1">
        <p className="text-gray-500 font-size-12">
          This form is protected by reCAPTCHA
        </p>
      </div>
      <div className="flex">
        <div className="mr-2">
          <a
            href="https://policies.google.com/privacy"
            className="text-gray-500 hover:underline font-size-10 block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
        </div>
        <div>
          <a
            href="https://policies.google.com/terms"
            className="text-gray-500 hover:underline font-size-10 block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecaptchaMessage;
