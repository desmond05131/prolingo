import LoginForm from "../components/Forms/LoginForm"
import RegisterButton from "../components/Buttons/RegisterButton"

function Login() {
    return <LoginForm route="/api/token/" />
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