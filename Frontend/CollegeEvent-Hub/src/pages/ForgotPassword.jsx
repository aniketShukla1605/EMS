import { useState } from "react";
import api from "../api/axiosConfig";

export default function ForgotPassword() {

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  
  const sendOtp = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/otp/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email
          })
        }
      );
      alert("OTP sent!");
      setStep(2);
    } catch (err) {
      alert("Error sending OTP");
    }
  };

  
  const verifyOtp = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/otp/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            otp: otp
          })
        }
      );
      alert("OTP verified!");
      setStep(3);
    } catch (err) {
      alert("Invalid OTP");
    }
  };


  const resetPassword = async () => {
    try {
      await api.put("/profile/reset-password", {
        email,
        newPassword,
      });

      alert("Password updated!");
      setStep(1);
      
    } catch (err) {
      alert("Error updating password");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">

      <div className="bg-white/10 p-8 rounded-xl w-[400px]">

        <h2 className="text-2xl text-brand mb-4 text-center">
          Forgot Password
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 bg-white/10 text-white rounded"
            />

            <button
              onClick={sendOtp}
              className="w-full bg-brand py-2 rounded"
            >
              Send OTP
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-4 bg-white/10 text-white rounded"
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-brand py-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-white/10 text-white rounded"
            />

            <button
              onClick={resetPassword}
              className="w-full bg-brand py-2 rounded"
            >
              Reset Password
            </button>
          </>
        )}

      </div>
    </div>
  );
}