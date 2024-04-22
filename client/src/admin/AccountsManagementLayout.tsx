import React from 'react';
import { Outlet } from 'react-router-dom';

type Props = {};
async function fetchPageContent(pagePath) {
  // i want to render pages from sever in this react layout 
  try {
    const response = await fetch(`http://localhost:5000${pagePath}`);
    const htmlContent = await response.text();
    return htmlContent;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
}
const AccountsManagementLayout = (props: Props) => {
  return (
   
    <><Outlet /></>

  );
};

export default AccountsManagementLayout;