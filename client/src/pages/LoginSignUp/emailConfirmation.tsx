import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate,useSearchParams } from 'react-router-dom';
import PageIllustration from './PageIllustration.jsx';
type Props = {}

const EmailConfirmation = (props: Props) => {
const navigate = useNavigate();
const [searchParams] = useSearchParams();
  useEffect(() => {

    const verify = async () => {
			const key = searchParams.get('key');
			if (key) {
				const response = await axios({
					method: 'GET',
					url: 'http://localhost:5000/verify-email?key=' + key,
					withCredentials: true,
				});
				alert(response.data.message);
				navigate('/SignUpSuite', { replace: true });
			}
		}
    verify();
    ; });
  return (
    <div className="flex flex-col min-h-screen overflow-hidden antialiased bg-gray-900 text-gray-200 tracking-tight">
    <main className="grow">
        {/* Page illustration */}
        <div className="relative max-w-6xl mx-auto h-0 pointer-events-none" aria-hidden="true">
            <PageIllustration />
        </div>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Verify Your Email Address</h2>
        </div>
        <div className="rounded-md bg-white shadow-md p-8">
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-6">
              An email has been sent to your email address. Please click on the verification link to confirm your email.
            </p>
          </div>
          <div className="text-center">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              OKAY
            </button>
          </div>
        </div>
      </div>
    </div>
    </main>
        </div>
  )
}

export default EmailConfirmation