import React from 'react';
import { useGetProfileQuery } from '../../store/api/apiSlice';
import './MyProfile.scss';
import { Loader } from '../../components/ui/Loader/Loader';
import { ProfileForm } from '../../components/ProfileForm/ProfileForm';

export const MyProfile: React.FC = () => {
  const { data: profile, isLoading, error } = useGetProfileQuery();

  return (
    <div className="my-profile container">
      <h1>My Profile</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p>Error loading profile</p>
      ) : profile ? (
        <ProfileForm profile={profile} />
      ) : (
        <p>No profile data</p>
      )}
    </div>
  );
};
