import RegisterForm from '../components/Forms/RegisterForm'
import { Link } from 'react-router-dom'

export default function Register() {
    return (
        <div className="min-h-screen w-full bg-[#0f1115] text-slate-100 flex items-center justify-center p-6">
            <div className="space-y-6">
                <RegisterForm route="/client/register/" />
                <div className="text-center text-sm text-slate-400">
                    <div>
                        Already have an account? {" "}
                        <Link to="/login" className="text-blue-400 hover:underline">Sign in</Link>
                    </div>
                    <div className="mt-2">
                        Forgot your password? {" "}
                        <Link to="/forgot-password" className="text-blue-400 hover:underline">Reset it</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}