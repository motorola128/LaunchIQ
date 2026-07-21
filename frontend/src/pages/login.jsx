import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./login.css";
import { IconChartBar,IconUser, IconMail, IconLock } from '@tabler/icons-react'

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
  const result = await login(
    data.email,
    data.password
  );

  if (result.success) {
    navigate("/dashboard");
  } else {
    alert(result.error);
  }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        
        
        <h2><IconChartBar size={24} color="#24292e" />Business Intelligence Dashboard</h2>
      </div>
      <div className="login-wrapper">
              <h2>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="login-email">
          <label>Email:</label>
          <div className="l-email-input">
            <IconMail size={20} color="#5a7a6c" />
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email required"})}
            />
          </div>
        </div>

        <div className="login-password">
          <label>Password:</label>
          <div className="l-password-input">
            <IconLock size={20} color="#5a7a6c" />
            <input
              type="password"
              placeholder="Password"
              {...register("password",{ required: "Password required"})}
            />
          </div>
        </div>

        <div className="login-button">
          <button type="submit">
            Login
          </button>
        </div>

      </form>

      <br />

      
      </div>
      <div className="login-footer">
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    


    </div>
  );
}