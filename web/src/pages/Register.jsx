import RegisterForm from '../components/Forms/RegisterForm'
import LoginButton from '../components/Buttons/LoginButton';

function Register() {
    return <RegisterForm route="/api/users/register/" />;
}

const BaseRegister = Register

Register = function RegisterWithLoginButton() {
    return (
        <>
            <BaseRegister />
            <LoginButton />
        </>
    );
}

export default Register;