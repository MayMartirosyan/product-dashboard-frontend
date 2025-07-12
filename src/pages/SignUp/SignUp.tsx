import React, { useState } from 'react';
import { useSignUpMutation } from '../../store/api/apiSlice';
import { useNavigate } from 'react-router-dom';
import './SignUp.scss';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { Loader } from '../../components/ui/Loader/Loader';
import { DatePicker } from '../../components/ui/DatePicker/DatePicker';
import { toast } from 'react-toastify';

export const SignUp: React.FC = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
  });
  const [signUp, { isLoading, error }] = useSignUpMutation();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      birthDate: '',
    };
    let isValid = true;

    if (!form.firstName) {
      newErrors.firstName = 'First Name is required';
      isValid = false;
    }
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

  const handleDateChange = (date: Date | null) => {
    setForm({
      ...form,
      birthDate: date ? date.toISOString().split('T')[0] : '',
    });
    setErrors({ ...errors, birthDate: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await signUp(form).unwrap();

      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.id);
      window.dispatchEvent(new Event('storageUpdate'));
      toast.success('success !');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.data?.error);
      console.error('SignIn error:', err);
    }
  };

  return (
    <div className="signup container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <Input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <DatePicker
          selected={form.birthDate ? new Date(form.birthDate) : null}
          onChange={handleDateChange}
          placeholder="Birth Date"
          error={errors.birthDate}
        />

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
          {isLoading ? <Loader /> : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
};
