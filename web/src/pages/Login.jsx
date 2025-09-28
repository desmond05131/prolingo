import LoginForm from "../components/Forms/LoginForm"
import { Link } from "react-router-dom"

function Login() {
    return (
        <div className="min-h-screen w-full bg-[#0f1115] text-slate-100 flex items-center justify-center p-6">
            <div className="space-y-6">
                <LoginForm route="/api/token/" />
                <div className="text-center text-sm text-slate-400">
                    <div>
                        Don't have an account? {" "}
                        <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
                    </div>
                    {/* <div className="mt-2">
                        Forgot your password? {" "}
                        <Link to="/forgot-password" className="text-blue-400 hover:underline">Reset it</Link>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

// const OriginalLogin = Login

// Login = function LoginWithRegisterButton() {
//     return (
//         <>
//             <OriginalLogin />
//             <RegisterButton />
//         </>
//     )
// }

export default Login