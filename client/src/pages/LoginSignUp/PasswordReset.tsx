import React, { useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";

import Header from "./Header.tsx";
import PageIllustration from "./PageIllustration.jsx";

interface Props {
  goBack: () => void;
}

const ResetPassword: React.FC<Props> = ({ goBack }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/reset-password-request", {
        email: email,
      });
      console.log(response.data);
      alert("Password reset instructions sent to your email.");
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Error sending password reset instructions.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden antialiased bg-gray-900 text-gray-200 tracking-tight">
      {/*  Site header */}
      <Header goBack={goBack} />

      {/*  Page content */}
      <main className="grow">
        {/*  Page illustration */}
        <div
          className="relative max-w-6xl mx-auto h-0 pointer-events-none"
          aria-hidden="true"
        >
          <PageIllustration />
        </div>

        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="h1 mb-4">Forgot your password?</h1>
                <p className="text-xl text-gray-400">
                  We'll email you instructions on how to reset it.
                </p>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                <form onSubmit={handleResetPassword}>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-300 text-sm font-medium mb-1"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="form-input w-full text-gray-300"
                        placeholder="you@yourcompany.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full px-3">
                      <Button
                        type="submit"
                        disabled={loading}
                        className={`btn text-white bg-purple-600 hover:bg-purple-700 w-full ${
                          loading && "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {loading ? "Resetting..." : "Reset Password"}
                      </Button>
                    </div>
                  </div>
                </form>
                <div className="text-gray-400 text-center mt-6">
                  <Button
                    onClick={goBack}
                    className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResetPassword;
