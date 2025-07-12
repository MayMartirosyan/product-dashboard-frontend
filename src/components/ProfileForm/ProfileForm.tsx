import React, { useState, useEffect } from 'react';
import { useUpdateProfileMutation } from '../../store/api/apiSlice';
import './ProfileForm.scss';
import { User } from '../../types';
import { Input } from '../ui/Input/Input';
import { Button } from '../ui/Button/Button';
import { Loader } from '../ui/Loader/Loader';
import { DatePicker } from '../ui/DatePicker/DatePicker';
import { useNavigate } from 'react-router-dom';
import ImagePlaceholder from '../../assets/imagePlaceholder.jpg';
import { STORAGE_URL } from '../../utils';
import { format, isValid } from 'date-fns';
import { toast } from 'react-toastify';

interface ProfileFormProps {
  profile: User;
  onClose?: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onClose,
}) => {
  const navigate = useNavigate();
  const initialBirthDate =
    profile.birthDate && isValid(new Date(profile.birthDate))
      ? profile.birthDate
      : '';
  const [form, setForm] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    birthDate: initialBirthDate,
    password: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentPicture, setCurrentPicture] = useState<string | null>(
    profile.picture || null
  );
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    password: '',
    file: '',
  });
  const [updateProfile, { isLoading, error }] = useUpdateProfileMutation();

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [file]);

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      birthDate: '',
      password: '',
      file: '',
    };
    let isFormValid = true;

    if (!form.firstName) {
      newErrors.firstName = 'First Name is required';
      isFormValid = false;
    }

    if (form.birthDate && !isValid(new Date(form.birthDate))) {
      newErrors.birthDate = 'Invalid date format';
      isFormValid = false;
    }
    if (form.password && form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isFormValid = false;
    }
    if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
      newErrors.file = 'Only JPEG or PNG images are allowed';
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleDateChange = (date: Date | null) => {
    if (date && isValid(date)) {
      const formattedDate = format(date, 'yyyy-MM-dd');

      setForm({
        ...form,
        birthDate: formattedDate,
      });
    } else {
      setForm({ ...form, birthDate: '' });
    }
    setErrors({ ...errors, birthDate: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setErrors({ ...errors, file: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    formData.append('birthDate', form.birthDate);
    if (form.password) formData.append('password', form.password);
    if (file) formData.append('picture', file);

    try {
      const res = await updateProfile(formData).unwrap();

      if (res.id) {
        setCurrentPicture(res.picture as any);
        setFile(null);
        toast.success('Profile info was updated successfully');
        if (onClose) onClose();
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err?.data?.error || 'Something went wrong');
      console.error('Profile update error:', err);
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      birthDate: initialBirthDate,
      password: '',
    });
    setFile(null);
    setPreview(null);
    setErrors({
      firstName: '',
      lastName: '',
      birthDate: '',
      password: '',
      file: '',
    });
    if (onClose) onClose();
  };

  const imageSrc = preview
    ? preview
    : currentPicture
      ? `${STORAGE_URL}${currentPicture}`
      : ImagePlaceholder;

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="profile-picture-preview">
        <img src={imageSrc} alt="Profile Preview" />
      </div>

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
        selected={
          form.birthDate && isValid(new Date(form.birthDate))
            ? new Date(form.birthDate)
            : null
        }
        onChange={handleDateChange}
        placeholder="Birth Date"
        error={errors.birthDate}
      />
      <Input
        type="file"
        name="picture"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
      />
      {errors.file && <span className="error-message">{errors.file}</span>}

      <Input
        name="password"
        type="password"
        placeholder="New Password (optional)"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
      />
      <div className="profile-form-buttons">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader /> : 'Update Profile'}
        </Button>
        <Button type="button" variant="error" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
