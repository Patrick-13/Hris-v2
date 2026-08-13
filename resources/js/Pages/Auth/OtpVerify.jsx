import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";

export default function OtpVerify({ email }) {
    const { errors } = usePage().props;

    const OTP_DURATION = 300; // 5 minutes

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timeLeft, setTimeLeft] = useState(OTP_DURATION);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const maskEmail = (email) => {
        if (!email) return "";

        const [name, domain] = email.split("@");

        if (name.length <= 2) {
            return `${name[0]}*@${domain}`;
        }

        return (
            name[0] +
            "*".repeat(name.length - 2) +
            name[name.length - 1] +
            "@" +
            domain
        );
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const submit = (e) => {
        e.preventDefault();

        if (timeLeft <= 0) {
            return;
        }

        setLoading(true);

        router.post(
            route("otp.verify"),
            {
                otp,
            },
            {
                preserveScroll: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    const resendOtp = () => {
        setResending(true);

        router.post(
            route("otp.resend"),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOtp("");
                    setTimeLeft(OTP_DURATION);
                },
                onFinish: () => setResending(false),
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4">
                    Email Verification
                </h2>

                <p className="text-sm text-gray-500 text-center mb-2">
                    Enter the 6-digit code sent to
                </p>

                <p className="text-center font-semibold text-gray-700 mb-6">
                    {maskEmail(email)}
                </p>

                <div className="text-center mb-6">
                    {timeLeft > 0 ? (
                        <p className="text-sm text-gray-600">
                            OTP expires in{" "}
                            <span className="font-bold text-blue-600">
                                {formatTime(timeLeft)}
                            </span>
                        </p>
                    ) : (
                        <p className="text-sm font-semibold text-red-600">
                            OTP has expired. Please request a new one.
                        </p>
                    )}
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <input
                        type="text"
                        value={otp}
                        maxLength={6}
                        onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        disabled={timeLeft <= 0}
                        className="w-full border rounded-lg px-4 py-3 text-center text-xl tracking-[0.5em] text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="000000"
                    />

                    {errors.otp && (
                        <p className="text-red-500 text-sm text-center">
                            {errors.otp}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            timeLeft <= 0 ||
                            otp.length !== 6
                        }
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "Verifying..."
                            : timeLeft <= 0
                            ? "OTP Expired"
                            : "Verify OTP"}
                    </button>

                    {timeLeft <= 0 && (
                        <button
                            type="button"
                            onClick={resendOtp}
                            disabled={resending}
                            className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition disabled:opacity-50"
                        >
                            {resending
                                ? "Sending..."
                                : "Request New OTP"}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}