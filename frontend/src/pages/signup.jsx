import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./signup.css";
import { IconChartBar,IconUser, IconMail, IconLock } from '@tabler/icons-react'
export default function Signup() {

  const { register, handleSubmit } = useForm();

  const { signup } = useAuth();

  const navigate = useNavigate();

  const onSubmit = async (data) => {

      const result = await signup(data);

      if (result.success) {
           navigate("/dashboard");
      } else {
           alert(result.error);
  }

  };

  return (
    <div className="signup-container">

      <div className="signup-header">
        
        
        <h2><IconChartBar size={24} color="#24292e" />Business Intelligence Dashboard</h2>
      </div>


      <div className="signup-wrapper">

      <h2>CREATE YOUR ACCOUNT</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="signup-username">
          <label>Username:</label>
          <div className="s-username-input">
            <IconUser size={20} color="#5a7a6c" />
            <input
          placeholder="enter valid Username"
          {...register("username")}
        /></div>
        
        </div>
        <div className="signup-email">
          <label>Email:</label>
          <div className="s-email-input">
            <IconMail size={20} color="#5a7a6c" />
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
            />
          </div>
        </div>
        
        <div className="signup-password">
          <label>Password:</label>
          <div className="s-password-input">
            <IconLock size={20} color="#5a7a6c" />
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
            />
          </div>
        </div>
        
        <div className="signup-button">
          <button type="submit">
          Create Account
        </button>
        </div>
        

      </form>

      <div className="signup-login-link">
        <Link to="/login">
        Already have account?
      </Link>
      </div>

      

      </div>

    </div>

  );
}