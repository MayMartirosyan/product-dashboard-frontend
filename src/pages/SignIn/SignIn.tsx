import React, { useState } from 'react';
import { useSignInMutation } from '../../store/api/apiSlice';
import { useNavigate } from 'react-router-dom';
import './SignIn.scss';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { Loader } from '../../components/ui/Loader/Loader';
import { toast } from 'react-toastify';

export const SignIn: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [signIn, { isLoading, error }] = useSignInMutation();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!form.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await signIn(form).unwrap();
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      window.dispatchEvent(new Event('storageUpdate'));
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.data?.error);
      console.error('SignIn error:', err);
    }
  };

  return (
    <div className="signin container">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit} className="signin-form">
        <Input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader /> : 'Sign In'}
        </Button>
      </form>
    </div>
  );
};
