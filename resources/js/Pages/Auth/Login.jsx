import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/denr-web-background.png')",
            }}
        >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1
                        className="mt-4 text-5xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-green-700"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Sign in to continue to your account
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="name" value="Username" />
                        <TextInput
                            id="name"
                            type="text"
                            value={data.name}
                            className="mt-2 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            value={data.password}
                            className="mt-2 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-sm text-blue-600 hover:text-blue-700"
                            >
                                Forgot Password?
                            </Link>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-lg bg-gradient-to-r from-blue-800 to-green-700 py-3 text-white font-semibold hover:bg-blue-700 transition"
                    >
                        {processing ? "Logged In..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
