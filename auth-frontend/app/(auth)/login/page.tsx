import { loginAction } from "@/app/actions/form-action";
import AuthForm from "../AuthForm";

const Login = () => {
  return (
    <div>
      <AuthForm isSignup={false} action={loginAction} />
    </div>
  );
};

export default Login;