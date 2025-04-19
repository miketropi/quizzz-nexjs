'use client';

import { useModal } from '@/components/Modal';
import { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import { useAuthStore } from '@/store';

export default function ModalLogin({ closeClickOutside = false }) {
  const modal = useModal();
  const { user } = useAuthStore();

  // Move modal.open to useEffect to prevent calling setState during render
  useEffect(() => {

    // current url
    const currentUrl = window.location.href;

    modal.open({ 
      title: 'Login',
      content: <LoginForm redirectUrlAfterLogin={currentUrl} />,
      size: 'md',
      closeOnClickOutside: closeClickOutside,
      showCloseButton: false,
    });

    // if user is logged in, close the modal
    if (user) {
      modal.close();
    }
  }, [modal, user]); // Add modal to dependency array

  return <div>
    {/** Login message */} 
    <p> </p> 
  </div>;
}